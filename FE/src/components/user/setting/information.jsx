import React, { useState, useEffect } from "react";
import { useUpdateUserProfileMutation } from "../../../configs/authentication/profileSlice";

function InformationForm({ id, name, number, address }) {
  const [formData, setFormData] = useState({ name, number, address });
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const [errorMessage, setErrorMessage] = useState('');

  // Sync formData with incoming props when they change
  useEffect(() => {
    setFormData({ name, number, address });
  }, [name, number, address]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;



    setErrorMessage('');

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validatePhoneNumber = () => {
    const { number } = formData;
    if (number.length < 10 || number.length > 11) {
      setErrorMessage('Number must be between 10 and 11 digits.');
      return false;
    }
    setErrorMessage('');
    return true;
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserProfile({ 
        id, 
        name: formData.name,
        phone: formData.number,
        address: formData.address}).unwrap();
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
      <h2 className="text-3xl font-semibold mb-8">Information</h2>
      {/* <div className="flex items-center mb-8">
        <img
          src="https://via.placeholder.com/128"
          alt="Avatar"
          className="w-24 h-24 rounded-full mr-6"
        />
        <button className="px-4 py-2 bg-gray-600 rounded-md text-white mr-6">
          Change avatar
        </button>
        <p className="text-gray-400 text-sm">
          File type: JPEG, PNG, GIF<br />
          Recommended dimension: 128x128<br />
          Recommended file size: 256kb
        </p>
      </div> */}

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
          onBlur={validatePhoneNumber} // Validate on input blur
          maxLength={11} // Prevent more than 11 digits
          className="w-2/3 bg-transparent border-b-[1px] focus:outline-none border-gray-400 p-2 text-white"
        />
        {errorMessage && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
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
