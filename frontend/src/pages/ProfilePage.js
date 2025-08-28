// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Container, Form, Button, Row, Col, Image, Card } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Profile.css';

const ProfilePage = () => {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });

    // Fetch profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/profile');
                setProfile(res.data);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to fetch profile');
            }
        };
        fetchProfile();
    }, []);

    // Profile update handler
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.put('/profile', profile);
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error updating profile.');
        } finally {
            setLoading(false);
        }
    };

    // Profile picture upload
    const handlePictureUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('Please select an image first.');
            return;
        }

        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const res = await api.post('/profile/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(res.data.message);

            // Update profile picture immediately (live preview)
            setProfile({ ...profile, profilePicture: res.data.profilePicture });
            setPreview(null);
            setFile(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error uploading picture.');
        }
    };

    // Remove profile picture
    const handleRemovePicture = async () => {
        try {
            const res = await api.delete('/profile/picture');
            toast.success(res.data.message);

            setProfile({ ...profile, profilePicture: '' });
            setPreview(null);
            setFile(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error removing picture.');
        }
    };

    // Password change
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!passwords.currentPassword || !passwords.newPassword) {
            toast.error('Please fill in both password fields.');
            return;
        }
        if (passwords.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters.');
            return;
        }
        try {
            const res = await api.put('/profile/password', passwords);
            toast.success(res.data.message);
            setPasswords({ currentPassword: '', newPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error changing password.');
        }
    };

    // File change preview
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) setPreview(URL.createObjectURL(selectedFile));
        else setPreview(null);
    };

    // Build profile image URL (backend)
    const profileImageUrl = preview
        ? preview
        : profile.profilePicture
            ? `${process.env.REACT_APP_API_URL}/uploads/profilePictures/${profile.profilePicture}`
            : `${process.env.REACT_APP_API_URL}/uploads/profilePictures/default-profile.png`;

    return (
        <>
            <ToastContainer />
            <Container className="profile-container">
                <h2 className="gradient-text text-center mb-4">My Profile</h2>
                <Row>
                    <Col md={4} className="mb-4">
                        <Card className="profile-card text-center p-3">
                            <Image
                                src={profileImageUrl}
                                roundedCircle
                                fluid
                                className="profile-picture mb-3"
                            />

                            <Form onSubmit={handlePictureUpload}>
                                <Form.Group>
                                    <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                                </Form.Group>
                                <Button type="submit" variant="primary" size="sm" className="mt-2">
                                    Upload Picture
                                </Button>
                            </Form>
                            {profile.profilePicture && (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="mt-2"
                                    onClick={handleRemovePicture}
                                >
                                    Remove Picture
                                </Button>
                            )}
                        </Card>
                    </Col>

                    <Col md={8}>
                        <Card className="profile-card p-4 mb-4">
                            <h5 className="gradient-text mb-3">Update Profile</h5>
                            <Form onSubmit={handleProfileUpdate}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={profile.name || ''}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" value={profile.email || ''} disabled />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={profile.phone || ''}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    />
                                </Form.Group>

                                <Button type="submit" variant="primary" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Form>
                        </Card>

                        <Card className="profile-card p-4">
                            <h5 className="gradient-text mb-3">Change Password</h5>
                            <Form onSubmit={handlePasswordChange}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Current Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={passwords.currentPassword}
                                        onChange={(e) =>
                                            setPasswords({ ...passwords, currentPassword: e.target.value })
                                        }
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={(e) =>
                                            setPasswords({ ...passwords, newPassword: e.target.value })
                                        }
                                        required
                                    />
                                </Form.Group>
                                <Button type="submit" variant="secondary">
                                    Change Password
                                </Button>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ProfilePage;
