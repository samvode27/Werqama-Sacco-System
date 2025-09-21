// src/components/Services.js
import React, { useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaPiggyBank, FaHandHoldingUsd } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Services.css';
import { LanguageContext } from '../contexts/LanguageContext';
import translations from '../translations';

function Services() {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  // Map icons to match translation order
  const icons = [<FaPiggyBank />, <FaHandHoldingUsd />];

  return (
    <section className="sacco-services" id="services">
      <Container>
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="services-title">{t.servicesTitle}</h2>
          <div className="services-line mx-auto"></div>
          <p className="services-subtitle">{t.servicesSubtitle}</p>
        </div>
        <Row className="justify-content-center">
          {t.services.map((service, idx) => (
            <Col
              key={idx}
              md={6}
              lg={4} // narrower card
              className="mb-4 d-flex align-items-stretch"
              data-aos="zoom-in"
              data-aos-delay={idx * 200}
            >
              <div className="service-box w-100 text-center p-4">
                <div className="service-icon">{icons[idx]}</div>
                <h5 className="fw-bold mt-3">{service.title}</h5>
                <p className="service-desc">{service.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default Services;
