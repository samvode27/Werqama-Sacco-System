import React, { useState } from "react";
import api from "../api/axios";
import "../styles/ContactUs.css";

function ContactUs() {
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
      setSuccess(data.message);
      setFormData({ name: "", email: "", reason: "", message: "" });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <section className="contact-section">
      {/* Background SVG Waves */}
      <div className="wave-bg">
        <svg viewBox="0 0 1440 320">
          <path
            fill="#1a1a2e"
            fillOpacity="1"
            d="M0,128L48,160C96,192,192,256,288,256C384,256,480,192,576,165.3C672,139,768,149,864,165.3C960,181,1056,203,1152,213.3C1248,224,1344,224,1392,224L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div className="contact-container">
        {/* Left Section */}
        <div className="contact-left">
          <iframe
            title="Sacco Location"
            src="https://maps.google.com/maps?q=Addis%20Ababa&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="520"
            style={{ border: 0, borderRadius: "20px", marginTop: '20px', filter: "drop-shadow(0 5px 15px rgba(0,0,0,0.3))" }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        {/* Right Section */}
        <div className="contact-right">
          <h2>Contact Us</h2>
          {success && <p className="success-msg">{success}</p>}
          {error && <p className="error-msg">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
            >
              <option value="">Select Reason</option>
              <option value="Support">Support</option>
              <option value="Inquiry">Inquiry</option>
              <option value="Feedback">Feedback</option>
              <option value="Others">Others</option>
            </select>
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      {/* Floating circles for design */}
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>
    </section>
  );
}

export default ContactUs;
