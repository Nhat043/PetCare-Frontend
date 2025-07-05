import React from 'react';

const PostDetail = ({ post }) => {
    if (!post) return null;
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f6fa' }}>
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', padding: '40px', maxWidth: '800px', width: '100%' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center', color: '#333' }}>Post Content</div>
                <div style={{ border: '2px solid #4f8cff', borderRadius: '8px', padding: '32px', background: '#f0f6ff', fontSize: '1.5rem', textAlign: 'center', color: '#222' }}
                    dangerouslySetInnerHTML={{ __html: post.content_html }}
                />
            </div>
        </div>
    );
};

export default PostDetail; 