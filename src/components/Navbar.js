import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, isLoggedIn as checkIsLoggedIn, getCurrentUser } from '../auth/logout';
import './Navbar.css';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const loggedIn = checkIsLoggedIn();
            setIsLoggedIn(loggedIn);
            setUserData(loggedIn ? getCurrentUser() : null);
        };
        checkAuth(); // Initial check
        window.addEventListener('user-auth-changed', checkAuth);
        return () => {
            window.removeEventListener('user-auth-changed', checkAuth);
        };
    }, []);

    const handleLogout = () => {
        // Use the logout utility function
        logout(navigate);
        // Update state
        setIsLoggedIn(false);
        setUserData(null);
    };

    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/dashboard#posts">Posts</Link></li>
                <li><Link to="/product">Products</Link></li>
                {userData && userData.role_id === 1 && (
                    <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
                )}
                {!isLoggedIn ? (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                ) : (
                    <li>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                padding: '0',
                                textDecoration: 'underline'
                            }}
                        >
                            Logout
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar; 