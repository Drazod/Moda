import React, { useState, useRef } from 'react';
import { FaCamera, FaSpinner } from 'react-icons/fa';
import axiosInstance from '../../configs/axiosInstance';

const AvatarUpload = ({ currentAvatar, onAvatarUpdate }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(currentAvatar);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);

        // Upload file
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await axiosInstance.post('/user/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data?.user) {
                // Keep the preview URL since upload was successful
                onAvatarUpdate(previewUrl);
                alert('Avatar updated successfully!');
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Avatar upload error:', error);
            alert('Failed to update avatar. Please try again.');
            setPreviewUrl(currentAvatar); // Reset to original
        } finally {
            setIsUploading(false);
        }
    };

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="relative group">
            <div className="relative">
                <img
                    src={previewUrl || "https://via.placeholder.com/120"}
                    alt="Avatar"
                    className="rounded-full border w-20 h-20 object-cover"
                />
                
                {/* Upload overlay */}
                <div 
                    onClick={handleCameraClick}
                    className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                    {isUploading ? (
                        <FaSpinner className="text-white text-xl animate-spin" />
                    ) : (
                        <FaCamera className="text-white text-xl" />
                    )}
                </div>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
            />

            {/* Upload hint */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-gray-600 whitespace-nowrap">
                    {isUploading ? 'Uploading...' : 'Click to change'}
                </span>
            </div>
        </div>
    );
};

export default AvatarUpload;