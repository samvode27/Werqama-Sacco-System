import React, { useState } from 'react';
import api from '../api/axios'; // ✅ use your configured Axios instance
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', formData); // ✅ use api
            toast.success('Registration successful!');
            localStorage.setItem('userInfo', JSON.stringify(data));

            if (data.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/member-dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4 text-center">Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone (optional)"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    Register
                </button>
            </form>
            <p className="mt-3 text-center">
                Already have an account?{' '}
                <a href="/login" className="text-decoration-none">
                    Login
                </a>
            </p>
        </div>
    );
}

export default RegisterPage;
