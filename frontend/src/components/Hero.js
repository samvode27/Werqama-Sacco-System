// src/components/Hero.js
import React, { useEffect, useContext } from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import "../styles/Hero.css";
import { LanguageContext } from "../contexts/LanguageContext";
import translations from "../translations";

function Hero() {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section className="hero">
      <Container className="text-center text-white position-relative pb-5">
        <Row className="align-items-center">
          <Col md={6} className="mb-4 mb-md-0" data-aos="fade-right">
            <h1 className="display-4 fw-bold heroTitle text-start">
              {t.heroTitle}
            </h1>
            <p className="lead mt-3 text-start">{t.heroSubtitle}</p>

            <div className="mt-4 text-start">
              <Link to="/register" className="cta-btn">
                {t.heroCTA}
              </Link>
            </div>
          </Col>

          <Col md={6} data-aos="fade-left">
            <div className="p-0 rounded-4">
              <Carousel fade controls={false} indicators={false} interval={3500}>
                <Carousel.Item>
                  <img
                    src={require("../assets/news1.jpg")}
                    alt="Saving"
                    style={{ height: "100%", width: "400px" }}
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    src={require("../assets/finance.webp")}
                    alt="Finance"
                    style={{ height: "500px", width: "400px" }}
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    src={require("../assets/teamworking.jpeg")}
                    alt="Teamwork"
                    style={{ height: "500px", width: "400px" }}
                  />
                </Carousel.Item>
              </Carousel>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Blob Divider */}
      <div
        className="blob-divider position-absolute w-100"
        style={{ bottom: -75, zIndex: 1 }}
      >
        <svg
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
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
