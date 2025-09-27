import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Login successful!');
                console.log('Login successful:', data);

                // Store user data in sessionStorage
                sessionStorage.setItem('userData', JSON.stringify({
                    user_id: data.user_id,
                    role_id: data.role_id,
                    full_name: data.full_name,
                    email: formData.email
                }));
                // Notify other components
                window.dispatchEvent(new Event('user-auth-changed'));

                // Redirect based on role_id
                if (data.role_id === 1) {
                    // Admin - redirect to admin dashboard
                    navigate('/admin/dashboard');
                } else if (data.role_id === 2) {
                    // User - redirect to user dashboard
                    navigate('/dashboard');
                } else {
                    // Unknown role - redirect to home
                    navigate('/');
                }
            } else {
                setMessage(data.error || 'Login failed');
                console.error('Login failed:', data);
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
            console.error('Network error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            <h2>Login</h2>
            {message && (
                <div style={{
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '4px',
                    backgroundColor: message.includes('successful') ? '#d4edda' : '#f8d7da',
                    color: message.includes('successful') ? '#155724' : '#721c24',
                    border: `1px solid ${message.includes('successful') ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.6 : 1
                    }}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
