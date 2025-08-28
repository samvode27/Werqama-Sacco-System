import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBars, FaTimes } from "react-icons/fa";
import "../styles/Navbar.css";
import Logo from "../assets/logo.jpg"; // your logo

function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const currentUser = useSelector((state) => state.user?.currentUser);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      let current = "hero";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute("id");
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo + Brand */}
        <Link className="nav-brand" to="/">
          <div className="logo-wrapper">
            <img src={Logo} alt="Logo" className="nav-logo" />
            <span className="logo-ring"></span>
          </div>
          <span className="brand-text">
            WERQAMA <span>SACCO</span>
          </span>
        </Link>

        {/* Hamburger */}
        <div className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        {/* Nav Links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          {[
            { name: "Home", href: "#hero" },
            { name: "About", href: "#about" },
            { name: "Why Us", href: "#whyus" },
            { name: "Services", href: "#services" },
            { name: "Membership", href: "#membership" },
            { name: "News", href: "#news" },
            { name: "Contact", href: "#contact" },
          ].map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className={
                  activeSection === link.href.substring(1) ? "active" : ""
                }
                onClick={closeMenu}
              >
                {link.name}
              </a>
            </li>
          ))}

          <li>
            <Link to="/login" className="login-btn">
              login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
