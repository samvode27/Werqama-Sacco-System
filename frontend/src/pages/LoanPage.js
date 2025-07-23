import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import NavigationBar from '../components/Navbar';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { setToken, setUser } = useAuth();

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await api.post('/auth/login', { email, password });
        console.log('Login successful:', res.data);

        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        setUser({
            name: res.data.name,
            role: res.data.role,
            email: res.data.email,
        });
        navigate('/');
    } catch (err) {
        console.error('Login error:', err.response?.data || err);
        setError(err.response?.data?.message || 'Login failed');
    }
};


    return (
        <>
            <NavigationBar />
            <Container className="mt-4" style={{ maxWidth: '400px' }}>
                <h2>Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="email" className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="password" className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" variant="primary">Login</Button>
                </Form>
            </Container>
        </>
    );
};

export default LoginPage;
