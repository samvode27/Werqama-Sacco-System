import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Landing.css';

function ContactUs() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Normally send to backend here
    console.log(formData);
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      reason: '',
      message: '',
    });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section
      id="contact"
      className="py-5 contact-section"
      style={{ background: 'linear-gradient(135deg, #061826, #122d44)', color: '#fff', marginTop:'-80px' }}
    >
      <Container>
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="fw-bold gradient-text display-6">Get in Touch</h2>
          <p className="lead text-light">We’re here to help and answer your questions</p>
        </div>

        <Row className="g-4 align-items-center">
          {/* Map / Illustration */}
          <Col md={6} data-aos="fade-right">
            <iframe
              title="Map"
              src="https://maps.google.com/maps?q=Addis%20Ababa&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </Col>

          {/* Form */}
          <Col md={6} data-aos="fade-left">
            <Card
              className="glass-card border-0 shadow-lg p-4"
              style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}
            >
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name" className="mb-3 floating-label">
                  <Form.Control
                    type="text"
                    placeholder=" "
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                  />
                  <Form.Label>Name</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="email" className="mb-3 floating-label">
                  <Form.Control
                    type="email"
                    placeholder=" "
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Label>Email</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="phone" className="mb-3 floating-label">
                  <Form.Control
                    type="tel"
                    placeholder=" "
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    isInvalid={!!errors.phone}
                  />
                  <Form.Label>Phone</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="reason" className="mb-3">
                  <Form.Select
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                  >
                    <option value="">Reason for Contact</option>
                    <option>Loan Inquiry</option>
                    <option>Membership</option>
                    <option>Technical Support</option>
                    <option>Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="message" className="mb-3 floating-label">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder=" "
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    isInvalid={!!errors.message}
                  />
                  <Form.Label>Message</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" className="glow-button w-100 mt-2">
                  Send Message
                </Button>
                {submitted && (
                  <div className="text-success mt-2">Thank you! Your message has been sent.</div>
                )}
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default ContactUs;
