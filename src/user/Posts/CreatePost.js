import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const POSTS_API = 'https://0h1aeqb3z9.execute-api.ap-southeast-2.amazonaws.com/api/v1/posts';
//const IMAGE_UPLOAD_API = 'https://0h1aeqb3z9.execute-api.ap-southeast-2.amazonaws.com/api/v1/posts/upload-image';
const CATEGORY_API = 'https://0h1aeqb3z9.execute-api.ap-southeast-2.amazonaws.com/api/v1/category';
const TAG_API = 'https://0h1aeqb3z9.execute-api.ap-southeast-2.amazonaws.com/api/v1/tag';
const IMAGE_UPLOAD_API = 'https://0h1aeqb3z9.execute-api.ap-southeast-2.amazonaws.com/api/v1/posts/upload-base64';
const CreatePost = () => {
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [userId, setUserId] = useState('');
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagId, setTagId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch categories and tags from API
    const fetchCategories = async () => {
        try {
            const response = await fetch(CATEGORY_API);
            const data = await response.json();
            if (response.ok) {
                setCategories(data.categories || []);
            } else {
                console.error('Failed to fetch categories:', data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    const fetchTags = async () => {
        try {
            const response = await fetch(TAG_API);
            const data = await response.json();
            if (response.ok) {
                setTags(data.tags || []);
            } else {
                console.error('Failed to fetch tags:', data);
            }
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    useEffect(() => {
        // Get user_id from sessionStorage
        const userData = sessionStorage.getItem('userData');
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            setUserId(parsedUserData.user_id.toString());
        }

        // Fetch categories and tags
        fetchCategories();
        fetchTags();

        if (editorRef.current && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: {
                        container: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['image']
                        ],
                        handlers: {
                            image: imageHandler
                        }
                    }
                }
            });
        }
        // eslint-disable-next-line
    }, []);

    async function imageHandler() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                try {
                    // Convert file to base64 (remove prefix)
                    const base64 = await fileToBase64(file);
                    const base64Data = base64.split(',')[1]; // Remove data:image/jpeg;base64, prefix
                    // Upload image as base64
                    const res = await fetch(IMAGE_UPLOAD_API, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            image_data: base64Data,
                            filename: file.name
                        })
                    });
                    const data = await res.json();
                    if (res.ok && data.s3_url) {
                        const range = quillRef.current.getSelection();
                        quillRef.current.insertEmbed(range.index, 'image', data.s3_url);
                    } else {
                        alert('Image upload failed: ' + (data.error || 'Unknown error'));
                    }
                } catch (err) {
                    console.error('Upload error:', err);
                    alert('Image upload error');
                }
            }
        };
    }

    // Helper to convert file to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const content_html = quillRef.current.root.innerHTML;
        if (!title || !userId || !categoryId || !tagId || !content_html) {
            setError('All fields are required.');
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(POSTS_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    user_id: Number(userId),
                    content_html,
                    category_id: Number(categoryId),
                    tag_id: Number(tagId)
                })
            });
            const data = await res.json();
            if (res.ok) {
                navigate('/dashboard#posts');
            } else {
                setError(data.error || 'Failed to create post');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f4f6fa', width: '100vw' }}>
            <div style={{ width: '100vw', maxWidth: '100vw', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #dbeafe', padding: 36, margin: '0 auto', paddingTop: 40, paddingBottom: 40 }}>
                <h1 style={{ textAlign: 'center', marginBottom: 32, fontWeight: 'bold', color: '#222', fontSize: '2.5rem' }}>Create a Post</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row', gap: 40, width: '100%' }}>
                    {/* Left side: Fields */}
                    <div style={{ flex: 1, minWidth: 260, maxWidth: 400 }}>
                        <div style={{ marginBottom: 20 }}>
                            <label htmlFor="title" style={{ display: 'block', marginBottom: 6, color: '#222', fontWeight: 'bold' }}>Title:</label>
                            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc', fontSize: '1rem' }} required />
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label htmlFor="categoryId" style={{ display: 'block', marginBottom: 6, color: '#222', fontWeight: 'bold' }}>Category:</label>
                            <select
                                id="categoryId"
                                value={categoryId}
                                onChange={e => setCategoryId(e.target.value)}
                                style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc', fontSize: '1rem' }}
                                required
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
                            <label htmlFor="tagId" style={{ display: 'block', marginBottom: 6, color: '#222', fontWeight: 'bold' }}>Tag:</label>
                            <select
                                id="tagId"
                                value={tagId}
                                onChange={e => setTagId(e.target.value)}
                                style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc', fontSize: '1rem' }}
                                required
                            >
                                <option value="">Select a tag</option>
                                {tags.map(tag => (
                                    <option key={tag.tag_id} value={tag.tag_id}>
                                        {tag.tag_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
                        <button type="submit" disabled={loading} style={{ padding: '12px 32px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, fontSize: '1.1rem', cursor: 'pointer', width: '100%' }}>
                            {loading ? 'Creating...' : 'Create Post'}
                        </button>
                    </div>
                    {/* Right side: Editor */}
                    <div style={{ flex: 2, minWidth: 0 }}>
                        <label style={{ display: 'block', marginBottom: 6, color: '#222', fontWeight: 'bold' }}>Content:</label>
                        <div ref={editorRef} style={{ height: 400, background: '#fafafa', borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost; 