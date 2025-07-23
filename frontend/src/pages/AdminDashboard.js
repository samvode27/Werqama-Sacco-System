import React from 'react';
import NavigationBar from '../components/Navbar';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import { useAuth } from '../contexts/AuthContext';


const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <NavigationBar />
            <Container className="dashboard-container">
                <div className="hero">
                    <h1>Welcome, {user?.name}</h1>
                    <p>Manage members, loans, and savings efficiently for WERQAMA SACCO operations.</p>
                </div>
                <div className="stats-grid">
                    <div className="stat-card" onClick={() => navigate('/admin-loans')} style={{ cursor: 'pointer' }}>
                        <div className="stat-title">Manage Loans</div>
                        <div className="stat-value">Approve / Reject</div>
                    </div>
                    <div className="stat-card" onClick={() => navigate('/admin-savings')} style={{ cursor: 'pointer' }}>
                        <div className="stat-title">View All Savings</div>
                        <div className="stat-value">Track Payments</div>
                    </div>
                    <div className="stat-card" onClick={() => navigate('/create-news')} style={{ cursor: 'pointer' }}>
                        <div className="stat-title">Create News</div>
                        <div className="stat-value">Inform Members</div>
                    </div>
                    <div className="stat-card" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
    <div className="stat-title">My Profile</div>
    <div className="stat-value">Manage</div>
</div>

                </div>
            </Container>
        </>
    );
};

export default AdminDashboard;
