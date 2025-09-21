import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import "../styles/Navbar.css";
import Logo from "../assets/logo.jpg";
import { LanguageContext } from "../contexts/LanguageContext";
import translations from "../translations";

function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const currentUser = useSelector((state) => state.user?.currentUser);
  const { language, setLanguage } = useContext(LanguageContext);

  const t = translations[language];

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

  const toggleLangDropdown = () => setLangOpen(!langOpen);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo + Brand */}
        <Link className="nav-brand" to="/">
          <div className="logo-wrapper">
            <img src={Logo} alt="Logo" className="nav-logo" />
            <span className="logo-ring"></span>
          </div>
          <span className="brandd-text">{t.brand}</span>
        </Link>

        {/* Hamburger */}
        <div className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        {/* Nav Links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          {[
            { name: t.home, href: "#hero", id: "hero" },
            { name: t.about, href: "#about", id: "about" },
            { name: t.whyus, href: "#whyus", id: "whyus" },
            { name: t.servicesTitle, href: "#services", id: "services" },
            { name: t.membership, href: "#membership", id: "membership" },
            { name: t.news, href: "#news", id: "news" },
            { name: t.contact, href: "#contact", id: "contact" },
          ].map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                className={activeSection === link.id ? "active" : ""}
                onClick={closeMenu}
              >
                {link.name}
              </a>
            </li>
          ))}

          <li>
            <Link to="/login" className="login-btn">
              {t.login}
            </Link>
          </li>

          <li>
            {/* Language Dropdown */}
            <div className="lang-switcher">
              <button onClick={toggleLangDropdown} className="lang-btn">
                {language === "en" ? "EN" : "AM"} <FaChevronDown className="chevron" />
              </button>
              {langOpen && (
                <ul className="lang-menu">
                  <li
                    className={language === "en" ? "active" : ""}
                    onClick={() => {
                      setLanguage("en");
                      setLangOpen(false);
                    }}
                  >
                    English
                  </li>
                  <li
                    className={language === "am" ? "active" : ""}
                    onClick={() => {
                      setLanguage("am");
                      setLangOpen(false);
                    }}
                  >
                    Amharic
                  </li>
                </ul>
              )}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
