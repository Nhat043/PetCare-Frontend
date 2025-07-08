import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleUserManagement = () => {
        navigate('/admin/users');
    };

    const handleContentManagement = () => {
        navigate('/admin/products');
    };

    const handleAnalytics = () => {
        // Placeholder for analytics functionality
        alert('Analytics feature coming soon!');
    };

    return (
        <div style={{ padding: '20px', minHeight: '100vh', background: '#23262b' }}>
            <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: 40, fontSize: '2.5rem', fontWeight: 'bold' }}>Admin Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', justifyContent: 'center', alignItems: 'center', maxWidth: 1000, margin: '0 auto' }}>
                {/* Manage Users */}
                <div style={{
                    padding: '32px',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 24px #2222',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                    <h3 style={{ color: '#225', fontWeight: 'bold', fontSize: '2rem', marginBottom: 12 }}>User Management</h3>
                    <p style={{ color: '#333', fontSize: '1.2rem', marginBottom: 24 }}>Manage user accounts and permissions</p>
                    <button
                        onClick={handleUserManagement}
                        style={{
                            padding: '12px 32px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Manage Users
                    </button>
                </div>
                {/* Manage Posts */}
                <div style={{
                    padding: '32px',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 24px #2222',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                    <h3 style={{ color: '#225', fontWeight: 'bold', fontSize: '2rem', marginBottom: 12 }}>Post Management</h3>
                    <p style={{ color: '#333', fontSize: '1.2rem', marginBottom: 24 }}>Manage posts on the platform</p>
                    <button
                        onClick={() => navigate('/admin/posts')}
                        style={{
                            padding: '12px 32px',
                            backgroundColor: '#ff9800',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Manage Posts
                    </button>
                </div>
                {/* Manage Products */}
                <div style={{
                    padding: '32px',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 24px #2222',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                    <h3 style={{ color: '#225', fontWeight: 'bold', fontSize: '2rem', marginBottom: 12 }}>Product Management</h3>
                    <p style={{ color: '#333', fontSize: '1.2rem', marginBottom: 24 }}>Manage products on the platform</p>
                    <button
                        onClick={() => navigate('/admin/products')}
                        style={{
                            padding: '12px 32px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Manage Products
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 