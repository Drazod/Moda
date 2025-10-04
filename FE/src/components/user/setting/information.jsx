import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from  "../../../configs/axiosInstance";
import { useAuth } from "../../../context/AuthContext";
import AvatarUpload from "../AvatarUpload";

function toDateInputValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  // YYYY-MM-DD
  return d.toISOString().slice(0, 10);
}

export default function InformationForm() {
  const { loading: authLoading } = useAuth(); // optional; ensures token is ready
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (authLoading) return; // wait until token is available
    (async () => {
      try {
        const { data } = await axiosInstance.get("/user/profile");
        // accept several response shapes: {success,data}, {user}, or the user itself
        const u = data?.data ?? data?.user ?? data;

        const normalized = {
          id: u?.id ?? u?.member_ID ?? "",
          name: u?.name ?? "",
          phone: u?.phone ?? u?.phone_number ?? "",
          address: u?.address ?? "",
          birthdate: toDateInputValue(u?.birthdate),
        };

        setMember(u);
        setFormData(normalized);
        setAvatarUrl(u?.avatar?.url || null);
      } catch (e) {
        console.error("Failed to load profile:", e);
        setSubmitError(
          e?.response?.data?.message || e?.message || "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading]);

  const initialForm = useMemo(() => formData, [member]); // for manual reset

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleAvatarUpdate = (newAvatarUrl) => {
    setAvatarUrl(newAvatarUrl);
    // Also update the member state if needed
    setMember(prev => ({
      ...prev,
      avatar: { url: newAvatarUrl }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Build payload; align keys with backend (using `phone`, not `phone_number`)
    const payload = {
      name: formData.name?.trim(),
      phone: formData.phone?.trim(),
      address: formData.address?.trim(),
    };

    try {
    // Consistent POST usage: assign response, destructure data, use message
    const { data } = await axiosInstance.post("/user/update", payload);
    alert(data?.message || "Profile updated successfully!");
    } catch (e) {
      console.error("Error updating profile:", e);
      setSubmitError(
        e?.response?.data?.message || e?.message || "Failed to update profile."
      );
    }
  };

  const handleReset = () => {
    // Reset controlled state (button type="reset" doesn't update React state)
    setFormData(initialForm);
  };

  if (authLoading || loading) return <div>Loading...</div>;

  return (
    <div className="w-3/4 p-6">
      <h2 className="text-3xl font-semibold mb-8">Account Details</h2>

      {/* Avatar Upload */}
      <div className="mb-8">
        <h3 className="text-black font-bold mb-4">Change Avatar</h3>
        <div className="flex items-center">
          <div className="mr-6">
            <AvatarUpload 
              currentAvatar={avatarUrl}
              onAvatarUpdate={handleAvatarUpdate}
              size="large"
            />
          </div>
          <div className="text-gray-600 text-sm">
            <p className="mb-2"><strong>File types:</strong> JPEG, PNG, GIF</p>
            <p className="mb-2"><strong>Recommended size:</strong> 128x128 pixels</p>
            <p className="mb-2"><strong>Max file size:</strong> 5MB</p>
            <p className="text-xs text-gray-500">Click on the avatar to change it</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {submitError && (
          <div className="text-red-600 text-sm">{submitError}</div>
        )}

        {/* Name */}
        <div>
          <label className="block text-black font-bold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleInputChange}
            className="w-2/3 bg-transparent border-b border-gray-400 focus:outline-none p-2 text-gray-600"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-black font-bold">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleInputChange}
            className="w-2/3 bg-transparent border-b border-gray-400 focus:outline-none p-2 text-gray-600"
            placeholder="+84 912 345 678"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-black font-bold">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={handleInputChange}
            className="w-2/3 bg-transparent border-b border-gray-400 focus:outline-none p-2 text-gray-600"
          />
        </div>

        {/* Save and Reset */}
        <div className="flex space-x-24">
          <button
            type="button"
            onClick={handleReset}
            className="w-60 mt-4 bg-red-600 hover:bg-red-700 rounded-md px-6 py-2 text-white"
          >
            Reset
          </button>
          <button
            type="submit"
            className="w-60 mt-4 bg-gray-600 hover:bg-gray-700 rounded-md px-6 py-2 text-white"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
