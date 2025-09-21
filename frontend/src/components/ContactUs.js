import React, { useState, useContext } from "react";
import api from "../api/axios";
import "../styles/ContactUs.css";
import { LanguageContext } from "../contexts/LanguageContext";
import translations from "../translations";

function ContactUs() {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const { data } = await api.post("/contacts", formData);
      setSuccess(t.contactSuccess);
      setFormData({ name: "", email: "", reason: "", message: "" });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || t.contactError);
    }
    setLoading(false);
  };

  return (
    <section className="contact-section">
      <div className="wave-bg">
        <svg viewBox="0 0 1440 320">
          <path
            fill="#985b05"
            fillOpacity="1"
            d="M0,128L48,160C96,192,192,256,288,256C384,256,480,192,576,165.3C672,139,768,149,864,165.3C960,181,1056,203,1152,213.3C1248,224,1344,224,1392,224L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div className="contact-container">
        <div className="contact-left">
          <iframe
            title="Sacco Location"
            src="https://maps.google.com/maps?q=Addis%20Ababa&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="520"
            style={{ border: 0, borderRadius: "20px", marginTop: "20px", filter: "drop-shadow(0 5px 15px rgba(241, 132, 8, 0.3))" }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        <div className="contact-right">
          <h2>{t.contactTitle}</h2>
          {success && <p className="success-msg">{success}</p>}
          {error && <p className="error-msg">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder={t.contactName}
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder={t.contactEmail}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <select style={{backgroundColor: "#bf893eff"}}
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
            >
              <option value="">{t.contactReason}</option>
              {t.contactReasonOptions.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
            <textarea
              name="message"
              placeholder={t.contactMessage}
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? t.contactSending : t.contactSubmit}
            </button>
          </form>
        </div>
      </div>

      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>
    </section>
  );
}

export default ContactUs;
