import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setStep(2);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-reset-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetToken(data.resetToken);
        setSuccess(data.message);
        setStep(3);
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    // Validate strong password
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPassword.test(newPassword)) {
      setError("Password must be at least 8 characters with uppercase, lowercase, and a number.");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center text-center justify-center bg-[#bfaF92]">
      <h1 className="absolute text-8xl font-dancing top-40">Moda</h1>
      
      <div className="w-full max-w-md px-6">
        {/* Step 1: Enter Email */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-semibold mb-2">Reset Password</h2>
            <p className="mb-4 text-gray-700">
              Please enter your email address. You will receive an OTP code to reset your password.
            </p>
            
            {error && (
              <div className="text-red-600 bg-red-100 p-3 rounded mb-4">{error}</div>
            )}
            
            <form onSubmit={handleSendOtp}>
              <input
                type="email"
                className="w-full mb-4 p-3 rounded bg-[#efe5d6] border"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="submit"
                className="w-full py-3 rounded bg-[#434237] text-white font-semibold hover:bg-[#2f2e25] disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send OTP Code'}
              </button>
            </form>
          </>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-semibold mb-2">Verify OTP</h2>
            <p className="mb-4 text-gray-700">
              We've sent a 6-digit code to <strong>{email}</strong>. Please enter it below.
            </p>
            
            {error && (
              <div className="text-red-600 bg-red-100 p-3 rounded mb-4">{error}</div>
            )}
            {success && (
              <div className="text-green-600 bg-green-100 p-3 rounded mb-4">{success}</div>
            )}
            
            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                className="w-full mb-4 p-3 rounded bg-[#efe5d6] border text-center text-lg tracking-widest"
                placeholder="000000"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength="6"
                required
                disabled={loading}
              />
              <button
                type="submit"
                className="w-full py-3 rounded bg-[#434237] text-white font-semibold hover:bg-[#2f2e25] disabled:opacity-50 mb-2"
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                type="button"
                className="w-full py-2 text-[#434237] underline hover:text-[#2f2e25]"
                onClick={() => setStep(1)}
              >
                Back to email
              </button>
            </form>
          </>
        )}

        {/* Step 3: Set New Password */}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-semibold mb-2">New Password</h2>
            <p className="mb-4 text-gray-700">
              Please enter your new password. It must be at least 8 characters with uppercase, lowercase, and a number.
            </p>
            
            {error && (
              <div className="text-red-600 bg-red-100 p-3 rounded mb-4">{error}</div>
            )}
            {success && (
              <div className="text-green-600 bg-green-100 p-3 rounded mb-4">
                {success}
                <br />
                <span className="text-sm">Redirecting to login...</span>
              </div>
            )}
            
            <form onSubmit={handleResetPassword}>
              <input
                type="password"
                className="w-full mb-4 p-3 rounded bg-[#efe5d6] border"
                placeholder="New password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                disabled={loading}
              />
              <input
                type="password"
                className="w-full mb-4 p-3 rounded bg-[#efe5d6] border"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="submit"
                className="w-full py-3 rounded bg-[#434237] text-white font-semibold hover:bg-[#2f2e25] disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 text-sm text-gray-600">
          Remember your password? <a href="/login" className="text-[#434237] underline hover:text-[#2f2e25]">Sign in</a>
        </div>
      </div>
    </div>
  );
}