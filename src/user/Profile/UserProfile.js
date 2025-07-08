import React, { useEffect, useState } from 'react';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    const userId = userData.user_id;

    useEffect(() => {
        if (!userId) return;
        fetch(`https://0h1aeqb3z9.execute-api.ap-southeast-2.amazonaws.com/api/v1/auth/id/${userId}`)
            .then(res => res.json())
            .then(data => setUser(data.user));
    }, [userId]);

    if (!user) return <div style={{ color: '#fff', marginTop: 40, textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{
            maxWidth: 400,
            margin: '60px auto',
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 12px #2222',
            padding: 32,
            color: '#222'
        }}>
            <h2 style={{ marginBottom: 24, textAlign: 'center' }}>User Profile</h2>
            <div style={{ marginBottom: 16 }}><strong>Full Name:</strong> {user.full_name}</div>
            <div style={{ marginBottom: 16 }}><strong>Email:</strong> {user.email}</div>
            <div style={{ marginBottom: 16 }}><strong>Created At:</strong> {user.created_at.slice(0, 10)}</div>
        </div>
    );
};

export default UserProfile; 