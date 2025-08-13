// src/components/AboutUs.js

import React from 'react';
import { FaEye, FaBullseye, FaHandshake } from 'react-icons/fa';
import '../styles/Landing.css';

function AboutUs() {
  return (
    <section className="section" id="about" style={{marginTop: '-50px', marginBottom: '-100px'}}>
      <h2 className="section-title">About Us</h2>
      <div className="container p-5">
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card p-4 card-hover h-100">
              <FaEye size={40} className="text-primary mb-3" />
              <h5>Our Vision</h5>
              <p>To be the leading SACCO that empowers our community's financial stability and growth through innovative financial solutions and technology integration.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card p-4 card-hover h-100">
              <FaBullseye size={40} className="text-primary mb-3" />
              <h5>Our Mission</h5>
              <p>To provide accessible, sustainable, and inclusive financial services that uplift our members' economic status, supporting entrepreneurship and community initiatives.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card p-4 card-hover h-100">
              <FaHandshake size={40} className="text-primary mb-3" />
              <h5>Our Values</h5>
              <p>We value transparency, accountability, and community empowerment, ensuring financial literacy, ethical practices, and excellent member service.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;