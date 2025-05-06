import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isRegistering) {
                // Handle registration
                await axios.post('http://localhost:5000/api/users/register', {
                    username,
                    password
                });
                setError('Registration successful! Please login.');
                setIsRegistering(false);
            } else {
                // Handle login
                const response = await axios.post('http://localhost:5000/api/users/login', {
                    username,
                    password
                });
                onLogin(response.data.token, response.data.isAdmin);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div className="login-container">
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
            </form>
            <button 
                className="switch-mode-btn" 
                onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                }}
            >
                {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
            </button>
        </div>
    );
}

export default Login;