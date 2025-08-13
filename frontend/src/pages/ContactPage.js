import React, { useState } from 'react';
import api from '../api/axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/contacts', form);
            setSuccess('Message sent successfully!');
            setForm({ name: '', email: '', message: '' });
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending message.');
            setSuccess('');
        }
    };

    return (
        <>
            <Container className="mt-4" style={{ maxWidth: '600px' }}>
                <h2>Contact Us</h2>
                {success && <Alert variant="success">{success}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Message</Form.Label>
                        <Form.Control as="textarea" rows={4} name="message" value={form.message} onChange={handleChange} required />
                    </Form.Group>
                    <Button type="submit" variant="primary">Send</Button>
                </Form>
            </Container>
        </>
    );
};

export default ContactPage;
