// src/components/Navbar.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = document.querySelectorAll('section');
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top ${
        scrolled ? 'navbar-scrolled' : 'navbar-transparent'
      } shadow-sm rounded-bottom`}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          WERQAMA SACCO
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            {[
              { name: 'Home', href: '/' },
              { name: 'About', href: '#about' },
              { name: 'Why Us', href: '#why-us' },
              { name: 'Services', href: '#services' },
              { name: 'Membership', href: '#membership' },
              { name: 'News', href: '#news' },
              { name: 'Contact', href: '#contact' },
            ].map(link => (
              <li className="nav-item mx-2" key={link.name}>
                <a
                  href={link.href}
                  className={`nav-link position-relative ${
                    activeSection === link.href.substring(1) ? 'active-link' : ''
                  }`}
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li className="nav-item ms-3">
              <Link className="btn btn-primary mr-2" to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
