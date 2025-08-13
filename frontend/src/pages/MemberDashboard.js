import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Container, Row, Col, Card, Navbar, Nav, Alert, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPiggyBank, FaMoneyCheck, FaNewspaper, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/MemberDashboard.css';
import api from '../api/axios';

const MemberDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [membershipStatus, setMembershipStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  useEffect(() => {
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
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRestrictedClick = () => {
    alert('Access restricted. Your membership is not approved yet.');
  };

  const handleGoToMembershipForm = () => {
    navigate('/membership-form');
  };

  const dashboardItems = [
    {
      title: 'Manage Savings',
      subtitle: 'View & Add',
      icon: <FaPiggyBank size={36} />,
      route: '/savings',
      restricted: true,
    },
    {
      title: 'Manage Loans',
      subtitle: 'View & Apply',
      icon: <FaMoneyCheck size={36} />,
      route: '/loans',
      restricted: true,
    },
    {
      title: 'View News',
      subtitle: 'Stay Updated',
      icon: <FaNewspaper size={36} />,
      route: '/news',
      restricted: false,
    },
    {
      title: 'My Profile',
      subtitle: 'View & Edit',
      icon: <FaUserCircle size={36} />,
      route: '/profile',
      restricted: false,
    },
  ];

  return (
    <>
      <Navbar expand="lg" className="glass-navbar px-3 py-2">
        <Navbar.Brand onClick={() => navigate('/')} className="brand-text">
          WERQAMA SACCO
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link onClick={handleLogout}>
              <FaSignOutAlt size={20} />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="member-dashboard-wrapper py-5">
        <Container>
          <div className="text-center mb-4" data-aos="fade-up">
            <h1 className="dashboard-title gradient-text">Welcome, {user?.name}</h1>
            <p className="dashboard-subtitle">
              Track your savings, manage your loans, and stay updated with WERQAMA SACCO.
            </p>
          </div>

          {/* Membership Status Info */}
          {loadingStatus ? (
            <div className="text-center mb-4">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              <Alert
                variant={
                  membershipStatus === 'approved'
                    ? 'success'
                    : membershipStatus === 'pending'
                      ? 'warning'
                      : 'danger'
                }
                className="text-center"
                data-aos="fade-up"
              >
                <strong>Membership Status:</strong>{' '}
                <span className="text-capitalize fw-bold">
                  {membershipStatus || 'Not Submitted'}
                </span>
              </Alert>

              {membershipStatus !== 'approved' && (
                <div className="text-center mb-4" data-aos="fade-up">
                  <Alert variant="warning">
                    ⚠️ You must become a verified member to access savings and loans.<br />
                    <Button variant="primary" className="mt-2" onClick={handleGoToMembershipForm}>
                      {membershipStatus ? 'View/Resubmit Membership Form' : 'Apply for Membership'}
                    </Button>
                  </Alert>
                </div>
              )}
            </>
          )}

          {/* Feature Cards */}
          <Row className="g-4 justify-content-center mt-3">
            {dashboardItems.map((item, idx) => {
              const isRestricted = item.restricted && membershipStatus !== 'approved';
              return (
                <Col
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={idx}
                  data-aos="fade-up"
                  data-aos-delay={idx * 150}
                >
                  <Card
                    className={`dashboard-card h-100 text-center p-4 shadow-sm ${isRestricted ? 'disabled-card' : ''
                      }`}
                    onClick={() =>
                      isRestricted ? handleRestrictedClick() : navigate(item.route)
                    }
                    style={{ cursor: isRestricted ? 'not-allowed' : 'pointer' }}
                  >
                    <div className="dashboard-icon mb-3">{item.icon}</div>
                    <h5 className="fw-bold">{item.title}</h5>
                    <p className="text-muted small">{item.subtitle}</p>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default MemberDashboard;