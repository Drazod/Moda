import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import axiosInstance from '../configs/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Facebook from '../assets/login/facebook.png';
import Instagram from '../assets/login/instagram.png';
import YouTube from '../assets/login/youtube.png';
import TikTok from '../assets/login/tiktok.png';
import ImageBG from '../assets/login/imageBG.png';
import GroupImg from '../assets/login/GroupImage.png';

export default function LogInPage() {
  const [submitError, setSubmitError] = useState(null);
  const { login, user } = useAuth();

const navigate = useNavigate();
const location = useLocation();
const next = new URLSearchParams(location.search).get('next') || '/';

const onSubmit = async (values, { setSubmitting }) => {
  setSubmitError(null);

  try {
    const payload = {
      email: values.email.trim().toLowerCase(),
      password: values.password,
    };

    const { data } = await axiosInstance.post('/auth/login', payload);
    const token = data?.token;
    let   user  = data?.user;

    if (!token) {
      throw new Error('Login succeeded but no token was returned.');
    }

    // If API didn't include user, fetch it right away with the new token
    if (!user) {
      const me = await axiosInstance.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      user = me?.data?.user;
      if (!user) throw new Error('Unable to fetch user profile after login.');
    }

    // Store in your AuthContext (persists token to localStorage per your AuthProvider)
    login(user, token);

    // Instant redirect (you also have the <Navigate/> guard on mount)
    navigate(next, { replace: true });
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Login failed. Please check your credentials.';
    setSubmitError(message);
  } finally {
    setSubmitting?.(false);
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
                className="relative w-[min(40vw,350px)] z-20"   // cap width, responsive
                style={{ aspectRatio: '4 / 4.8' }}           // 5:4 ratio
              >
                {/* Card fills the 5:4 box */}
                <div className="absolute inset-0 bg-[#333333] text-[#EEEAE3] border-2 border-[#EEEAE3] rounded-md shadow-[0_10px_30px_rgba(0,0,0,.25)]">
                  {/* optional corner tabs */}
                  <span className="pointer-events-none absolute -top-2 left-8 w-4 h-4 rotate-45 border-t-2 border-l-2 border-[#EEEAE3]" />
                  <span className="pointer-events-none absolute -top-2 right-8 w-4 h-4 -rotate-45 border-t-2 border-r-2 border-[#EEEAE3]" />

                  {/* content area */}
                  <div className="h-full px-8 md:px-10 py-6 md:py-8 overflow-auto">
                    <div className="text-center">
                      <h2 className="text-[clamp(24px,4vw,34px)] font-dancing font-semibold leading-tight">
                        Welcome back
                      </h2>
                      <p className="text-[13px] md:text-sm opacity-80 -mt-1">
                        don’t have an account ?{' '}
                        <a href="/register" className="font-semibold underline underline-offset-4">Register</a>
                      </p>
                    </div>

                    {/* ✅ Formik form hooked to your onSubmit */}
                    <Formik
                      initialValues={{ email: "", password: "" }}
                      validate={(values) => {
                        const errors = {};
                        if (!values.email) errors.email = "Required";
                        if (!values.password) errors.password = "Required";
                        return errors;
                      }}
                      onSubmit={onSubmit}
                    >
                      {({ isSubmitting, errors, touched }) => (
                        <Form className="mt-6 md:mt-7 space-y-8 md:space-y-9">
                          <label className="block">
                            <span className="text-sm tracking-wide">email</span>
                            <Field
                              name="email"
                              type="email"
                              autoComplete="email"
                              placeholder="you@example.com"
                              className="
                                mt-2 w-full
                                bg-transparent !appearance-none
                                text-white caret-white
                                outline-none
                                border-0 border-b border-white/40 focus:border-white
                                py-2
                                placeholder:text-white/60
                                [color-scheme:dark]
                                [&::-ms-reveal]:hidden
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

                          <label className="block">
                            <span className="text-sm tracking-wide">password</span>
                            <Field
                              name="password"
                              type="password"
                              autoComplete="current-password"
                              placeholder="••••••••"
                              className="
                                mt-2 w-full
                                bg-transparent !appearance-none
                                text-white caret-white
                                outline-none
                                border-0 border-b border-white/40 focus:border-white
                                py-2
                                placeholder:text-white/60
                                [color-scheme:dark]
                                [&::-ms-reveal]:hidden
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

                          <div className="flex items-center justify-between text-sm">
                            <a href="/forgot-password" className="opacity-90 hover:opacity-100">Forgot password</a>
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="text-[clamp(18px,3vw,28px)] font-dancing font-semibold disabled:opacity-60"
                            >
                              {isSubmitting ? "Signing in..." : "Sign in"}
                            </button>
                          </div>

                          {/* Show API error from onSubmit */}
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
