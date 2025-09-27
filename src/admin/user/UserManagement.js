import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_ENDPOINTS.AUTH);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data.users || []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        // TODO: Implement API call to update user status
        console.log(`Updating user ${userId} status to ${newStatus}`);
        // For now, just update local state
        setUsers(users.map(user =>
            user.user_id === userId ? { ...user, status_name: newStatus } : user
        ));
    };

    const handleRoleChange = async (userId, newRole) => {
        // TODO: Implement API call to update user role
        console.log(`Updating user ${userId} role to ${newRole}`);
        // For now, just update local state
        setUsers(users.map(user =>
            user.user_id === userId ? { ...user, role_name: newRole } : user
        ));
    };

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Loading users...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Error loading users</h2>
                <p style={{ color: 'red' }}>{error}</p>
                <button
                    onClick={fetchUsers}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>User Management</h2>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Back to Dashboard
                </button>
            </div>
            <div style={{ marginTop: '20px' }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    border: '1px solid #ddd'
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left', color: 'black' }}>ID</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left', color: 'black' }}>Full Name</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left', color: 'black' }}>Email</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left', color: 'black' }}>Role</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left', color: 'black' }}>Status</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left', color: 'black' }}>Created Date</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left', color: 'black' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.user_id}>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.user_id}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.full_name}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.email}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    <select
                                        value={user.role_name}
                                        onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                                        style={{ padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: user.status_name === 'active' ? '#d4edda' : '#f8d7da',
                                        color: user.status_name === 'active' ? '#155724' : '#721c24'
                                    }}>
                                        {user.status_name}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    {user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : 'N/A'}
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    <button
                                        onClick={() => handleStatusChange(user.user_id, user.status_name === 'active' ? 'inactive' : 'active')}
                                        style={{
                                            padding: '4px 8px',
                                            marginRight: '5px',
                                            backgroundColor: user.status_name === 'active' ? '#dc3545' : '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {user.status_name === 'active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement; 