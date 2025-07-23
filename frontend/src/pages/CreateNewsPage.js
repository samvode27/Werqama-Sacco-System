import React, { useState } from 'react';
import NavigationBar from '../components/Navbar';
import api from '../api/axios';
import { Container, Form, Button, Alert, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const CreateNewsPage = () => {
    const [form, setForm] = useState({ title: '', content: '' });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { user } = useAuth();

    if (user?.role !== 'admin') {
        navigate('/');
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('content', form.content);
        if (image) {
            formData.append('image', image);
        }
        try {
            await api.post('/news', formData);
            setSuccess('News created successfully!');
            setForm({ title: '', content: '' });
            setImage(null);
            setPreview('');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating news.');
            setSuccess('');
        }
    };

    return (
        <>
            <NavigationBar />
            <Container className="mt-4" style={{ maxWidth: '600px' }}>
                <h2>Create News</h2>
                {success && <Alert variant="success">{success}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="title" value={form.title} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Content</Form.Label>
                        <Form.Control as="textarea" rows={4} name="content" value={form.content} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Image (optional)</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                    </Form.Group>
                    {preview && <Image src={preview} alt="Preview" fluid rounded className="mb-3" />}
                    <Button type="submit" variant="primary">Create</Button>
                </Form>
            </Container>
        </>
    );
};

export default CreateNewsPage;
