import React, { useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import PageTransitionWrapper from '../components/PageTransitionWrapper';

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    });
    const [errors, setErrors] = useState({});

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!validatePassword(formData.password)) {
            newErrors.password =
                'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            const { data } = await api.post('/auth/register', formData);
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <PageTransitionWrapper>
            <div className="auth-wrapper">
                <div className="auth-container">
                    <h2>Create Account</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                            {errors.name && <small className="text-danger">{errors.name}</small>}
                        </div>
                        <div className="mb-3">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                            {errors.email && <small className="text-danger">{errors.email}</small>}
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
                            {errors.password && <small className="text-danger">{errors.password}</small>}
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
                        <button type="submit" className="btn btn-primary w-100">Register</button>
                    </form>
                    <p className="mt-3 text-center">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </PageTransitionWrapper>
    );
}

export default RegisterPage;