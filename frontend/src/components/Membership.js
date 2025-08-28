// src/components/Membership.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUserPlus, FaMoneyCheckAlt, FaUniversity, FaHandHoldingUsd, FaWallet, } from 'react-icons/fa';
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
      icon: <FaUserPlus />,
      title: `${members}+ Active Members`,
      description: 'Be part of a growing family securing financial freedom.',
    },
    {
      icon: <FaMoneyCheckAlt />,
      title: `${loans}+ Loans Disbursed`,
      description: 'Supporting businesses & personal goals affordably.',
    },
    {
      icon: <FaUniversity />,
      title: 'Bank Details',
      description: (
        <>
          <strong>WERQAMA SACCO</strong>
          <br /> CBE: 1000123456789
          <br /> Awash: 0101010101
        </>
      ),
    },
  ];

  const steps = [
    { num: 1, text: 'Register Online or at Branch' },
    { num: 2, text: 'Deposit via Bank or Chapa' },
    { num: 3, text: 'Activate Your Membership' },
    { num: 4, text: 'Enjoy Loans & Benefits' },
  ];

  return (
    <section className="membership-section position-relative" id="membership">
      {/* Top Wave */}
      <div className="top-wave">
        <svg viewBox="0 0 1240 210">
          <path
            fill="#0d6efd"
            fillOpacity="1"
            d="M0,128L48,117.3C96,107,192,85,288,74.7C384,64,480,64,576,80C672,96,768,128,864,138.7C960,149,1056,139,1152,144C1248,149,1344,171,1392,181.3L1440,192L1440,0L0,0Z"
          ></path>
        </svg>
      </div>

      <Container className="py-5">
        {/* Heading */}
        <div className="text-center mb-5" data-aos="fade-down">
          <h2 className="section-title fw-bold text-white">
            Join WERQAMA SACCO Today
          </h2>
          <p className="section-subtitle text-light">
            Unlock access to loans, savings, and a supportive community.
          </p>
        </div>

        {/* Stats Cards */}
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

        {/* Steps Timeline */}
        <div className="timeline mb-5" data-aos="fade-up">
          {[
            { icon: <FaUserPlus />, title: "Register", text: "Sign up easily to become a SACCO member." },
            { icon: <FaWallet />, title: "Deposit", text: "Start saving with flexible contributions." },
            { icon: <FaHandHoldingUsd />, title: "Apply Loan", text: "Request affordable loans for growth." },
            { icon: <FaUniversity />, title: "Grow Together", text: "Enjoy financial support and benefits." },
          ].map((step, idx) => (
            <div className="timeline-step" key={idx} data-aos="zoom-in" data-aos-delay={idx * 200}>
              <div className="circle">{step.icon}</div>
              <div className="step-content">
                <h6 className="step-title">{step.title}</h6>
                <p className="step-text">{step.text}</p>
              </div>
            </div>
          ))}
        </div>


        {/* CTA */}
        <div className="d-flex justify-content-center mt-1" data-aos="fade-up">
          <Link to="/login" className="btn px-3 py-2">
            Apply for Membership
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default Membership;
