import React, { useState, useEffect } from "react";
import { useUpdateUserProfileMutation } from "../../../configs/authentication/profileSlice";

function InformationForm({ name, number, address }) {
  const [formData, setFormData] = useState({ name, number, address });
  const [updateUserProfile] = useUpdateUserProfileMutation();

  // Sync formData with incoming props when they change
  useEffect(() => {
    setFormData({ name, number,address });
  }, [name, number, address]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserProfile({ id: "1", name: formData.name }).unwrap();
      console.log("Profile updated successfully:", response);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({ name, number, address });
  };

  return (
    <div className="w-3/4 p-6">
      <h2 className="text-3xl font-semibold mb-8">Account</h2>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-black">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-2/3 bg-transparent border-b-[1px] focus:outline-none border-gray-400 p-2 text-white"
          />
        </div>

        <div>
          <label className="block text-black">Number</label>
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleInputChange}
            className="w-2/3 bg-transparent border-b-[1px] focus:outline-none border-gray-400 p-2 text-white"
          />
        </div>

        <div>
          <label className="block text-black">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-2/3 bg-transparent border-b-[1px] focus:outline-none border-gray-400 p-2 text-white"
          />
        </div>

        <div className="flex space-x-24">
          <button
            type="submit"
            className="w-60 mt-10 bg-gray-600 hover:bg-gray-700 rounded-md px-6 py-2"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="w-60 mt-10 bg-red-600 hover:bg-red-700 rounded-md px-6 py-2"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default InformationForm;
