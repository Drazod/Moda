import React, { useState } from "react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call your API to send reset email
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center text-center justify-center bg-[#bfaF92]">

        <h1 className="absolute text-8xl font-dancing top-40">Moda</h1>
        <h2 className="text-2xl font-semibold mb-2">Reset password</h2>
        <p className="mb-4 text-gray-700">
          Please enter your email address. You will then receive an email containing an email code to reset password.<br />
          If you don’t receive the email after 10 minutes, please contact <a href="mailto:customer.help@goldleith.com" className="text-red-500 underline">customer.help@goldleith.com</a>
        </p>
        {sent ? (
          <div className="text-green-700 font-semibold py-4">Check your email for the reset link!</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="w-full mb-4 p-2 rounded bg-[#efe5d6] border"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full py-2 rounded bg-[#434237] text-white font-semibold hover:bg-[#2f2e25]"
            >
              Send me the email
            </button>
          </form>
        )}
   
    </div>
  );
}
