import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';

const CreateProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category_id: '',
        tag_id: '',
        image_url: '',
        stock: ''
    });
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
        fetchTags();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.CATEGORY);
            const data = await response.json();
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to load categories');
        }
    };

    const fetchTags = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.TAG);
            const data = await response.json();
            setTags(data.tags || []);
        } catch (error) {
            console.error('Error fetching tags:', error);
            setError('Failed to load tags');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setSelectedFile(null);
            setImagePreview(null);
        }
    };

    const uploadImage = async () => {
        if (!selectedFile) {
            throw new Error('No file selected');
        }

        // Convert file to base64
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                if (typeof reader.result === 'string') {
                    const base64Data = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix

                    try {
                        const response = await fetch(API_ENDPOINTS.PRODUCTS_UPLOAD_BASE64, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                image_data: base64Data,
                                filename: selectedFile.name
                            })
                        });

                        const data = await response.json();
                        if (response.ok) {
                            resolve(data.s3_url);
                        } else {
                            reject(new Error(data.message || 'Upload failed'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error('Failed to read file as base64 string.'));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(selectedFile);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            let imageUrl = formData.image_url;

            // Upload image if a new file is selected
            if (selectedFile) {
                setIsUploading(true);
                imageUrl = await uploadImage();
                setIsUploading(false);
            }

            // Create product
            const productData = {
                name: formData.name,
                price: parseInt(formData.price),
                category_id: parseInt(formData.category_id),
                tag_id: parseInt(formData.tag_id),
                image_url: imageUrl,
                stock: parseInt(formData.stock)
            };

            const response = await fetch(API_ENDPOINTS.PRODUCTS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Product created successfully!');
                navigate('/admin/products');
            } else {
                setError(data.message || 'Failed to create product');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            setError('Failed to create product. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f4f6fa', width: '100vw' }}>
            <div style={{ width: '100vw', maxWidth: '100vw', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #dbeafe', padding: 36, margin: '0 auto', paddingTop: 40, paddingBottom: 40 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                    <h1 style={{ fontWeight: 'bold', color: '#222', fontSize: '2.5rem' }}>Create Product</h1>
                    <button
                        onClick={() => navigate('/admin/products')}
                        style={{ padding: '12px 24px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: 6, fontSize: '1rem', cursor: 'pointer' }}
                    >
                        Back to Products
                    </button>
                </div>

                {error && (
                    <div style={{ padding: '12px', background: '#f8d7da', color: '#721c24', borderRadius: 6, marginBottom: 20, border: '1px solid #f5c6cb' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#333' }}>
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
                        />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#333' }}>
                            Price *
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
                        />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#333' }}>
                            Category *
                        </label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
                        >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                                <option key={category.category_id} value={category.category_id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#333' }}>
                            Tag *
                        </label>
                        <select
                            name="tag_id"
                            value={formData.tag_id}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
                        >
                            <option value="">Select a tag</option>
                            {tags.map(tag => (
                                <option key={tag.tag_id} value={tag.tag_id}>
                                    {tag.tag_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#333' }}>
                            Stock *
                        </label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="1"
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
                        />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#333' }}>
                            Product Image *
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
                        />
                        {selectedFile && (
                            <div style={{ marginTop: 8, fontSize: '0.9rem', color: '#666' }}>
                                Selected: {selectedFile.name}
                            </div>
                        )}
                        {imagePreview && (
                            <div style={{ marginTop: 16, textAlign: 'center' }}>
                                <img src={imagePreview} alt="Preview" style={{ maxWidth: '220px', maxHeight: '220px', borderRadius: 8, border: '1px solid #eee', boxShadow: '0 2px 8px #eee' }} />
                                <div style={{ fontSize: '0.85rem', color: '#888', marginTop: 4 }}>Image preview</div>
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#333' }}>
                            Image URL (optional - will be overridden if file is uploaded)
                        </label>
                        <input
                            type="url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleInputChange}
                            placeholder="https://example.com/image.jpg"
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <button
                            type="submit"
                            disabled={isSubmitting || isUploading}
                            style={{
                                padding: '14px 32px',
                                background: isSubmitting || isUploading ? '#6c757d' : '#28a745',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                fontSize: '1.1rem',
                                cursor: isSubmitting || isUploading ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold',
                                minWidth: '150px'
                            }}
                        >
                            {isSubmitting ? 'Creating...' : isUploading ? 'Uploading...' : 'Create Product'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            style={{
                                padding: '14px 32px',
                                background: '#6c757d',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                fontSize: '1.1rem',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProduct; 