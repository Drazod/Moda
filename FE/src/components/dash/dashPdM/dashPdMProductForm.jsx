import React, { useState, useEffect, useRef } from 'react';
import { IoClose, IoCloudUploadOutline, IoAdd } from 'react-icons/io5';
import axiosInstance from '../../../configs/axiosInstance';

const sizeLabels = ['S', 'M', 'L', 'XL', '2XL'];

const DashPdMProductForm = ({ mode, product, onClose }) => {
    const isEditMode = mode === 'edit';
    const [name, setName] = useState(isEditMode && product ? product.name : '');
    const [price, setPrice] = useState(isEditMode && product ? product.price : '');
    const [categoryId, setCategoryId] = useState(isEditMode && product ? product.categoryId : '');
    const [showCategoryList, setShowCategoryList] = useState(false);
    const categoryInputRef = useRef(null);
    const [description, setDescription] = useState(isEditMode && product ? product.description : '');
    const [features, setFeatures] = useState(isEditMode && product ? (product.features?.map(f => f.value) || []) : []);
    const [featureInput, setFeatureInput] = useState('');
    const [mainImage, setMainImage] = useState(null);
    const [extraImages, setExtraImages] = useState([]);
    const [sizes, setSizes] = useState(isEditMode && product ? (product.sizes || sizeLabels.map(label => ({ label, quantity: 0 }))) : sizeLabels.map(label => ({ label, quantity: 0 })));
    const [materials, setMaterials] = useState('');
    const [information, setInformation] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch categories from API
        const fetchCategories = async () => {
            try {
                const res = await axiosInstance.get('/category/list');
                setCategories(res.data);
            } catch (err) {
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    const handleFeatureAdd = () => {
        if (featureInput.trim()) {
            setFeatures([...features, featureInput.trim()]);
            setFeatureInput('');
        }
    };
    const handleFeatureRemove = (idx) => {
        setFeatures(features.filter((_, i) => i !== idx));
    };

    const handleSizeChange = (label, value) => {
        setSizes(sizes.map(s => s.label === label ? { ...s, quantity: Number(value) || 0 } : s));
    };

    const handleMainImageChange = (e) => {
        setMainImage(e.target.files[0]);
    };
    const handleExtraImagesChange = (e) => {
        setExtraImages(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!name || !price || !categoryId || !description || !mainImage || sizes.every(s => !s.quantity)) {
            setError('Please fill all required fields, including price, and upload main image.');
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('description', description);
            // Find if categoryId matches a category from the list
            const matchedCategory = categories.find(cat => cat.name === categoryId);
            if (matchedCategory) {
                formData.append('categoryId', matchedCategory.id);
            } else {
                formData.append('categoryName', categoryId);
            }
            formData.append('mainImage', mainImage);
            // Send sizes as a JSON string array of objects
            const validSizes = sizes.filter(s => s.quantity > 0).map(s => ({ label: s.label, quantity: s.quantity }));
            formData.append('sizes', JSON.stringify(validSizes));
            // Send features as a JSON string array of objects
            const featureObjs = features.map(f => ({ value: f }));
            formData.append('features', JSON.stringify(featureObjs));
            extraImages.forEach(img => formData.append('extraImages', img));
            formData.append('materials', materials);
            formData.append('information', information);

            await axiosInstance.post('/clothes/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccess('Product added successfully!');
            setTimeout(() => {
                setSuccess('');
                onClose();
            }, 1200);
        } catch (err) {
            setError('Failed to add product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-[#F7F3EC] rounded-2xl shadow-lg p-8 w-full max-w-4xl relative">
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800"><IoClose /></button>
                <h2 className="text-2xl font-bold mb-6 text-center">{isEditMode ? 'Edit products' : 'Add new product'}</h2>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {/* left col */}
                    <div>
                        <label className="text-sm font-medium">Name *</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="product name..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]" />

                        <label className="mt-4 block text-sm font-medium">Price *</label>
                        <input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="price..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]" />

                        <label className="mt-4 block text-sm font-medium">Category *</label>
                        <div className="relative">
                            <input
                                ref={categoryInputRef}
                                className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE] focus:outline-none focus:ring-2 focus:ring-gray-400"
                                value={categoryId}
                                onChange={e => {
                                    setCategoryId(e.target.value);
                                    setShowCategoryList(true);
                                }}
                                onFocus={() => setShowCategoryList(true)}
                                onBlur={() => setTimeout(() => setShowCategoryList(false), 150)}
                                placeholder="Type or select category"
                                autoComplete="off"
                            />
                            {showCategoryList && categories.length > 0 && (
                                <div className="absolute z-20 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-auto">
                                    {categories
                                        .filter(cat => cat.name.toLowerCase().includes(categoryId.toLowerCase()))
                                        .map(cat => (
                                            <div
                                                key={cat.id}
                                                className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-800 text-base"
                                                onMouseDown={() => {
                                                    setCategoryId(cat.name);
                                                    setShowCategoryList(false);
                                                    if (categoryInputRef.current) categoryInputRef.current.blur();
                                                }}
                                            >
                                                {cat.name}
                                            </div>
                                        ))}
                                    {categories.filter(cat => cat.name.toLowerCase().includes(categoryId.toLowerCase())).length === 0 && (
                                        <div className="px-4 py-2 text-gray-400">No matches</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <label className="mt-4 block text-sm font-medium">Description *</label>
                        <textarea rows="4" value={description} onChange={e => setDescription(e.target.value)} placeholder="content..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]"></textarea>

                        <label className="mt-4 block text-sm font-medium">Feature</label>
                        <div className="p-3 rounded-lg bg-[#E5DACE] space-y-2">
                            {features.map((f, i) => (
                                <div key={i} className="flex items-center justify-between bg-white p-2 rounded">
                                    <span>{f}</span>
                                    <IoClose className="cursor-pointer" onClick={() => handleFeatureRemove(i)} />
                                </div>
                            ))}
                            <div className="flex items-center mt-2">
                                <input type="text" value={featureInput} onChange={e => setFeatureInput(e.target.value)} placeholder="Add feature..." className="flex-1 p-2 rounded border" />
                                <button type="button" onClick={handleFeatureAdd} className="ml-2 p-2 rounded bg-gray-300 hover:bg-gray-400"><IoAdd/></button>
                            </div>
                        </div>
                    </div>

                    {/* right col */}
                    <div>
                        <label className="text-sm font-medium">Main Image *</label>
                        <input type="file" accept="image/*" onChange={handleMainImageChange} className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]" />

                        <label className="mt-4 block text-sm font-medium">Extra Images</label>
                        <input type="file" accept="image/*" multiple onChange={handleExtraImagesChange} className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]" />

                        <label className="mt-4 block text-sm font-medium">Size *</label>
                        <div className="grid grid-cols-5 gap-2 mt-1">
                            {sizes.map(s => (
                                <div key={s.label} className="rounded-lg bg-[#E5DACE] p-2 text-center">
                                    <p className="font-semibold">{s.label}</p>
                                    <input type="number" min="0" value={s.quantity} onChange={e => handleSizeChange(s.label, e.target.value)} placeholder="stock" className="w-full text-xs text-center bg-white rounded mt-1"/>
                                </div>
                            ))}
                        </div>

                        <label className="mt-4 block text-sm font-medium">Materials</label>
                        <textarea rows="2" value={materials} onChange={e => setMaterials(e.target.value)} placeholder="content..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]"></textarea>

                        <label className="mt-4 block text-sm font-medium">Information</label>
                        <textarea rows="2" value={information} onChange={e => setInformation(e.target.value)} placeholder="content..." className="mt-1 w-full p-3 rounded-lg bg-[#E5DACE]"></textarea>
                    </div>
                </div>

                <div className="flex flex-col items-end space-y-2 mt-8">
                    {error && <div className="text-red-500 mb-2">{error}</div>}
                    {success && <div className="text-green-600 mb-2">{success}</div>}
                    <div className="flex space-x-4">
                        <button type="button" onClick={() => {
                            setName(''); setPrice(''); setCategoryId(''); setDescription(''); setFeatures([]); setFeatureInput(''); setMainImage(null); setExtraImages([]); setSizes(sizeLabels.map(label => ({ label, quantity: 0 }))); setMaterials(''); setInformation(''); setError(''); setSuccess('');
                        }} className={`px-8 py-3 rounded-lg text-white font-semibold ${isEditMode ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400 hover:bg-gray-500'}`}>
                            {isEditMode ? 'Disable' : 'Reset'}
                        </button>
                        <button type="submit" disabled={loading} className="px-8 py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-black disabled:opacity-60">{loading ? 'Saving...' : 'Confirm'}</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DashPdMProductForm;