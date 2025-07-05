import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin', status: 'active' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive' }
    ]);

    const handleStatusChange = (userId, newStatus) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, status: newStatus } : user
        ));
    };

    const handleRoleChange = (userId, newRole) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, role: newRole } : user
        ));
    };

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
                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Role</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.id}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.name}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.email}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
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
                                        backgroundColor: user.status === 'active' ? '#d4edda' : '#f8d7da',
                                        color: user.status === 'active' ? '#155724' : '#721c24'
                                    }}>
                                        {user.status}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    <button
                                        onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}
                                        style={{
                                            padding: '4px 8px',
                                            marginRight: '5px',
                                            backgroundColor: user.status === 'active' ? '#dc3545' : '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
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