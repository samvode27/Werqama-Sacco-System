import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import NavigationBar from '../components/Navbar';
import { Container, Form, Button, Row, Col, Image } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Profile.css';

const ProfilePage = () => {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/profile');
                setProfile(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, []);

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

    const handlePictureUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('Please select an image first.');
            return;
        }
        const formData = new FormData();
        formData.append('profilePicture', file);
        try {
            await api.post('/profile/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Profile picture updated!');
            window.location.reload(); // Refresh to show new picture
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error uploading picture.');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!passwords.currentPassword || !passwords.newPassword) {
            toast.error('Please fill in both password fields.');
            return;
        }
        try {
            await api.put('/profile/password', passwords);
            toast.success('Password changed successfully!');
            setPasswords({ currentPassword: '', newPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error changing password.');
        }
    };

    return (
        <>
            <NavigationBar />
            <ToastContainer />
            <Container className="profile-container">
                <h2 className="mb-4">My Profile</h2>
                <Row>
                    <Col md={4} className="text-center mb-4">
                        {profile.profilePicture ? (
                            <Image
                                src={`http://localhost:5000/${profile.profilePicture}`}
                                roundedCircle
                                fluid
                                className="profile-picture"
                            />
                        ) : (
                            <Image
                                src="/default-profile.png"
                                roundedCircle
                                fluid
                                className="profile-picture"
                            />
                        )}
                        <Form onSubmit={handlePictureUpload} className="mt-3">
                            <Form.Group controlId="formFile">
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="mt-2 btn-sm">
                                Upload Picture
                            </Button>
                        </Form>
                    </Col>
                    <Col md={8}>
                        <Form onSubmit={handleProfileUpdate}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={profile.name || ''}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={profile.email || ''}
                                    disabled
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Form>
                        <hr />
                        <h5>Change Password</h5>
                        <Form onSubmit={handlePasswordChange}>
                            <Form.Group className="mb-3">
                                <Form.Label>Current Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                />
                            </Form.Group>
                            <Button type="submit" variant="secondary">
                                Change Password
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ProfilePage;
