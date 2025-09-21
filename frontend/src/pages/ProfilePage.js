// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Container, Form, Row, Col, Image, Card } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Profile.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });

  // Safe fetch profile
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (isMounted) setProfile(res.data);
      } catch (err) {
        if (isMounted) toast.error(err.response?.data?.message || 'Failed to fetch profile');
      }
    };

    fetchProfile();
    return () => { isMounted = false; };
  }, []);

  // Update profile info
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

  // Upload profile picture
  const handlePictureUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select an image first.');

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const res = await api.post('/profile/picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(res.data.message || 'Profile picture uploaded successfully!');
      setProfile(prev => ({ ...prev, profilePicture: res.data.profilePicture }));
      setFile(null);
      setPreview(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error uploading picture.');
    }
  };

  // Remove profile picture
  const handleRemovePicture = async () => {
    try {
      const res = await api.delete('/profile/picture');
      toast.success(res.data.message || 'Profile picture removed successfully!');
      setProfile(prev => ({ ...prev, profilePicture: '' }));
      setFile(null);
      setPreview(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error removing picture.');
    }
  };

  // Change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword)
      return toast.error('Please fill in both password fields.');
    if (passwords.newPassword.length < 6)
      return toast.error('New password must be at least 6 characters.');

    try {
      const res = await api.put('/profile/password', passwords);
      toast.success(res.data.message || 'Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error changing password.');
    }
  };

  // File preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  // Profile image URL
  const profileImageUrl = preview
    ? preview
    : profile.profilePicture
      ? `${process.env.REACT_APP_API_URL}/uploads/profilePictures/${profile.profilePicture}`
      : `${process.env.REACT_APP_API_URL}/uploads/profilePictures/default-profile.png`;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Container className="profile-container">
        <h2 className="gradient-text text-center mb-4">My Profile</h2>
        <Row>
          {/* Profile Picture */}
          <Col md={4} className="mb-4">
            <Card className="profile-card text-center p-3">
              <Image src={profileImageUrl} roundedCircle fluid className="profile-picture mb-3" />

              <Form onSubmit={handlePictureUpload}>
                <Form.Group>
                  <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                </Form.Group>
                <button type="submit" className="golden-btn mt-2">Upload Picture</button>
              </Form>

              {profile.profilePicture && (
                <button onClick={handleRemovePicture} className="btn-danger mt-2 p-2" style={{ color: 'white', borderRadius: '5px' }}>
                  Remove Picture
                </button>
              )}
            </Card>
          </Col>

          {/* Profile Info */}
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

                <button type="submit" className="golden-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
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
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    required
                  />
                </Form.Group>

                <button type="submit" className="golden-btn">Change Password</button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProfilePage;
