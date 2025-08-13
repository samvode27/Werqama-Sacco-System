// src/components/Hero.js

import React, { useEffect } from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Landing.css';
import { Link } from 'react-router-dom';

function Hero() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section
      className="hero position-relative d-flex align-items-center justify-content-center"
      style={{ height: '80vh', overflow: 'visible', marginTop: '30px', backgroundColor: '#0a1a2f' }}
    >
      {/* Main Content */}
      <Container className="text-center text-white position-relative pb-5" >
        <Row className="align-items-center">
          <Col md={6} className="mb-4 mb-md-0" data-aos="fade-right">
            <h1 className="display-4 fw-bold gradient-text text-start" style={{ fontSize: '48px' }}>
              Empowering Your Financial Future
            </h1>
            <p className="lead mt-3 text-start" style={{ color: 'white', fontFamily: 'arial', fontSize: '16px' }}>
              Join WERQAMA SACCO to save, grow, and secure your financial future with trusted services, flexible loans, and community support.
            </p>
          </Col>
          <Col md={6} data-aos="fade-left">
            <div className="glass-card p-0 rounded-4 shadow-lg">
              <Carousel fade controls={false} indicators={false} interval={3500}>
                <Carousel.Item>
                  <img
                    style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                    className="d-block rounded-4"
                    src={require('../assets/saving.jpeg')}
                    alt="Saving"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    style={{ width: '100%', height: '400px', objectFit: 'cover', zIndex: -1 }}
                    className="d-block rounded-4"
                    src={require('../assets/finance.webp')}
                    alt="Finance"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    style={{ width: '100%', height: '400px', objectFit: 'cover', zIndex: -1 }}
                    className="d-block rounded-4"
                    src={require('../assets/teamworking.jpeg')}
                    alt="Teamwork"
                  />
                </Carousel.Item>
              </Carousel>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Blob Divider moved outside Container and to back */}
      <div className="blob-divider position-absolute w-100" style={{ bottom: -75, zIndex: 1 }}>
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#ffffffff"
            fillOpacity="1"
            d="M0,64L48,96C96,128,192,192,288,202.7C384,213,480,171,576,138.7C672,107,768,85,864,96C960,107,1056,149,1152,186.7C1248,224,1344,256,1392,272L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}

export default Hero;
