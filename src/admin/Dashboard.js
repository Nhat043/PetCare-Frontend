import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleUserManagement = () => {
        navigate('/admin/users');
    };

    const handleContentManagement = () => {
        navigate('/product');
    };

    const handleAnalytics = () => {
        // Placeholder for analytics functionality
        alert('Analytics feature coming soon!');
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Admin Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div style={{
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa'
                }}>
                    <h3>User Management</h3>
                    <p>Manage user accounts and permissions</p>
                    <button
                        onClick={handleUserManagement}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Manage Users
                    </button>
                </div>

                <div style={{
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa'
                }}>
                    <h3>Content Management</h3>
                    <p>Manage posts and products</p>
                    <button
                        onClick={handleContentManagement}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Manage Content
                    </button>
                </div>

                <div style={{
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa'
                }}>
                    <h3>Analytics</h3>
                    <p>View platform statistics and reports</p>
                    <button
                        onClick={handleAnalytics}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#ffc107',
                            color: 'black',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        View Analytics
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 