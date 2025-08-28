// src/pages/MemberDashboard.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Navbar,
  Nav,
  Spinner,
  Alert,
  Badge,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaPiggyBank,
  FaMoneyCheck,
  FaNewspaper,
  FaUserCircle,
  FaSignOutAlt,
  FaLock,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userRedux";
import LoadingScreen from "../components/LoadingScreen";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/MemberDashboard.css";
import api from "../api/axios";

const MemberDashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [membershipStatus, setMembershipStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const fetchStatus = async () => {
      try {
        const res = await api.get("/memberships/check");
        setMembershipStatus(res.data.status);
      } catch {
        setMembershipStatus("unknown");
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchStatus();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/savings/analytics/member");
        setAnalytics(res.data);
      } catch (err) {
        console.error("Analytics error:", err);
      }
    };
    fetchAnalytics();
  }, [currentUser]);

  if (!currentUser) {
    return <LoadingScreen />;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleRestrictedClick = () => {
    if (membershipStatus !== "approved") {
      if (
        window.confirm(
          "🚫 Only approved members can access Savings and Loans. Would you like to apply now?"
        )
      ) {
        navigate("/membership-form");
      }
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar expand="lg" className="glass-navbar px-3 py-2 fixed-top shadow-sm">
        <Navbar.Brand className="fw-bold">WERQAMA SACCO</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt size={18} /> Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Dashboard Wrapper */}
      <div className="member-dashboard-wrapper py-5 mt-5">
        <Container>
          {/* Welcome */}
          <div className="text-center mb-4" data-aos="fade-up">
            <h1 className="dashboard-title gradient-text mt-5">
              Welcome, {currentUser?.name}
            </h1>
            <p className="subtitle">Your financial hub at a glance 🚀</p>
          </div>

          {/* Membership Status */}
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
            </>
          )}

          {/* Highlights */}
          {membershipStatus === "approved" && analytics && (
            <Row className="g-4 mb-4">
              <Col md={6} sm={6}>
                <Card className="highlight-card" data-aos="fade-up">
                  <FaPiggyBank className="icon text-success" size={28} />
                  <h6>Total Savings</h6>
                  <p className="fw-bold fs-5 mb-0">
                    {analytics.savings.total.totalAmount.toLocaleString()} Birr
                  </p>
                </Card>
              </Col>
              <Col md={6} sm={6}>
                <Card className="highlight-card" data-aos="fade-up" data-aos-delay="100">
                  <FaMoneyCheck className="icon text-primary" size={28} />
                  <h6>Total Loans</h6>
                  <p className="fw-bold fs-5 mb-0">
                    {analytics.loans.totalAmount.toLocaleString()} Birr
                  </p>
                </Card>
              </Col>
            </Row>
          )}

          {/* Quick Actions */}
          <div className="quick-actions text-center mt-5" data-aos="fade-up">
            <h5 className="mb-4">Quick Actions</h5>
            <div className="container">
              <div className="row g-4 justify-content-center">
                {[
                  { title: "Savings", icon: <FaPiggyBank />, route: "/savings", restricted: true },
                  { title: "Loans", icon: <FaMoneyCheck />, route: "/loans", restricted: true },
                  { title: "News", icon: <FaNewspaper />, route: "/news" },
                  { title: "Profile", icon: <FaUserCircle />, route: "/profile" },
                ].map((item, idx) => {
                  const isRestricted = item.restricted && membershipStatus !== "approved";

                  return (
                    <div className="col-12 col-sm-6 col-md-3" key={idx}>
                      <Button
                        className={`quick-btn d-flex flex-column align-items-center justify-content-center p-4 shadow-sm ${isRestricted ? "disabled-btn" : ""
                          }`}
                        onClick={() =>
                          isRestricted ? handleRestrictedClick() : navigate(item.route)
                        }
                        style={{
                          minHeight: "180px",
                          fontSize: "1.1rem",
                          borderRadius: "15px",
                        }}
                      >
                        <div className="quick-icon mb-3" style={{ fontSize: "2.5rem" }}>
                          {item.icon}
                        </div>
                        <span className="quick-title fw-bold">{item.title}</span>
                        {isRestricted && <FaLock className="mt-2 text-muted small" />}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </Container>
      </div>
    </>
  );
};

export default MemberDashboard;
