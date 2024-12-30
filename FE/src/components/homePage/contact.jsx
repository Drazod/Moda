import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import axios from 'axios';
import { styles } from "../homePage/styles.js";
import SectionWrapper from "../../../src/hoc/SectionWrapper.jsx";
import { slideIn } from "../../../src/utils/motion";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [toEmail, setToEmail] = useState("");

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await axios.get('http://localhost/api/email');
        if (response.status === 200 && response.data.success) {
          setToEmail(response.data.data[0].email);
        }
      } catch (err) {
        console.error("Error fetching email:", err.message);
      }
    };

    fetchEmail();
  }, []);

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send email using emailjs
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "Yumeow",
          from_email: form.email,
          to_email: toEmail,
          message: form.message,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      console.log("toEmail", toEmail);
      // Store message in the database
      const response = await axios.post('http://localhost/api/contactMessage', form);
      console.log("response", response);

      if (response.status === 200 && response.data.success) {
        setLoading(false);
        alert("Thank you. I will get back to you as soon as possible.");

        setForm({
          name: "",
          email: "",
          message: "",
        });
      } else {
        setLoading(false);
        alert("Ahh, something went wrong. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert("Ahh, something went wrong. Please try again.");
    }

    // emailjs
    //   .send(
    //     process.env.REACT_APP_EMAILJS_SERVICE_ID,
    //     process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
    //     {
    //       from_name: form.name,
    //       to_name: "Yumeow",
    //       from_email: form.email,
    //       to_email: "drazod2013@gmail.com",
    //       message: form.message,
    //     },
    //     process.env.REACT_APP_EMAILJS_PUBLIC_KEY
    //   )
    //   .then(
    //     () => {
    //       setLoading(false);
    //       alert("Thank you. I will get back to you as soon as possible.");

    //       setForm({
    //         name: "",
    //         email: "",
    //         message: "",
    //       });
    //     },
    //     (error) => {
    //       setLoading(false);
    //       console.error(error);

    //       alert("Ahh, something went wrong. Please try again.");
    //     }
    //   );
  };

  return (
    <div
      id="contact"
      className="w-full flex xl:flex-row flex-col-reverse  overflow-hidden"
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className='flex-[0.75] w-full bg-gradient-to-b from-[#BFAF92] to-[#595244] p-8 rounded-2xl'
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='mt-12 w-full flex flex-col gap-8'
        >
          <label className='flex w-full flex-col'>
            <span className='text-black font-medium mb-4'>Your Name</span>
            <input
              type='text'
              name='name'
              value={form.name}
              maxLength={30}
              onChange={handleChange}
              placeholder="What's your good name?"
              className='bg-[#E6DAC4]  py-4 px-6 placeholder:text-secondary text-black rounded-lg outline-none border-none font-medium'
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-black font-medium mb-4'>Your email</span>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email?"
              className='bg-[#E6DAC4] py-4 px-6 placeholder:text-secondary text-black rounded-lg outline-none border-none font-medium'
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-black font-medium mb-4'>Your Message</span>
            <textarea
              rows={7}
              name='message'
              value={form.message}
              maxLength={600}
              onChange={handleChange}
              placeholder='What you want to say?'
              className='bg-[#E6DAC4] py-4 px-6 placeholder:text-secondary text-black rounded-lg outline-none border-none font-medium'
            />
          </label>

          <button
            type='submit'
            className='bg-[#E6DAC4] py-3 px-8 rounded-xl outline-none w-fit text-black font-bold shadow-md shadow-primary'
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </motion.div>


    </div>
  );
};

export default SectionWrapper(Contact, "contact");