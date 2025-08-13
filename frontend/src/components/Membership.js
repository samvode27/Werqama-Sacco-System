// src/components/Membership.js

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaUserPlus, FaMoneyCheckAlt, FaUniversity } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Membership.css';
import { Link } from 'react-router-dom';

function Membership() {
  const [members, setMembers] = useState(0);
  const [loans, setLoans] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    let memberCount = 0;
    let loanCount = 0;
    const interval = setInterval(() => {
      if (memberCount < 1250) {
        memberCount += 25;
        setMembers(memberCount);
      }
      if (loanCount < 350) {
        loanCount += 10;
        setLoans(loanCount);
      }
      if (memberCount >= 1250 && loanCount >= 350) {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const items = [
    {
      icon: <FaUserPlus size={48} />,
      title: `${members}+ Members`,
      description: "Join our growing community and secure your financial future together.",
    },
    {
      icon: <FaMoneyCheckAlt size={48} />,
      title: `${loans}+ Loans`,
      description: "Access affordable loans to grow your business or personal goals.",
    },
    {
      icon: <FaUniversity size={48} />,
      title: "Bank Details",
      description: (
        <>
          <strong>WERQAMA SACCO</strong><br />
          CBE: 1000123456789<br />
          Awash: 0101010101
        </>
      ),
    },
  ];

  return (
    <section className="membership-section py-5 position-relative overflow-hidden" id="membership">
      {/* Wave Background SVG */}
      <div className="wave-background">
        <svg viewBox="0 0 1440 320">
          <path
            fill="#ffffff"
            fillOpacity="0.1"
            d="M0,64L48,69.3C96,75,192,85,288,117.3C384,149,480,203,576,208C672,213,768,171,864,160C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <Container>
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="section-title gradient-text fw-bold">Become a Member of WERQAMA SACCO</h2>
          <p className="section-subtitle">
            Join by depositing via Chapa or our partner banks and start your financial growth journey.
          </p>
        </div>
        <Row className="g-4 justify-content-center mb-5">
          {items.map((item, idx) => (
            <Col key={idx} md={6} lg={4} data-aos="fade-up" data-aos-delay={idx * 150}>
              <Card className="membership-card h-100 text-center p-4 shadow-lg">
                <div className="membership-icon mb-3">{item.icon}</div>
                <h5 className="fw-bold mb-2">{item.title}</h5>
                <p className="small">{item.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
        <div
          className="d-flex justify-content-center mt-5"
          data-aos="zoom-in"
        >
          <Link
            to="/become-member"
            className="btn btn-gradient px-4 py-3 fw-semibold shadow-lg"
            style={{
              borderRadius: '50px',
              fontSize: '1rem',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(13, 110, 253, 0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Apply for Membership
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default Membership;
