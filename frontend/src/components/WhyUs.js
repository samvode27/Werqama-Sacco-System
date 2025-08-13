import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaPiggyBank, FaHandsHelping, FaLock, FaChartBar } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/WhyUs.css';

function WhyUs() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const benefits = [
    {
      icon: <FaPiggyBank />,
      title: "Grow Your Savings",
      description: "Earn dividends while building a secure financial future.",
    },
    {
      icon: <FaHandsHelping />,
      title: "Access Affordable Loans",
      description: "Get loans at low rates to expand your business and family needs.",
    },
    {
      icon: <FaLock />,
      title: "Secure & Transparent",
      description: "Your savings and transactions are protected at every step.",
    },
    {
      icon: <FaChartBar />,
      title: "Financial Empowerment",
      description: "Gain financial education to manage your money wisely.",
    },
  ];

  return (
    <section className="why-us-section" id="why-us">
      {/* Top Gradient Wave */}
      <div
        className="wave-divider wave-divider-top position-absolute w-100"
        style={{ top: 0, zIndex: 0 }}
      >
        <svg
          viewBox="0 0 1440 150"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: 'auto' }}
        >
          <path
            d="M0,32L48,48C96,64,192,96,288,112C384,128,480,128,576,112C672,96,768,64,864,48C960,32,1056,32,1152,48C1248,64,1344,96,1392,112L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            fill="url(#gradientTop)"
          />
          <defs>
            <linearGradient id="gradientTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d6efd" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0d6efd" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <Container>
        <div className="section-header" data-aos="fade-up">
          <h2>Why Choose <span className="highlight">WERQAMA SACCO?</span></h2>
          <p>Discover the benefits of joining our trusted community-based SACCO and secure your financial future today.</p>
        </div>

        <Row className="g-4 justify-content-center">
          {benefits.map((item, index) => (
            <Col key={index} xs={12} sm={6} lg={3} data-aos="fade-up" data-aos-delay={index * 150}>
              <div className="benefit-card">
                <div className="icon">{item.icon}</div>
                <h5>{item.title}</h5>
                <p>{item.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* SVG Wave Divider */}
      <div className="wave-divider wave-divider-bottom">
        <svg
          viewBox="0 0 1440 150"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: 'auto' }}
        >
          <path
            d="M0,64L80,74.7C160,85,320,107,480,106.7C640,107,800,85,960,85.3C1120,85,1280,107,1360,117.3L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
            fill="url(#gradient)"
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d6efd" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0d6efd" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

    </section>
  );
}

export default WhyUs;
