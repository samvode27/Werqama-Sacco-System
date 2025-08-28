// src/pages/AdminManageMembersPage.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row, Col, Image, Spinner } from 'react-bootstrap';
import api from '../api/axios';
import { toast } from 'react-toastify';
import "../styles/AdminManageMembersPage.css";

const AdminManageMembersPage = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch approved members
  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/memberships/approved');
      setMembers(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch members');
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleView = (member) => {
    setSelectedMember(member);
    setFormData(member);
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setFormData(member);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    try {
      await api.delete(`/memberships/${id}`);
      toast.success('Member deleted');
      fetchMembers();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete member');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = async () => {
    if (!selectedMember) return;
    try {
      setLoading(true);
      const data = new FormData();

      for (const key in formData) {
        if (formData[key] !== undefined) {
          // If object/array, stringify it
          if (typeof formData[key] === 'object' && !(formData[key] instanceof File)) {
            data.append(key, JSON.stringify(formData[key]));
          } else {
            data.append(key, formData[key]);
          }
        }
      }

      await api.put(`/memberships/${selectedMember._id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Member updated successfully');
      setShowModal(false);
      fetchMembers();
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">👥 Manage Members</h2>
      <Table striped bordered hover responsive className="manage-members-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Occupation</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m._id}>
              <td>{m.fullName}</td>
              <td>{m.email}</td>
              <td>{m.phone}</td>
              <td>{m.occupation}</td>
              <td>
                <div className="action-buttons">
                  <Button size="sm" variant="info" onClick={() => handleView(m)}>View</Button>
                  <Button size="sm" variant="warning" onClick={() => handleEdit(m)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(m._id)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for View/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Member' : 'View Member'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMember && (
            <>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={formData.fullName || ''}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Occupation</Form.Label>
                    <Form.Control
                      type="text"
                      name="occupation"
                      value={formData.occupation || ''}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                      type="text"
                      name="gender"
                      value={formData.gender || ''}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                      type="number"
                      name="age"
                      value={formData.age || ''}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Education Level</Form.Label>
                    <Form.Control
                      type="text"
                      name="educationLevel"
                      value={formData.educationLevel || ''}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>ID Document</Form.Label>
                    {selectedMember.idDocument && !editMode && (
                      <Image
                        src={`http://localhost:8080/uploads/idDocuments/${selectedMember.idDocument}`}
                        alt="ID Document"
                        fluid
                        rounded
                        className="mb-2"
                      />
                    )}
                    {editMode && (
                      <Form.Control type="file" name="idDocument" onChange={handleChange} />
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <hr />
              <h5>👨‍👩‍👧 Beneficiaries:</h5>
              <div className="member-list-section">
                <ul>
                  {selectedMember.beneficiaries?.map((b, i) => (
                    <li key={i}>
                      {b.fullName}, Sub-City: {b.subCity}, City: {b.city}, District: {b.district}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5>🧾 Witnesses:</h5>
                <ul>
                  {selectedMember.witnesses?.map((w, i) => (
                    <li key={i}>
                      {w.fullName}, Sub-City: {w.subCity}, City: {w.city}, District: {w.district}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          {editMode && (
            <Button variant="success" onClick={handleUpdate} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminManageMembersPage;
