import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/BecomeMembershipFormPage.css';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const emptyPerson = { fullName: '', subCity: '', city: '', district: '' };

const addisAbabaSubCities = [
  "Addis Ketema", "Akaki Kaliti", "Arada", "Bole",
  "Gullele", "Kirkos", "Kolfe Keranio", "Lideta",
  "Nifas Silk-Lafto", "Yeka"
];

const educationLevels = [
  "Primary", "Secondary", "Diploma", "Degree", "Masters", "PhD", "Other"
];

const BecomeMembershipFormPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    gender: '',
    maritalStatus: '',
    educationLevel: '',
    occupation: '',
    phone: '',
    address: { subCity: '', city: 'Addis Ababa', district: '' },
    sourceOfInformation: '',
    idDocument: null,
    beneficiaries: [{ ...emptyPerson }],
    witnesses: [{ ...emptyPerson }],
    agreementAccepted: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formValid, setFormValid] = useState(false);

  // Utility to check non-empty
  const notEmpty = (str) => str && str.trim() !== '';

  // ✅ Validate form
  useEffect(() => {
    const validateForm = () => {
      const {
        fullName, email, age, gender, maritalStatus, educationLevel,
        occupation, phone, address, idDocument, beneficiaries, witnesses,
        agreementAccepted
      } = formData;

      if (
        !notEmpty(fullName) ||
        !notEmpty(email) || !/\S+@\S+\.\S+/.test(email) ||
        !age || Number(age) <= 0 ||
        !notEmpty(gender) ||
        !notEmpty(maritalStatus) ||
        !notEmpty(educationLevel) ||
        !notEmpty(occupation) ||
        !notEmpty(phone) ||
        !notEmpty(address.subCity) ||
        !notEmpty(address.district) ||
        !idDocument ||
        beneficiaries.length !== 1 ||
        witnesses.length !== 3 || // Must be exactly 3
        !agreementAccepted
      ) return false;

      // Check beneficiary
      const b = beneficiaries[0];
      if (!notEmpty(b.fullName) || !notEmpty(b.subCity) || !notEmpty(b.city) || !notEmpty(b.district))
        return false;

      // Check witnesses
      for (let w of witnesses) {
        if (!notEmpty(w.fullName) || !notEmpty(w.subCity) || !notEmpty(w.city) || !notEmpty(w.district))
          return false;
      }

      return true;
    };

    setFormValid(validateForm());
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
    } else if (name.startsWith('beneficiaries') || name.startsWith('witnesses')) {
      const [group, index, field] = name.split('.');
      setFormData(prev => {
        const updated = [...prev[group]];
        updated[index][field] = value;
        return { ...prev, [group]: updated };
      });
    } else if (name === 'idDocument') {
      setFormData(prev => ({ ...prev, idDocument: files[0] }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const renderPersonFields = (group, people) =>
    people.map((person, index) => (
      <Row key={index} className="mb-2 align-items-center">
        <Col md={3} xs={12} className="mb-1">
          <Form.Control
            placeholder="Full Name"
            name={`${group}.${index}.fullName`}
            value={person.fullName}
            onChange={handleChange}
            required
          />
        </Col>
        <Col md={3} xs={12} className="mb-1">
          <Form.Control
            placeholder="Sub-City"
            name={`${group}.${index}.subCity`}
            value={person.subCity}
            onChange={handleChange}
            required
          />
        </Col>
        <Col md={3} xs={12} className="mb-1">
          <Form.Control
            placeholder="City"
            name={`${group}.${index}.city`}
            value={person.city}
            onChange={handleChange}
            required
          />
        </Col>
        <Col md={3} xs={12} className="mb-1">
          <Form.Control
            placeholder="District"
            name={`${group}.${index}.district`}
            value={person.district}
            onChange={handleChange}
            required
          />
        </Col>
      </Row>
    ));

  // Utility to check each section status for progress bar
  const getStepStatus = (step) => {
    switch (step) {
      case 1: // Personal Info
        return (
          formData.fullName.trim() &&
          formData.email.trim() &&
          /\S+@\S+\.\S+/.test(formData.email) &&
          formData.age &&
          !isNaN(formData.age) &&
          Number(formData.age) > 0 &&
          formData.gender &&
          formData.maritalStatus &&
          formData.educationLevel &&
          formData.occupation &&
          formData.phone
        );

      case 2: // Address
        return formData.address.subCity && formData.address.district;

      case 3: // Beneficiary (only 1)
        const b = formData.beneficiaries[0];
        return b.fullName && b.subCity && b.city && b.district;

      case 4: // Witnesses (must be exactly 3)
        return (
          formData.witnesses.length === 3 &&
          formData.witnesses.every(
            (w) => w.fullName && w.subCity && w.city && w.district
          )
        );

      case 5: // Terms
        return formData.agreementAccepted;

      default:
        return false;
    }
  };

  const allStepsCompleted = [1, 2, 3, 4, 5].every((step) => getStepStatus(step));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) {
      toast.error('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const form = new FormData();
      for (let key in formData) {
        if (key === 'beneficiaries' || key === 'witnesses') {
          form.append(key, JSON.stringify(formData[key]));
        } else if (key === 'address') {
          form.append('address', JSON.stringify(formData.address));
        } else if (key === 'idDocument' && formData.idDocument) {
          form.append('idDocument', formData.idDocument);
        } else {
          form.append(key, formData[key]);
        }
      }

      const token = localStorage.getItem('token');
      await api.post('/memberships', form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Membership application submitted!');
      setTimeout(() => navigate('/member-dashboard', { replace: true }), 1500);

    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'Something went wrong.';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-4 mb-5">
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      <Card className="p-4 shadow">
        <h3 className="mb-4 text-center">Membership Application Form</h3>
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Progress Bar */}
        <div className="progress-steps">
          {[1, 2, 3, 4, 5].map((num, idx) => {
            const isCompleted = getStepStatus(num); // check if section completed

            return (
              <div key={num} className={`step ${isCompleted ? "completed" : "pending"}`}>
                <div className="step-circle">{num}</div>
                <div className="step-label">
                  {num === 1 && "Personal Info"}
                  {num === 2 && "Address"}
                  {num === 3 && "Beneficiary"}
                  {num === 4 && "Witnesses"}
                  {num === 5 && "Terms"}
                </div>
              </div>
            );
          })}
        </div>

        <Form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <div id="step-1">
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control name="fullName" value={formData.fullName} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Age</Form.Label>
                  <Form.Control type="number" name="age" value={formData.age} onChange={handleChange} required min="1" />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Gender</Form.Label>
                  <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Marital Status</Form.Label>
                  <Form.Select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Education Level</Form.Label>
                  <Form.Select name="educationLevel" value={formData.educationLevel} onChange={handleChange} required>
                    <option value="">Select</option>
                    {educationLevels.map(level => <option key={level} value={level}>{level}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Occupation</Form.Label>
                  <Form.Control name="occupation" value={formData.occupation} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control name="phone" value={formData.phone} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Address */}
          <div id="step-2">
            <h5 className="mt-4">Address</h5>
            <Row className="mb-3">
              <Col md={4} xs={12} className="mb-2">
                <Form.Control value="Addis Ababa" disabled />
              </Col>
              <Col md={4} className="mb-2">
                <Form.Select name="address.subCity" value={formData.address.subCity} onChange={handleChange} required>
                  <option value="">Select Sub-City</option>
                  {addisAbabaSubCities.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </Form.Select>
              </Col>
              <Col md={4} xs={12}>
                <Form.Control placeholder="District" name="address.district" value={formData.address.district} onChange={handleChange} required />
              </Col>
            </Row>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>How did you hear about us?</Form.Label>
            <Form.Control name="sourceOfInformation" value={formData.sourceOfInformation} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload ID Document</Form.Label>
            <Form.Control type="file" name="idDocument" onChange={handleChange} required />
          </Form.Group>

          <hr />

          {/* Beneficiary */}
          <div id="step-3">
            <h5 className="mt-4">Beneficiary (only 1)</h5>
            {renderPersonFields('beneficiaries', formData.beneficiaries)}
          </div>

          {/* Witnesses */}
          <div id="step-4">
            <h5 className="mt-4">Witnesses (3 required)</h5>
            {renderPersonFields('witnesses', formData.witnesses)}

            {formData.witnesses.length < 3 && (
              <Button variant="outline-primary" size="sm" className="mt-2" style={{color: "black", fontWeight: "bold", fontSize: "15px"}} onClick={() => setFormData(prev => ({ ...prev, witnesses: [...prev.witnesses, { ...emptyPerson }] }))}>
                + Add Witness
              </Button>
            )}
          </div>

          {/* Terms */}
          <div id="step-5">
            <Form.Group className="mt-4">
              <Form.Check
                name="agreementAccepted"
                checked={formData.agreementAccepted}
                onChange={handleChange}
                label="I agree to: regular savings contributions, loan repayment obligations, and abiding by SACCO bylaws."
                required
              />
            </Form.Group>
          </div>

          <div className="text-center mt-4">
            <Button type="submit" disabled={!allStepsCompleted}>
              Submit Application
            </Button>
          </div>

        </Form>
      </Card>
    </Container>
  );
};

export default BecomeMembershipFormPage;
