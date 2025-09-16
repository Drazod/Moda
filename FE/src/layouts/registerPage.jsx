import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import axiosInstance from '../configs/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Facebook from '../assets/login/facebook.png';
import Instagram from '../assets/login/instagram.png';
import YouTube from '../assets/login/youtube.png';
import TikTok from '../assets/login/tiktok.png';
import ImageBG from '../assets/login/imageBG.png';
import GroupImg from '../assets/login/GroupImage.png';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [submitError, setSubmitError] = useState(null);
  const { login, user } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  const navigate = useNavigate();

  const onRegister = async (values) => {
    setSubmitError(null);

    // build payload; include optional fields only if present
    const payload = {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
      ...(values.phone?.trim() ? { phone: values.phone.trim() } : {}),
      ...(values.address?.trim() ? { address: values.address.trim() } : {}),
    };

    try {
      // 1) Create account
      const res = await axiosInstance.post('/auth/register', payload);

      // Some APIs return { user, token }, others return just the user.
      const userFromRegister = res.data?.user ?? res.data;
      const tokenFromRegister = res.data?.token;

      if (userFromRegister && tokenFromRegister) {
        // store in AuthContext (this also persists token to localStorage in your AuthProvider)
        login(userFromRegister, tokenFromRegister);
        navigate('/', { replace: true });
        return;
      }

      // 2) Fallback: immediately sign in to get a token
      const signIn = await axiosInstance.post('/auth/signin', {
        email: payload.email,
        password: payload.password,
      });

      if (signIn.data?.user && signIn.data?.token) {
        login(signIn.data.user, signIn.data.token);
        navigate('/', { replace: true });
        return;
      }

      throw new Error('Signup succeeded but no token was returned.');
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Sign up failed.';
      setSubmitError(msg);
    }
  };

  return (
    <div className="bg-[#d6c8a1] flex justify-center items-center min-h-screen relative overflow-hidden">
      <div className="absolute top-0 left-0 h-full w-full bg-[#d6c8a1]">
        {/* Diagonal Lines */}
      <div className="diagonal-line-top"></div>
      <div className="diagonal-line-bottom"></div>
        <div className="flex justify-between items-center h-[65vh] mt-[17.5vh]">
          {/* Left Side (Social Media Logos) */}
          <div className="shrink-0 w-[17.68vh] h-full  flex flex-col items-center  ">
            {/* Middle — vertically centered icons */}
            <div className="flex-1 flex items-center">
              <div className="flex flex-col gap-14 items-center">
                <a href="#"><img src={Facebook} alt="Facebook" className="h-10" /></a>
                <a href="#"><img src={Instagram} alt="Instagram" className="h-10" /></a>
                <a href="#"><img src={YouTube} alt="YouTube" className="h-10" /></a>
                <a href="#"><img src={TikTok} alt="TikTok" className="h-10" /></a>
              </div>
            </div>

            {/* Bottom — sits above the edge */}
            <a href="/home" className="text-lg border-[1px] p-1 -mb-2 border-black hover:text-gray-500 font-bold text-[#5f5f5f] -rotate-45">Home</a>
          </div>


          {/* Right Side (Form) */}
          <div className="flex-1 h-full border-[1px] !border-black flex items-center gap-10 relative">
            {/* LEFT: Moda + illustration */}
            <div className="flex-none w-[20vh] sm:w-[40vh] md:w-[50vh] h-full
                            relative flex flex-col items-center justify-center
                            text-center ">
              <h1 className="absolute top-20 text-[clamp(28px,6vw,70px)] leading-none font-dancing font-semibold text-black/90">
                Moda
              </h1>

              <img
                src={ImageBG}
                alt="Moda illustration"
                className="block absolute -bottom-3 w-full max-h-[80%] object-contain select-none pointer-events-none"
              />
            </div>

            {/* RIGHT SIDE */}
            <div className="relative flex-1 h-full grid place-items-center">

              {/* Photos behind the card */}
              <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
                {/* left tall */}
                <img src={GroupImg} alt="" className="absolute top-2 object-cover" />
              
              </div>

              {/* Hanger pin + strings */}


              <div
                className="relative w-[min(40vw,400px)] z-20"   // cap width, responsive
                style={{ aspectRatio: '4 / 4.8' }}           // 5:4 ratio
              >
                {/* Card fills the 5:4 box */}
                <div className="absolute inset-0 bg-[#333333] text-[#EEEAE3] border-2 border-[#EEEAE3] rounded-md shadow-[0_10px_30px_rgba(0,0,0,.25)]">
                  {/* optional corner tabs */}
                  <span className="pointer-events-none absolute -top-2 left-8 w-4 h-4 rotate-45 border-t-2 border-l-2 border-[#EEEAE3]" />
                  <span className="pointer-events-none absolute -top-2 right-8 w-4 h-4 -rotate-45 border-t-2 border-r-2 border-[#EEEAE3]" />

                  {/* content area */}
                  <div className="h-full px-8 md:px-10 py-4 md:py-6 overflow-auto">
                    <div className="text-center">
                      <h2 className="text-[clamp(24px,4vw,34px)] font-dancing font-semibold leading-tight">
                        Nice to meet you
                      </h2>
                      <p className="text-[13px] md:text-sm opacity-80 -mt-1">
                        already have an account ?{' '}
                        <a href="/login" className="font-semibold underline underline-offset-4">Login</a>
                      </p>
                    </div>

                    {/* ✅ Formik form hooked to your onSubmit */}
                    <Formik
                      initialValues={{ name: '', phone: '', email: '', password: '', confirmPassword: '' }}
                      validate={(v) => {
                        const errors = {};
                        if (!v.name.trim()) errors.name = 'Required';
                        if (!v.phone) errors.phone = 'Required';
                        else {
                          const digits = v.phone.replace(/\D/g, '');
                          if (digits.length < 8) errors.phone = 'Invalid phone number';
                        }
                        if (!v.email) errors.email = 'Required';
                        if (!v.password) errors.password = 'Required';
                        if (!v.confirmPassword) errors.confirmPassword = 'Required';
                        else if (v.confirmPassword !== v.password) errors.confirmPassword = 'Passwords do not match';
                        return errors;
                      }}
                      onSubmit={onRegister}
                    >
                      {({ isSubmitting, errors, touched }) => (
                        <Form className="mt-2 space-y-8 md:space-y-9">
                          {/* Name */}
                          <label className="block">
                            <span className="text-sm tracking-wide">name</span>
                            <Field
                              name="name"
                              type="text"
                              autoComplete="name"
                              placeholder="Your name"
                              className="
                                w-full bg-transparent !appearance-none
                                text-white caret-white outline-none
                                border-0 border-b border-white/40 focus:border-white
                                 placeholder:text-white/60
                                [color-scheme:dark] [&::-ms-reveal]:hidden
                              "
                            />
                            {touched.name && errors.name && (
                              <span className="text-red-300 text-xs">{errors.name}</span>
                            )}
                          </label>

                          {/* Phone */}
                          <label className="block">
                            <span className="text-sm tracking-wide">phone</span>
                            <Field
                              name="phone"
                              type="tel"
                              inputMode="tel"
                              autoComplete="tel"
                              placeholder="+84 912 345 678"
                              className="
                                w-full bg-transparent !appearance-none
                                text-white caret-white outline-none
                                border-0 border-b border-white/40 focus:border-white
                                py-2 placeholder:text-white/60
                                [color-scheme:dark] [&::-ms-reveal]:hidden
                              "
                            />
                            {touched.phone && errors.phone && <span className="text-red-300 text-xs">{errors.phone}</span>}
                          </label>

                          {/* Email */}
                          <label className="block">
                            <span className="text-sm tracking-wide">email</span>
                            <Field
                              name="email"
                              type="email"
                              autoComplete="email"
                              placeholder="you@example.com"
                              className="
                                 w-full bg-transparent !appearance-none
                                text-white caret-white outline-none
                                border-0 border-b border-white/40 focus:border-white
                                 placeholder:text-white/60
                                [color-scheme:dark] [&::-ms-reveal]:hidden
                                [&:-webkit-autofill]:text-white
                                [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#333333]
                                [&:-webkit-autofill]:border-b
                                [&:-webkit-autofill]:border-white/40
                              "
                            />
                            {touched.email && errors.email && (
                              <span className="text-red-300 text-xs">{errors.email}</span>
                            )}
                          </label>

                          {/* Password */}
                          <label className="block">
                            <span className="text-sm tracking-wide">password</span>
                            <Field
                              name="password"
                              type="password"
                              autoComplete="new-password"
                              placeholder="••••••••"
                              className="
                                 w-full bg-transparent !appearance-none
                                text-white caret-white outline-none
                                border-0 border-b border-white/40 focus:border-white
                                 placeholder:text-white/60
                                [color-scheme:dark] [&::-ms-reveal]:hidden
                                [&:-webkit-autofill]:text-white
                                [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#333333]
                                [&:-webkit-autofill]:border-b
                                [&:-webkit-autofill]:border-white/40
                              "
                            />
                            {touched.password && errors.password && (
                              <span className="text-red-300 text-xs">{errors.password}</span>
                            )}
                          </label>

                          {/* Re-enter Password */}
                          <label className="block">
                            <span className="text-sm tracking-wide">re-enter password</span>
                            <Field
                              name="confirmPassword"
                              type="password"
                              autoComplete="new-password"
                              placeholder="••••••••"
                              className="
                                 w-full bg-transparent !appearance-none
                                text-white caret-white outline-none
                                border-0 border-b border-white/40 focus:border-white
                                 placeholder:text-white/60
                                [color-scheme:dark] [&::-ms-reveal]:hidden
                              "
                            />
                            {touched.confirmPassword && errors.confirmPassword && (
                              <span className="text-red-300 text-xs">{errors.confirmPassword}</span>
                            )}
                          </label>

                          <div className="flex items-center justify-end text-sm">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="text-[clamp(18px,3vw,28px)] font-dancing font-semibold disabled:opacity-60"
                            >
                              {isSubmitting ? 'Signing up...' : 'Sign up'}
                            </button>
                          </div>

                          {submitError && (
                            <div className="text-red-300 text-sm pt-2">{submitError}</div>
                          )}
                        </Form>
                      )}
                    </Formik>
                  </div>
                  {/* subtle outline */}
                  <div className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-white/35" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Diagonal Line at Bottom */}
      
      </div>
    </div>
  );
}
