// src/components/AboutUs.js
import React, { useEffect, useContext } from "react";
import { FaEye, FaBullseye, FaHandshake } from "react-icons/fa";
import "../styles/AboutUs.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { LanguageContext } from "../contexts/LanguageContext";
import translations from "../translations";

function AboutUs() {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="about-section" id="about">
      <div className="container text-center">
        <h2
          className="mb-2 title"
          style={{ color: "#cace0aff", fontSize: "2.5rem" }}
          data-aos="fade-up"
        >
          {t.aboutTitle}
        </h2>
        <div className="about-line mx-auto mb-5"></div>

        <div className="row g-4 mt-3 mb-5">
          <div
            className="col-lg-4 col-md-6"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="about-card h-100">
              <FaEye size={50} className="about-icon" />
              <h5 className="about-title">{t.visionTitle}</h5>
              <p className="about-text">{t.visionText}</p>
            </div>
          </div>

          <div
            className="col-lg-4 col-md-6"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="about-card h-100">
              <FaBullseye size={50} className="about-icon" />
              <h5 className="about-title">{t.missionTitle}</h5>
              <p className="about-text">{t.missionText}</p>
            </div>
          </div>

          <div
            className="col-lg-4 col-md-6 mx-auto"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="about-card h-100">
              <FaHandshake size={50} className="about-icon" />
              <h5 className="about-title">{t.valuesTitle}</h5>
              <p className="about-text">{t.valuesText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
