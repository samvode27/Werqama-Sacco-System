import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Table, Button, Modal, Form, Row, Col, Image, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import moment from 'moment';
import '../styles/AdminMembershipApprovalPage.css';

const AdminMembershipApprovalPage = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const fetchApplications = async () => {
    try {
      const { data } = await api.get('/memberships');
      setApplications(data);
    } catch {
      toast.error('Failed to fetch applications');
    }
  };

  // Only allow approve/reject if admin notes length >= 5 characters (adjust as needed)
  const isActionAllowed = adminNotes.trim().length >= 5;

  const handleDecision = async (status) => {
    if (!selectedApp) return;

    if (!isActionAllowed) {
      toast.warn('Please enter at least 5 characters for admin notes.');
      return;
    }

    try {
      setLoading(true);
      await api.put(`/memberships/${status === 'approved' ? 'approve' : 'reject'}/${selectedApp._id}`, {
        status,
        adminNotes,
      });
      toast.success(`Application ${status}`);
      setShowModal(false);
      setAdminNotes('');
      fetchApplications();
    } catch {
      toast.error('Action failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🧾 Membership Applications</h2>
      <Table striped bordered hover responsive className="shadow-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Submitted</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id}>
              <td>{app.fullName}</td>
              <td>{app.phone}</td>
              <td>
                <span className={`status-${app.status}`}>{app.status}</span>
              </td>
              <td>{moment(app.createdAt).fromNow()}</td>
              <td>
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => {
                    setSelectedApp(app);
                    setShowModal(true);
                    setAdminNotes(app.adminNotes || '');
                  }}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for review */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Application Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApp && (
            <>
              <Row>
                <Col md={6}>
                  <h5>📛 Full Name:</h5>
                  <p>{selectedApp.fullName}</p>

                  <h5>📩 Email:</h5>
                  <p>{selectedApp.email}</p>

                  <h5>📞 Phone:</h5>
                  <p>{selectedApp.phone}</p>

                  <h5>🧑 Gender:</h5>
                  <p>{selectedApp.gender}</p>

                  <h5>🎓 Education:</h5>
                  <p>{selectedApp.educationLevel}</p>

                  <h5>💼 Occupation:</h5>
                  <p>{selectedApp.occupation}</p>

                  <h5>🔖 Source of Info:</h5>
                  <p>{selectedApp.sourceOfInformation}</p>

                  <h5>📝 Agreement Accepted:</h5>
                  <p>{selectedApp.agreementAccepted ? '✅ Yes' : '❌ No'}</p>
                </Col>

                <Col md={6}>
                  <h5>🏠 Address:</h5>
                  <p>
                    Sub-City: {selectedApp.address?.subCity} <br />
                    City: {selectedApp.address?.city} <br />
                    District: {selectedApp.address?.district}
                  </p>

                  <h5>🆔 ID Document:</h5>
                  {selectedApp.idDocument ? (
                    <Image
                      src={`http://localhost:8080/uploads/${selectedApp.idDocument}`}
                      alt="ID Document"
                      fluid
                      rounded
                    />
                  ) : (
                    <p>No ID uploaded</p>
                  )}

                  <Form.Group className="mt-3">
                    <Form.Label>Admin Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Write notes here (at least 5 characters)..."
                    />
                  </Form.Group>
                </Col>
              </Row>

              <hr />
              <h5>👨‍👩‍👧 Beneficiaries:</h5>
              <ul>
                {selectedApp.beneficiaries?.map((b, i) => (
                  <li key={i}>
                    {b.fullName}, {b.subCity}, {b.city}, District {b.district}
                  </li>
                ))}
              </ul>

              <h5>🧾 Witnesses:</h5>
              <ul>
                {selectedApp.witnesses?.map((w, i) => (
                  <li key={i}>
                    {w.fullName}, {w.subCity}, {w.city}, District {w.district}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDecision('rejected')}
            disabled={loading || !isActionAllowed}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Reject'}
          </Button>
          <Button
            variant="success"
            onClick={() => handleDecision('approved')}
            disabled={loading || !isActionAllowed}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Approve'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminMembershipApprovalPage;
