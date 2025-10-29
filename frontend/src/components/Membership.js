import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUserPlus, FaMoneyCheckAlt, FaUniversity } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Membership.css';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../contexts/LanguageContext';
import translations from '../translations';

function Membership() {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const [members, setMembers] = useState(0);
  const [loans, setLoans] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const fetchStats = async () => {
      try {
        const response = await api.get('/stats'); 
        const data = response.data; 
        setMembers(data.memberCount || 0);
        setLoans(data.loanCount || 0);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const items = [
    {
      icon: <FaUserPlus />,
      title: `${members} ${t.membersActive}`,
      description: t.membersDesc,
    },
    {
      icon: <FaMoneyCheckAlt />,
      title: `${loans} ${t.loansDisbursed}`,
      description: t.loansDesc,
    },
    {
      icon: <FaUniversity />,
      title: t.bankDetailsTitle,
      description: t.bankDetails,
    },
  ];

  return (
    <section className="membership-section position-relative" id="membership">
      <div
        className="wave-divider wave-divider-top position-absolute w-100"
        style={{ top: 0, zIndex: 0 }}
      >
        <svg viewBox="0 0 1440 150" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: "auto", marginTop: "-40px" }}>
          <path
            d="M0,32L48,48C96,64,192,96,288,112C384,128,480,128,576,112C672,96,768,64,864,48C960,32,1056,32,1152,48C1248,64,1344,96,1392,112L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            fill="url(#gradientTop)"
          />
          <defs>
            <linearGradient id="gradientTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e1da0aff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#e1da0aff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <Container className="py-5">
        <div className="text-center mb-5 mt-5" data-aos="fade-down">
          <h2 className="section-title fw-bold text-white">{t.membershipTitle}</h2>
          <p className="sectionn-subtitle">{t.membershipSubtitle}</p>
        </div>

        <Row className="g-4 justify-content-center mb-5">
          {items.map((item, idx) => (
            <Col key={idx} md={6} lg={4} data-aos="zoom-in" data-aos-delay={idx * 200}>
              <div className="glass-card h-100 text-center p-4">
                <div className="glass-icon">{item.icon}</div>
                <h5 className="fw-bold mt-3">{item.title}</h5>
                <p className="small">{item.description}</p>
              </div>
            </Col>
          ))}
        </Row>

        <div className="d-flex justify-content-center mt-1" data-aos="fade-up">
          <Link to="/login" style={{ height: "60px" }} className="btnn py-3">
            {t.membershipCTA}
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default Membership;
