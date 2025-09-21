import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import api from '../api/axios';
import Logo from '../assets/logo.jpg';
import '../styles/Footer.css';
import { LanguageContext } from '../contexts/LanguageContext';
import translations from '../translations';

function Footer() {
  const { language } = useContext(LanguageContext);
  const t = translations[language].footer;

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
      fetchCount();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <footer className="footer-section">
      <div
        className="wave-divider wave-divider-top position-absolute w-100"
        style={{ top: 0, zIndex: 0 }}
      >
        <svg
          viewBox="0 0 1440 150"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: "auto", marginTop: "-40px" }}
        >
          <path
            d="M0,32L48,48C96,64,192,96,288,112C384,128,480,128,576,112C672,96,768,64,864,48C960,32,1056,32,1152,48C1248,64,1344,96,1392,112L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            fill="url(#gradientTop)"
          />
          <defs>
            <linearGradient id="gradientTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#795d02ff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#795d02ff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <Container>
        <Row className="g-4">
          <Col md={3} sm={6}>
            <div className="footer-logo d-flex align-items-center mb-2">
              <img src={Logo} alt="Werqama Sacco" className="logo-img me-2" />
              <h5 className="fw-bold gradientt-text mb-0">{t.sacco}</h5>
            </div>
            <p className="small">{t.subtitle}</p>
            <p className="small">
              <strong className='text'>{t.subscribers}:</strong> <span className="subscriber-count">{count}</span>
            </p>
          </Col>

          <Col md={3} sm={6}>
            <h6 style={{ color: '#d19b11ff' }} className="fw-bold mb-3">{t.quickLinks}</h6>
            <ul className="footer-links">
              <li><a href="/">{t.links.home}</a></li>
              <li><a href="/services">{t.links.services}</a></li>
              <li><a href="/news">{t.links.news}</a></li>
              <li><a href="/contact">{t.links.contact}</a></li>
              <li><a href="/register">{t.links.join}</a></li>
            </ul>
          </Col>

          <Col md={3} sm={6}>
            <h6 style={{ marginTop: '50px', color: '#d19b11ff' }} className="fw-bold mb-3">{t.contactUs}</h6>
            <p className="small mb-1"><FaPhoneAlt className="me-2 text" /> {t.phone}</p>
            <p className="small mb-3"><FaEnvelope className="me-2 text" /> {t.email}</p>
            <div className="footer-socials">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaLinkedin /></a>
            </div>
          </Col>

          <Col md={3} sm={6}>
            <h6 style={{ marginTop: '50px', color: '#d19b11ff' }} className="fw-bold gradientt-text">{t.newsletter}</h6>
            <p className="small">{t.newsletterDesc}</p>
            {success && <p className="success-msg">{success}</p>}
            {error && <p className="error-msg">{error}</p>}
            <Form onSubmit={handleSubscribe} className="d-flex flex-column">
              <Form.Control
                type="email"
                placeholder={t.subscribe}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-input"
              />
              <button type="submit" className="gradient-buttoon w-100" disabled={loading}>
                {loading ? t.subscribing : t.subscribe}
              </button>
            </Form>
          </Col>
        </Row>

        <hr className="footer-divider" />
        <div className="text-center text small">
          {t.copyright}
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
