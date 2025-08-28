import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import api from '../api/axios';
import Logo from '../assets/logo.jpg';
import '../styles/Footer.css';

function Footer() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    fetchCount();
  }, []);

  const fetchCount = async () => {
    try {
      const { data } = await api.get('/newsletter/count');
      setCount(data.count);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const { data } = await api.post('/newsletter', { email });
      setSuccess(data.message);
      setEmail('');
      fetchCount(); // update subscriber count
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <footer className="footer-section">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="url(#footerGradient)"
            d="M0,64L48,58.7C96,53,192,43,288,42.7C384,43,480,53,576,80C672,107,768,149,864,160C960,171,1056,149,1152,133.3C1248,117,1344,107,1392,101.3L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
          <defs>
            <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d6efd" />
              <stop offset="100%" stopColor="#6610f2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <Container>
        <Row className="g-4">
          <Col md={3} sm={6}>
            <div className="footer-logo d-flex align-items-center mb-2">
              <img src={Logo} alt="Werqama Sacco" className="logo-img me-2" />
              <h5 className="fw-bold gradient-text mb-0">WERQAMA SACCO</h5>
            </div>
            <p className="small">
              Empowering your financial future with secure savings, affordable loans, and community-focused services across Ethiopia.
            </p>
            <p className="small">
              <strong>Subscribers:</strong> <span className="subscriber-count">{count}</span>
            </p>
          </Col>

          <Col md={3} sm={6}>
            <h6 style={{ color: '#0d6efd' }} className="fw-bold mb-3">Quick Links</h6>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/news">News & Events</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/register">Join Now</a></li>
            </ul>
          </Col>

          <Col md={3} sm={6}>
            <h6 style={{ marginTop: '50px', color: '#0d6efd' }} className="fw-bold mb-3">Contact Us</h6>
            <p className="small mb-1"><FaPhoneAlt className="me-2 text-primary" /> +251 912 345 678</p>
            <p className="small mb-3"><FaEnvelope className="me-2 text-primary" /> info@werqamasacco.et</p>
            <div className="footer-socials">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaLinkedin /></a>
            </div>
          </Col>

          <Col md={3} sm={6}>
            <h6 style={{ marginTop: '50px', color: '#0d6efd' }} className="fw-bold gradient-text">Newsletter</h6>
            <p className="small">Subscribe for the latest updates and financial tips.</p>
            {success && <p className="success-msg">{success}</p>}
            {error && <p className="error-msg">{error}</p>}
            <Form onSubmit={handleSubscribe} className="d-flex flex-column">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-input"
              />
              <Button type="submit" className="newsletter-button gradient-button w-100" disabled={loading}>
                {loading ? "Subscribing..." : "Subscribe"}
              </Button>
            </Form>
          </Col>
        </Row>

        <hr className="footer-divider" />
        <div className="text-center small">
          © {new Date().getFullYear()} WERQAMA SACCO. All rights reserved. | Developed by YourTeam
        </div>
      </Container>
    </footer>

  );
}

export default Footer;
