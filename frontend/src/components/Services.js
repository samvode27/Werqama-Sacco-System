// src/components/Services.js
import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaPiggyBank, FaHandHoldingUsd } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Services.css';

function Services() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  const services = [
    {
      icon: <FaPiggyBank />,
      title: 'Savings',
      description:
        'Flexible savings plans that secure your future with competitive interest rates, transparency, and easy access through digital banking.',
    },
    {
      icon: <FaHandHoldingUsd />,
      title: 'Loans',
      description:
        'Affordable and accessible loans designed to support your business, education, and personal growth with fair repayment terms.',
    },
  ];

  return (
    <section className="sacco-services" id="services">
      <Container>
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="services-title">Our Services</h2>
          <div className="services-line mx-auto"></div>
          <p className="services-subtitle">
            Empowering our members with savings and loan services tailored to your needs.
          </p>
        </div>
        <Row className="justify-content-center">
          {services.map((service, idx) => (
            <Col
              key={idx}
              md={6}
              lg={4}  // ✅ narrower card
              className="mb-4 d-flex align-items-stretch"
              data-aos="zoom-in"
              data-aos-delay={idx * 200}
            >
              <div className="service-box w-100 text-center p-4">
                <div className="service-icon">{service.icon}</div>
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
