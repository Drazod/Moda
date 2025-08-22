import React, { useState } from 'react';

const Support = () => {
  const [faqIndex, setFaqIndex] = useState(null); // State to track open FAQ
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const faqs = [
    { question: "How can I track my order?", answer: "You can track your order through the 'Order Tracking' section under your profile." },
    { question: "What is your refund policy?", answer: "Refunds are available within 30 days of purchase for eligible products." },
    { question: "How do I update my account information?", answer: "Go to 'Settings' in your profile and update your account information." },
    { question: "How do I contact customer support?", answer: "You can use the contact form below or start a live chat." },
  ];

  const toggleFaq = (index) => {
    setFaqIndex(faqIndex === index ? null : index); // Toggle the clicked FAQ
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for reaching out! We will get back to you soon.");
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="w-3/4 p-6">
      {/* Header */}

      <div className="container mx-auto py-10 px-4">
        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white shadow rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-6 py-4 font-medium text-gray-800 hover:bg-gray-100 flex justify-between items-center"
                >
                  <span>{faq.question}</span>
                  <span>{faqIndex === index ? "-" : "+"}</span>
                </button>
                {faqIndex === index && (
                  <div className="px-6 py-4 text-gray-700 border-t">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Support;
