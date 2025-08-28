// src/components/AboutUs.js
import React, { useEffect } from 'react';
import { FaEye, FaBullseye, FaHandshake } from 'react-icons/fa';
import '../styles/AboutUs.css';
import AOS from "aos";
import "aos/dist/aos.css";

function AboutUs() {

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="about-section" id="about">
      <div className="container text-center">
        <h2 className="mb-2 title" style={{color: '#353be5', fontSize: '2.5rem'}} data-aos="fade-up">About Us</h2>
        <div className="about-line mx-auto mb-5"></div>
        <div className="row g-4 mt-3 mb-5">
          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div className="about-card h-100">
              <FaEye size={50} className="about-icon" />
              <h5 className="about-title">Our Vision</h5>
              <p className="about-text">
                To be the leading SACCO that empowers our community's financial
                stability and growth through innovative financial solutions and
                technology integration.
              </p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
            <div className="about-card h-100">
              <FaBullseye size={50} className="about-icon" />
              <h5 className="about-title">Our Mission</h5>
              <p className="about-text">
                To provide accessible, sustainable, and inclusive financial
                services that uplift our members' economic status, supporting
                entrepreneurship and community initiatives.
              </p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mx-auto" data-aos="fade-up" data-aos-delay="300">
            <div className="about-card h-100">
              <FaHandshake size={50} className="about-icon" />
              <h5 className="about-title">Our Values</h5>
              <p className="about-text">
                We value transparency, accountability, and community empowerment,
                ensuring financial literacy, ethical practices, and excellent
                member service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
