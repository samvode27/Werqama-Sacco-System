import React from 'react';
import NavigationBar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const MemberDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <NavigationBar />
            <Container className="dashboard-container">
                <div className="hero">
                    <h1>Welcome, {user?.name}</h1>
                    <p>Track your savings, manage your loans, and stay updated with SACCO news.</p>
                </div>
                <div className="stats-grid">
                    <div className="stat-card" onClick={() => navigate('/savings')} style={{ cursor: 'pointer' }}>
                        <div className="stat-title">Manage Savings</div>
                        <div className="stat-value">View & Add</div>
                    </div>
                    <div className="stat-card" onClick={() => navigate('/loans')} style={{ cursor: 'pointer' }}>
                        <div className="stat-title">Manage Loans</div>
                        <div className="stat-value">View & Apply</div>
                    </div>
                    <div className="stat-card" onClick={() => navigate('/news')} style={{ cursor: 'pointer' }}>
                        <div className="stat-title">View News</div>
                        <div className="stat-value">Stay Updated</div>
                    </div>
                    <div className="stat-card" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
    <div className="stat-title">My Profile</div>
    <div className="stat-value">View & Edit</div>
</div>

                </div>
            </Container>
        </>
    );
};

export default MemberDashboard;
