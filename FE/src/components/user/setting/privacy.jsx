import React, { useState } from "react";
import axiosInstance from  "../../../configs/axiosInstance";
import { useAuth } from "../../../context/AuthContext";

export default function PrivacyForm() {
  const { loading: authLoading } = useAuth(); // wait until token is ready (optional)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [ok, setOk] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
    setError(null);
    setOk(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setOk(null);

    const { currentPassword, newPassword, confirmPassword } = formData;

    // Client-side validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("New password must be different from current password.");
      return;
    }

    setSaving(true);
    try {
      // 🔁 Preferred: single endpoint that verifies `currentPassword` and updates to `newPassword`.
      // Adjust to your backend route: e.g. '/user/change-password' or '/auth/change-password'
      await axiosInstance.post("/user/change-password", {
        currentPassword,
        newPassword,
      });

      setOk("Password updated successfully.");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      // Nice error message
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update password.";
      setError(msg);

      // 🛈 If your API uses two routes with a member ID, switch to this pattern:
      //
      // const me = await axiosInstance.get('/user/profile');
      // const id = me.data?.data?.id || me.data?.user?.id || me.data?.id;
      // await axiosInstance.post(`/api/members/${id}/verify-password`, { currentPassword });
      // await axiosInstance.put(`/api/members/${id}/update-password`, { newPassword });
      // setOk('Password updated successfully.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return <div>Loading...</div>;

  return (
    <div className="w-3/4 p-6">
      <h2 className="text-3xl font-semibold mb-8">Change Password</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {ok && <div className="text-green-600 text-sm">{ok}</div>}

        <div>
          <label className="block text-black font-bold">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            autoComplete="current-password"
            className="w-2/3 bg-transparent border-b border-gray-400 focus:outline-none p-2 text-black"
          />
        </div>

        <div>
          <label className="block text-black font-bold">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            autoComplete="new-password"
            className="w-2/3 bg-transparent border-b border-gray-400 focus:outline-none p-2 text-black"
          />
        </div>

        <div>
          <label className="block text-black font-bold">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            autoComplete="new-password"
            className="w-2/3 bg-transparent border-b border-gray-400 focus:outline-none p-2 text-black"
          />
        </div>

        <div className="flex">
          <button
            type="submit"
            disabled={saving}
            className="w-60 mt-10 bg-gray-600 hover:bg-gray-700 rounded-md px-6 py-2 text-white disabled:opacity-60"
          >
            {saving ? "Updating..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
