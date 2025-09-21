import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Table, Spinner, Alert, Button, Modal, Badge } from 'react-bootstrap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/LoanHistoryTable.css';
import { useSelector } from 'react-redux';

const LoanHistoryTable = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTimeline, setSelectedTimeline] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800 });

    const fetchLoans = async () => {
      if (!currentUser) return;

      try {
        const { data } = await api.get('/loans/my-loans', {
          headers: { Authorization: `Bearer ${currentUser}` }
        });
        setLoans(data);
      } catch (err) {
        setError('Failed to load your loan history.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchStatus = async () => {
      try {
        const res = await api.get('/memberships/check');
        setMembershipStatus(res.data.status);
      } catch (err) {
        setError('Could not fetch membership status.');
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchStatus();
  }, [currentUser]);

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
                    <span
                      onClick={() => openTimelineModal(loan.statusTimeline)}
                      style={{
                        color: "goldenrod",
                        fontWeight: "600",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      View Notes
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal for all notes */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "goldenrod", color: "white" }}
        >
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
                  className={`list-group-item d-flex justify-content-between align-items-center ${entry.status === "rejected" ? "list-group-item-danger" : ""
                    }`}
                >
                  <div>
                    <strong>{entry.status.toUpperCase()}</strong>
                    <br />
                    <span className="text-muted small">
                      {new Date(
                        entry.date || entry.timestamp || Date.now()
                      ).toLocaleString()}
                    </span>
                    <br />
                    <span>{entry.note}</span>
                  </div>
                  <span
                    style={{
                      backgroundColor: "goldenrod",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                    }}
                  >
                    {entry.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            onClick={closeModal}
            style={{
              backgroundColor: "goldenrod",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "6px 12px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoanHistoryTable;
