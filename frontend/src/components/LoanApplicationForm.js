import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import axios from '../api/axios';
import '../styles/LoanForm.css';

const LoanApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    gender: '',
    maritalStatus: '',
    phone: '',
    address: { subCity: '', city: '', district: '' },
    loanAmount: '',
    loanDurationMonths: '',
    monthlyIncome: '',
    spouseMonthlyIncome: '',
    loanPurpose: '',
    witness: { fullName: '', phone: '' },
    guaranteeType: '',
    guarantor: { fullName: '', institution: '', jobRole: '' },
    agreementAccepted: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('address.') || name.includes('witness.') || name.includes('guarantor.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // ✅ validation function
  const isFormValid = () => {
    const {
      fullName, email, age, gender, maritalStatus, phone,
      loanAmount, loanDurationMonths, monthlyIncome, loanPurpose,
      guaranteeType, agreementAccepted,
      address, witness, guarantor
    } = formData;

    return (
      fullName &&
      email &&
      age &&
      gender &&
      maritalStatus &&
      phone &&
      address.city &&
      address.subCity &&
      address.district &&
      loanAmount &&
      loanDurationMonths &&
      monthlyIncome &&
      loanPurpose &&
      witness.fullName &&
      witness.phone &&
      guaranteeType &&
      guarantor.fullName &&
      guarantor.institution &&
      guarantor.jobRole &&
      agreementAccepted
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await axios.post('/loans/apply', formData);
      setSuccess('Loan application submitted successfully.');
      setFormData({
        fullName: '', email: '', age: '', gender: '', maritalStatus: '', phone: '',
        address: { subCity: '', city: '', district: '' }, loanAmount: '', loanDurationMonths: '',
        monthlyIncome: '', spouseMonthlyIncome: '', loanPurpose: '',
        witness: { fullName: '', phone: '' }, guaranteeType: '',
        guarantor: { fullName: '', institution: '', jobRole: '' }, agreementAccepted: false
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="loan-form-card mt-5 p-4 shadow">
      <h3 className="mb-4 text-center">Loan Application Form</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          {/* all form inputs (same as before) */}
          <Col md={6}><Form.Control name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required /></Col>
          <Col md={6}><Form.Control name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required /></Col>
          <Col md={4}><Form.Control name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} required /></Col>
          <Col md={4}>
            <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required >
              <option value="">Marital Status</option>
              <option>Married</option>
              <option>Single</option>
              <option>Other</option>
            </Form.Select>
          </Col>
          <Col md={12}><Form.Control name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required /></Col>
          <Col md={4}><Form.Control name="address.city" placeholder="City" value={formData.address.city} onChange={handleChange} required /></Col>
          <Col md={4}><Form.Control name="address.subCity" placeholder="Sub-city" value={formData.address.subCity} onChange={handleChange} required /></Col>
          <Col md={4}><Form.Control name="address.district" placeholder="District" value={formData.address.district} onChange={handleChange} required /></Col>
          <Col md={6}><Form.Control name="loanAmount" type="number" placeholder="Loan Amount" value={formData.loanAmount} onChange={handleChange} required /></Col>
          <Col md={6}><Form.Control name="loanDurationMonths" type="number" placeholder="Repayment Period (Months)" value={formData.loanDurationMonths} onChange={handleChange} required /></Col>
          <Col md={6}><Form.Control name="monthlyIncome" type="number" placeholder="Monthly Income" value={formData.monthlyIncome} onChange={handleChange} required /></Col>
          <Col md={6}><Form.Control name="spouseMonthlyIncome" type="number" placeholder="Spouse Monthly Income (Optional)" value={formData.spouseMonthlyIncome} onChange={handleChange} /></Col>
          <Col md={12}>
           <Form.Select name="loanPurpose" value={formData.loanPurpose} onChange={handleChange} required >
              <option value="">Loan Purpose</option>
              <option>Medical</option>
              <option>Education and Training</option>
              <option>Property Purchase and Renovation</option>
              <option>Home Purchase or Renovation</option>
              <option>Engagement and Marriage</option>
              <option>Life Improvement</option>
              <option>Graduate Studies</option>
              <option>Social Issues</option>
              <option>Business Start-up or Expansion</option>
              <option>Car Purchase or Renovation</option>
              <option>Holidays</option>
              <option>Other</option>
            </Form.Select>
          </Col>
          <Col md={6}><Form.Control name="witness.fullName" placeholder="Witness Full Name" value={formData.witness.fullName} onChange={handleChange} required /></Col>
          <Col md={6}><Form.Control name="witness.phone" placeholder="Witness Phone" value={formData.witness.phone} onChange={handleChange} required /></Col>
          <Col md={12}>
            <Form.Select name="guaranteeType" value={formData.guaranteeType} onChange={handleChange} required>
              <option value="">Select Guarantee Type</option>
              <option>Job Guarantee</option>
              <option>Financial Guarantee</option>
            </Form.Select>
          </Col>
          <Col md={4}><Form.Control name="guarantor.fullName" placeholder="Guarantor Name" value={formData.guarantor.fullName} onChange={handleChange} required /></Col>
          <Col md={4}><Form.Control name="guarantor.institution" placeholder="Institution" value={formData.guarantor.institution} onChange={handleChange} required /></Col>
          <Col md={4}><Form.Control name="guarantor.jobRole" placeholder="Job Role" value={formData.guarantor.jobRole} onChange={handleChange} required /></Col>
          <Col md={12} className="text-start">
            <Form.Check type="checkbox" name="agreementAccepted" checked={formData.agreementAccepted} onChange={handleChange} label="I agree to the loan guidelines of WERQAMA SACCO." required />
          </Col>
          <Col xs={12} className="text-center">
            <Button
              type="submit"
              className="btn-apply"
              disabled={loading || !isFormValid()}  // ✅ disables until valid
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default LoanApplicationForm;
