import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LanguageContext } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const NavigationBar = () => {
    const { user, setUser, setToken } = useAuth();
    const { toggleLanguage, language } = useContext(LanguageContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        setToken('');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">WERQAMA SACCO</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/news">News</Nav.Link>
                        <Nav.Link as={Link} to="/services">Services</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                        <Nav.Link as={Link} to="/profile">Profile</Nav.Link>

                        {user?.role === 'admin' && (
                            <>
                                <Nav.Link as={Link} to="/create-news">Create News</Nav.Link>
                                <Nav.Link as={Link} to="/admin-dashboard">Admin Dashboard</Nav.Link>
                            </>
                        )}
                        {user?.role === 'member' && (
                            <Nav.Link as={Link} to="/member-dashboard">Member Dashboard</Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        {user ? (
                            <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
                        ) : (
                            <>
                                <Button variant="outline-primary" as={Link} to="/login" className="me-2">Login</Button>
                                <Button variant="primary" as={Link} to="/register">Register</Button>
                            </>
                        )}
                    </Nav>
                    <Button
                      variant="outline-secondary"
                      className="ms-2"
                      onClick={toggleLanguage}
                    >
                        {language === 'en' ? 'አማ' : 'EN'}
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
