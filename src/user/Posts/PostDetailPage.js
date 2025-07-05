import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const POSTS_API = 'https://0h1aeqb3z9.execute-api.ap-southeast-2.amazonaws.com/api/v1/posts';

const PostDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`${POSTS_API}/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setPost(data.post || data.data);
                } else {
                    setError(data.error || 'Failed to fetch post');
                }
            } catch (err) {
                setError('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return <div style={{ color: '#333', textAlign: 'center', marginTop: 40 }}>Loading...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>;
    if (!post) return <div style={{ color: '#333', textAlign: 'center', marginTop: 40 }}>Post not found.</div>;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f4f6fa' }}>
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #dbeafe', padding: 36, maxWidth: 600, width: '100%', color: '#222', position: 'relative' }}>
                <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888' }}>&times;</button>
                <h2 style={{ marginBottom: 16 }}>{post.title}</h2>
                <div style={{ marginBottom: 8 }}><strong>Post ID:</strong> {post.post_id}</div>
                <div style={{ marginBottom: 8 }}><strong>User ID:</strong> {post.user_id}</div>
                <div style={{ marginBottom: 8 }}><strong>Category ID:</strong> {post.category_id}</div>
                <div style={{ marginBottom: 8 }}><strong>Status ID:</strong> {post.status_id}</div>
                <div style={{ marginBottom: 8 }}><strong>Created At:</strong> {post.created_at}</div>
                <div style={{ marginBottom: 8 }}><strong>Updated At:</strong> {post.updated_at}</div>
                <div style={{ margin: '20px 0' }}>
                    <strong>Content:</strong>
                    <div style={{ border: '1px solid #eee', borderRadius: '4px', padding: '12px', marginTop: '8px', background: '#fafafa', color: '#222' }}
                        dangerouslySetInnerHTML={{ __html: post.content_html }}
                    />
                </div>
                {post.image_url && <img src={post.image_url} alt="Post" style={{ maxWidth: '100%', borderRadius: '4px' }} />}
            </div>
        </div>
    );
};

export default PostDetailPage; 