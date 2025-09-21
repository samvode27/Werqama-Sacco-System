// src/pages/AdminDashboard.js
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/adminRedux';
import {
  FaUserCog, FaChartBar, FaUsers, FaPiggyBank,
  FaBullhorn, FaUserShield, FaUserPlus, FaSignOutAlt
} from 'react-icons/fa';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { currentUser } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const dashboardFeatures = [
    { title: 'Manage Loans', subtitle: 'Approve / Reject', icon: <FaUserShield />, action: () => navigate('/admin-loans') },
    { title: 'View Savings', subtitle: 'Track Member Payments', icon: <FaPiggyBank />, action: () => navigate('/admin-savings') },
    { title: 'Post News', subtitle: 'Inform All Members', icon: <FaBullhorn />, action: () => navigate('/create-news') },
    { title: 'Manage Members', subtitle: 'View / Update / Remove', icon: <FaUsers />, action: () => navigate('/admin/manage-members') },
    { title: 'My Profile', subtitle: 'Update Admin Info', icon: <FaUserCog />, action: () => navigate('/profile') },
    { title: 'Membership Applications', subtitle: 'Approve/Reject', icon: <FaUserPlus />, action: () => navigate('/admin-membership-approvals') },
  ];

  return (
    <Container fluid className="admin-dashboard">
      <Navbar expand="lg" className="glass-navbar px-3 py-3 mb-4">
        <Navbar.Brand className="brand-text">
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

      <div className="dashboard-grid">
        {dashboardFeatures.map((feature, index) => (
          <div
            key={index}
            className="dashboard-card"
            onClick={feature.action}
            data-aos="zoom-in"
            style={{ cursor: 'pointer' }}
          >
            <div className="icon-box">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.subtitle}</p>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default AdminDashboard;
