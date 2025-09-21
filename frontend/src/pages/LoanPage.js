// src/pages/LoanPage.js
import React, { useEffect, useState } from 'react';
import LoanApplicationForm from '../components/LoanApplicationForm';
import LoanHistoryTable from '../components/LoanHistoryTable';
import api from '../api/axios';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Spinner, Alert, Button, Collapse } from 'react-bootstrap';
import { CheckCircleFill, XCircleFill, FileEarmarkTextFill } from 'react-bootstrap-icons';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LoanPage = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [membershipStatus, setMembershipStatus] = useState(null);
  const [loanStats, setLoanStats] = useState({ total: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      try {
        const resStatus = await api.get('/memberships/check');
        setMembershipStatus(resStatus.data.status);

        const resLoans = await api.get('/loans/my-loans', {
          headers: { Authorization: `Bearer ${currentUser}` },
        });

        const loans = resLoans.data;
        setLoanStats({
          total: loans.length,
          approved: loans.filter((l) => l.status === 'approved').length,
          rejected: loans.filter((l) => l.status === 'rejected').length,
        });
      } catch (err) {
        setError('Could not load loan or membership info.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  return (
    <div className="container mt-5 loan-page">
      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : error ? (
        <Alert variant="danger" className="text-center">{error}</Alert>
      ) : (
        <>
          {/* Info Cards */}
          <Row className="mb-4" data-aos="fade-up">
            <Col md={4}>
              <Card className="shadow-sm border-0 text-center p-3">
                <FileEarmarkTextFill size={32} className="text-primary mb-2" />
                <h5>Total Applications</h5>
                <h3>{loanStats.total}</h3>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm border-0 text-center p-3">
                <CheckCircleFill size={32} className="text-success mb-2" />
                <h5>Approved Loans</h5>
                <h3>{loanStats.approved}</h3>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm border-0 text-center p-3">
                <XCircleFill size={32} className="text-danger mb-2" />
                <h5>Rejected Loans</h5>
                <h3>{loanStats.rejected}</h3>
              </Card>
            </Col>
          </Row>

          {/* Loan Form (collapsible) */}
          <div className="mb-5 text-center" data-aos="fade-up">
            <button
              type="button"
              onClick={() => setOpenForm(!openForm)}
              aria-controls="loan-form-collapse"
              aria-expanded={openForm}
              className="mb-3 mt-4"
              style={{
                backgroundColor: "goldenrod",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "10px 15px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {openForm ? "Hide Loan Application Form" : "Apply for a Loan"}
            </button>
            <Collapse in={openForm}>
              <div id="loan-form-collapse">
                <Card className="shadow-sm border-0 p-4">
                  <h4 className="mb-3 text-center" style={{color: "#eeb509ff"}}>Loan Application Form</h4>
                  <LoanApplicationForm />
                </Card>
              </div>
            </Collapse>
          </div>

          {/* Loan History Table */}
          <div data-aos="fade-up">
            <h3 className="mb-3 text-center" style={{color: "#eeb509ff"}}>Loan Status & History</h3>
            <LoanHistoryTable />
          </div>
        </>
      )}
    </div>
  );
};

export default LoanPage;
