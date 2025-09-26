import React, { useState, useRef } from 'react';
import { IoClose, IoCloudUploadOutline } from 'react-icons/io5';
import axiosInstance from '../../../configs/axiosInstance';

const DashUptNNoticeForm = ({ mode, notice, onClose, onCreated }) => {
    const isEditMode = mode === 'edit';
    const [form, setForm] = useState({
        title: isEditMode && notice ? notice.title : '',
        subtitle: isEditMode && notice ? notice.subtitle : '',
        content: isEditMode && notice ? notice.content : '',
        pages: isEditMode && notice ? (Array.isArray(notice.pages) ? notice.pages : [notice.pages]) : [],
        state: isEditMode && notice ? notice.state : false,
    });
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePageChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setForm((prev) => ({ ...prev, pages: selectedOptions }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleReset = () => {
        setForm({ title: '', subtitle: '', content: '', pages: [], state: false });
        setImage(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const data = new FormData();
            data.append('title', form.title);
            data.append('content', form.content);
            data.append('pages', JSON.stringify(form.pages));
            if (form.subtitle) data.append('subtitle', form.subtitle);
            data.append('state', form.state ? 'true' : 'false');
            if (form.pages.includes('welcome page') && image) {
                data.append('image', image);
            }
            await axiosInstance.post('/notice', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            handleReset();
            if (onCreated) onCreated();
            if (onClose) onClose();
        } catch (err) {
            setError('Failed to create notice');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-[#F7F3EC] rounded-2xl shadow-lg p-8 w-full max-w-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl"><IoClose /></button>
                <h2 className="text-2xl font-bold mb-6 text-center">{isEditMode ? 'Edit notice' : 'Add new notice'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Title</label>
                            <input name="title" value={form.title} onChange={handleChange} type="text" placeholder="title..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Subtitle</label>
                            <input name="subtitle" value={form.subtitle} onChange={handleChange} type="text" placeholder="subtitle..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Image (welcome page only)</label>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Content</label>
                            <textarea name="content" value={form.content} onChange={handleChange} rows="4" placeholder="content..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]" required></textarea>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Page(s)</label>
                            <select
                                name="pages"
                                multiple
                                value={form.pages}
                                onChange={handlePageChange}
                                className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]"
                                required
                                size={4}
                            >
                                <option value="welcomepage">Welcome Page</option>
                                <option value="homepage">Home Page</option>
                                <option value="profile">Profile Page</option>
                                <option value="others">Others</option>
                            </select>
                            <div className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple pages.</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input name="state" type="checkbox" checked={form.state} onChange={handleChange} id="notice-state" />
                            <label htmlFor="notice-state" className="text-sm font-medium">Active</label>
                        </div>
                    </div>
                    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                    <div className="flex justify-end space-x-4 mt-8">
                        <button type="button" onClick={handleReset} className="px-8 py-3 rounded-lg bg-red-500 text-white font-semibold">Reset</button>
                        <button type="submit" className="px-8 py-3 rounded-lg bg-gray-800 text-white font-semibold">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DashUptNNoticeForm;