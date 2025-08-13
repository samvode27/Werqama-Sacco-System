import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Table, Spinner, Alert, Button, Modal, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/LoanHistoryTable.css';

const LoanHistoryTable = () => {
  const { token } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTimeline, setSelectedTimeline] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800 });

    const fetchLoans = async () => {
      try {
        const { data } = await api.get('/loans/my-loans', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLoans(data);
      } catch (err) {
        setError('Failed to load your loan history.');
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, [token]);

  const openTimelineModal = (timeline) => {
    setSelectedTimeline(timeline);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedTimeline([]);
    setShowModal(false);
  };

  return (
    <div className="loan-history-table" data-aos="fade-up">
      <h3 className="table-title text-center mb-3">📜 My Loan History</h3>

      {loading ? (
        <div className="text-center"><Spinner animation="border" variant="primary" /></div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : loans.length === 0 ? (
        <Alert variant="info">No loan applications submitted yet.</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="rounded shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Amount</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Submitted On</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan, index) => (
                <tr key={loan._id}>
                  <td>{index + 1}</td>
                  <td>ETB {loan.loanAmount.toLocaleString()}</td>
                  <td>{loan.loanPurpose}</td>
                  <td>
                    <span className={`status-badge ${loan.status}`}>
                      {loan.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{new Date(loan.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => openTimelineModal(loan.statusTimeline)}
                    >
                      View Notes
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal for all notes */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Status Timeline Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTimeline.length === 0 ? (
            <p>No notes available.</p>
          ) : (
            <ul className="list-group">
              {selectedTimeline.map((entry, idx) => (
                <li
                  key={idx}
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    entry.status === 'rejected' ? 'list-group-item-danger' : ''
                  }`}
                >
                  <div>
                    <strong>{entry.status.toUpperCase()}</strong>
                    <br />
                    <span className="text-muted small">
                      {new Date(entry.date || entry.timestamp || Date.now()).toLocaleString()}
                    </span>
                    <br />
                    <span>{entry.note}</span>
                  </div>
                  <Badge bg={entry.status === 'rejected' ? 'danger' : 'secondary'}>
                    {entry.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoanHistoryTable;
