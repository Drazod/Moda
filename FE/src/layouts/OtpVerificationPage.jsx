import React, { useState } from "react";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../configs/axiosInstance';
import { useLocation } from 'react-router-dom';

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axiosInstance.post('/auth/verify-otp', { otp, email });
      if ( res.data.user && res.data.token) {
            login(res.data.user, res.data.token);
            navigate('/', { replace: true });
            return;
      } else if (res.data && res.data.success) {
        setSubmitted(true); // fallback: show verified message if no token/user
      } else {
        setError(res.data?.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#bfaF92]">
      <div className="w-full max-w-md bg-[#bfaF92] rounded-lg shadow p-8 text-center">
        <h1 className="text-5xl font-dancing mb-6">Moda</h1>
        <h2 className="text-2xl font-semibold mb-2">Verify your email</h2>
        <p className="mb-4 text-gray-700">
          Please enter the OTP code sent to your email address to verify your account.<br />
          If you didn’t receive the code after 10 minutes, please check your spam folder or contact <a href="mailto:customer.help@goldleith.com" className="text-red-500 underline">customer.help@goldleith.com</a>
        </p>
        {submitted ? (
          <div className="text-green-700 font-semibold py-4">Your account has been verified!</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-full mb-4 p-2 rounded bg-[#efe5d6] border text-center tracking-widest text-lg"
              placeholder="Enter OTP code"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              maxLength={6}
            />
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <button
              type="submit"
              className="w-full py-2 rounded bg-[#434237] text-white font-semibold hover:bg-[#2f2e25]"
            >
              Verify
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
