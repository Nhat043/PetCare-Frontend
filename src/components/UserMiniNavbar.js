import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserMiniNavbar = () => {
    const navigate = useNavigate();
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    if (!userData.full_name) return null;

    return (
        <div
            style={{
                position: 'absolute',
                top: 16,
                right: 24,
                background: '#222',
                color: '#fff',
                borderRadius: 20,
                padding: '6px 16px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                boxShadow: '0 2px 8px #2222',
                zIndex: 1000
            }}
            onClick={() => navigate('/user/profile')}
            title="View profile"
        >
            {userData.full_name}
        </div>
    );
};

export default UserMiniNavbar; 