import React from 'react';

const PostDetail = ({ post, onClose }) => {
    if (!post) return null;
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', borderRadius: '8px', padding: '32px', maxWidth: '600px', width: '100%', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                <h2>{post.title}</h2>
                <div><strong>Category ID:</strong> {post.category_id}</div>
                <div><strong>User ID:</strong> {post.user_id}</div>
                <div><strong>Status ID:</strong> {post.status_id}</div>
                <div><strong>Created At:</strong> {post.created_at}</div>
                <div><strong>Updated At:</strong> {post.updated_at}</div>
                <div style={{ margin: '20px 0' }}>
                    <strong>Content:</strong>
                    <div style={{ border: '1px solid #eee', borderRadius: '4px', padding: '12px', marginTop: '8px', background: '#fafafa' }}
                        dangerouslySetInnerHTML={{ __html: post.content_html }}
                    />
                </div>
                {post.image_url && <img src={post.image_url} alt="Post" style={{ maxWidth: '100%', borderRadius: '4px' }} />}
            </div>
        </div>
    );
};

export default PostDetail; 