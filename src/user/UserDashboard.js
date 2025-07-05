import React, { useState } from 'react';
import ProductIndex from './Product/Index';
import PostsIndex from './Posts/Index';

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('posts'); // Default to posts

    return (
        <div style={{ width: '100vw', minHeight: '100vh', padding: '32px 5vw', boxSizing: 'border-box' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Pet Care Platform</h2>
            <div style={{ display: 'flex', marginBottom: '30px', boxShadow: '0 2px 8px #eee', borderRadius: '8px', overflow: 'hidden', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
                <button
                    onClick={() => setActiveTab('posts')}
                    style={{
                        flex: 1,
                        padding: '16px',
                        backgroundColor: activeTab === 'posts' ? '#007bff' : '#f0f0f0',
                        color: activeTab === 'posts' ? 'white' : 'black',
                        border: 'none',
                        fontSize: '1.1rem',
                        fontWeight: activeTab === 'posts' ? 'bold' : 'normal',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                    }}
                >
                    Posts
                </button>
                <button
                    onClick={() => setActiveTab('products')}
                    style={{
                        flex: 1,
                        padding: '16px',
                        backgroundColor: activeTab === 'products' ? '#007bff' : '#f0f0f0',
                        color: activeTab === 'products' ? 'white' : 'black',
                        border: 'none',
                        fontSize: '1.1rem',
                        fontWeight: activeTab === 'products' ? 'bold' : 'normal',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                    }}
                >
                    Products
                </button>
            </div>
            <div>
                {activeTab === 'posts' ? <PostsIndex /> : <ProductIndex />}
            </div>
        </div>
    );
};

export default UserDashboard; 