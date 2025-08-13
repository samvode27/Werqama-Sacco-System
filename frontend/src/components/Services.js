// src/components/Services.js

import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaWallet, FaHandHoldingUsd } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Services.css';

function Services() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const services = [
    {
      icon: <FaWallet size={28} />,
      title: 'Savings',
      description: 'Flexible savings plans to help you build financial stability with attractive interest rates and digital tracking.',
      link: '/savings',
    },
    {
      icon: <FaHandHoldingUsd size={28} />,
      title: 'Loans',
      description: 'Accessible, low-interest loans to support your business, education, and personal goals with flexible repayment.',
      link: '/loans',
    },
  ];

  return (
    <section className="services-section py-4 position-relative overflow-hidden" id="services">
      <Container>
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="section-title gradient-text fw-bold">Our Services</h2>
          <p className="section-subtitle">Empowering your financial growth through tailored savings and loan services.</p>
        </div>
        <Row className="justify-content-center">
          {services.map((service, idx) => (
            <Col key={idx} md={6} lg={5} data-aos="fade-up" data-aos-delay={idx * 150}>
              <Card className="service-card h-100 text-center p-4 shadow-md">
                <div className="service-icon mb-3">{service.icon}</div>
                <h5 className="fw-bold mb-2">{service.title}</h5>
                <p className="small">{service.description}</p>
                <Button href={service.link} size="sm" className="gradient-button mt-3">
                  Learn More
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default Services;
