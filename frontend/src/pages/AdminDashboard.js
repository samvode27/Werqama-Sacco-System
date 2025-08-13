import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AdminDashboard.css';
import { FaUserCog, FaChartBar, FaUsers, FaPiggyBank, FaBullhorn, FaUserShield, FaUserPlus } from 'react-icons/fa';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({ duration: 800 });
    }, []);

    const dashboardFeatures = [
        {
            title: 'Manage Loans',
            subtitle: 'Approve / Reject',
            icon: <FaUserShield />,
            action: () => navigate('/admin-loans'),
        },
        {
            title: 'View Savings',
            subtitle: 'Track Member Payments',
            icon: <FaPiggyBank />,
            action: () => navigate('/admin-savings'),
        },
        {
            title: 'Post News',
            subtitle: 'Inform All Members',
            icon: <FaBullhorn />,
            action: () => navigate('/create-news'),
        },
        {
            title: 'Manage Members',
            subtitle: 'View / Update / Remove',
            icon: <FaUsers />,
            action: () => navigate('/admin-members'),
        },
        {
            title: 'Analytics',
            subtitle: 'Loans & Savings Trends',
            icon: <FaChartBar />,
            action: () => navigate('/admin-analytics'),
        },
        {
            title: 'My Profile',
            subtitle: 'Update Admin Info',
            icon: <FaUserCog />,
            action: () => navigate('/profile'),
        },
        {
            title: 'Membership Applications',
            subtitle: 'Approve / Reject New Members',
            icon: <FaUserPlus />,
            action: () => navigate('/admin-membership-approvals'),
        },
    ];

    return (
        <>
            <Container fluid className="admin-dashboard">
                <section className="hero-section" data-aos="fade-down">
                    <h1>👋 Hello, {user?.name}</h1>
                    <p>Efficiently manage your SACCO operations with real-time tools and insights.</p>
                </section>

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
        </>
    );
};

export default AdminDashboard;
