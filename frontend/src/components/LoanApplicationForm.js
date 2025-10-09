import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert, ProgressBar } from 'react-bootstrap';
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
    address: { city: '', subCity: '', district: '' },

    loanAmount: '',
    loanDurationMonths: '',
    monthlyIncome: '',
    spouseMonthlyIncome: '',
    loanPurpose: '',

    witness: { fullName: '', phone: '' },

    guaranteeType: '',
    guaranteeDocument: null,

    guarantor: { fullName: '', institution: '', jobRole: '' },

    agreementAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [progress, setProgress] = useState(0);

  // Update progress dynamically
  useEffect(() => {
    const totalFields = 15; // Number of key required fields
    let filled = 0;
    if (formData.fullName) filled++;
    if (formData.email) filled++;
    if (formData.age) filled++;
    if (formData.gender) filled++;
    if (formData.maritalStatus) filled++;
    if (formData.phone) filled++;
    if (formData.address.city && formData.address.subCity && formData.address.district) filled++;
    if (formData.loanAmount) filled++;
    if (formData.loanDurationMonths) filled++;
    if (formData.monthlyIncome) filled++;
    if (formData.loanPurpose) filled++;
    if (formData.witness.fullName && formData.witness.phone) filled++;
    if (formData.guaranteeType && formData.guaranteeDocument) filled++;
    if (formData.guarantor.fullName && formData.guarantor.institution && formData.guarantor.jobRole) filled++;
    if (formData.agreementAccepted) filled++;

    setProgress(Math.round((filled / totalFields) * 100));
  }, [formData]);

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;

    if (name.includes('address.') || name.includes('witness.') || name.includes('guarantor.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, guaranteeDocument: files[0] }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const isFormValid = () => {
    const { fullName, email, age, gender, maritalStatus, phone, address, loanAmount, loanDurationMonths,
      monthlyIncome, loanPurpose, witness, guaranteeType, guaranteeDocument, guarantor, agreementAccepted } = formData;

    return (
      fullName && email && age && gender && maritalStatus && phone &&
      address.city && address.subCity && address.district &&
      loanAmount && loanDurationMonths && monthlyIncome && loanPurpose &&
      witness.fullName && witness.phone &&
      guaranteeType && guaranteeDocument &&
      guarantor.fullName && guarantor.institution && guarantor.jobRole &&
      agreementAccepted
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (['address', 'witness', 'guarantor'].includes(key)) {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === 'guaranteeDocument') {
          data.append('guaranteeDocument', formData.guaranteeDocument);
        } else {
          data.append(key, formData[key]);
        }
      });

      const response = await axios.post('/loans/apply', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Loan application submitted successfully!');
      setFormData({
        fullName: '', email: '', age: '', gender: '', maritalStatus: '', phone: '',
        address: { city: '', subCity: '', district: '' },
        loanAmount: '', loanDurationMonths: '', monthlyIncome: '', spouseMonthlyIncome: '',
        loanPurpose: '', witness: { fullName: '', phone: '' }, guaranteeType: '', guaranteeDocument: null,
        guarantor: { fullName: '', institution: '', jobRole: '' }, agreementAccepted: false
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const guaranteeLabel = () => {
    switch (formData.guaranteeType) {
      case 'Salary Guarantee': return 'Upload Salary Letter';
      case 'Car Guarantee': return 'Upload Car Libre';
      case 'Home Guarantee': return 'Upload Home Document';
      default: return 'Upload Document';
    }
  };

  return (
    <Card className="loan-form-card mt-5 p-4 shadow">

      <ProgressBar now={progress} label={`${progress}%`} className="mt-4 mb-5" />

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit} className='mb-4'>
        <Row className="g-3">
          {/* Personal Info */}
          <Col md={4}><Form.Control name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required /></Col>
          <Col md={4}><Form.Control name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required /></Col>
          <Col md={4}><Form.Control name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} required /></Col>
          <Col md={4}>
            <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required>
              <option value="">Marital Status</option>
              <option>Single</option>
              <option>Married</option>
              <option>Other</option>
            </Form.Select>
          </Col>
          <Col md={4}><Form.Control name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required /></Col>
          <Col md={4}><Form.Control name="address.city" placeholder="City" value={formData.address.city} onChange={handleChange} required /></Col>
          <Col md={4}><Form.Control name="address.subCity" placeholder="Sub-city" value={formData.address.subCity} onChange={handleChange} required /></Col>
          <Col md={4}><Form.Control name="address.district" placeholder="District" value={formData.address.district} onChange={handleChange} required /></Col>

          {/* Loan Info */}
          <Col md={6}><Form.Control name="loanAmount" type="number" placeholder="Loan Amount" value={formData.loanAmount} onChange={handleChange} required /></Col>
          <Col md={6}><Form.Control name="loanDurationMonths" type="number" placeholder="Repayment Months" value={formData.loanDurationMonths} onChange={handleChange} required /></Col>
          <Col md={6}><Form.Control name="monthlyIncome" type="number" placeholder="Monthly Income" value={formData.monthlyIncome} onChange={handleChange} required /></Col>
          <Col md={6}><Form.Control name="spouseMonthlyIncome" type="number" placeholder="Spouse Monthly Income (Optional)" value={formData.spouseMonthlyIncome} onChange={handleChange} /></Col>
          <Col md={12}>
            <Form.Select name="loanPurpose" value={formData.loanPurpose} onChange={handleChange} required>
              <option value="">Select Loan Purpose</option>
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

          {/* Witness */}
          <Col md={6}><Form.Control name="witness.fullName" placeholder="Witness Full Name" value={formData.witness.fullName} onChange={handleChange} required /></Col>
          <Col md={6}><Form.Control name="witness.phone" placeholder="Witness Phone" value={formData.witness.phone} onChange={handleChange} required /></Col>

          {/* Guarantee */}
          <Col md={6}>
            <Form.Select name="guaranteeType" value={formData.guaranteeType} onChange={handleChange} required>
              <option value="">Select Guarantee Type</option>
              <option value="Salary Guarantee">Salary Guarantee</option>
              <option value="Car Guarantee">Car Guarantee</option>
              <option value="Home Guarantee">Home Guarantee</option>
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label>{guaranteeLabel()}</Form.Label>
            <Form.Control type="file" name="guaranteeDocument" onChange={handleChange} required />
          </Col>

          {/* Guarantor */}
          <Col md={4}><Form.Control name="guarantor.fullName" placeholder="Guarantor Name" value={formData.guarantor.fullName} onChange={handleChange} required /></Col>
          <Col md={4}><Form.Control name="guarantor.institution" placeholder="Institution" value={formData.guarantor.institution} onChange={handleChange} required /></Col>
          <Col md={4}><Form.Control name="guarantor.jobRole" placeholder="Job Role" value={formData.guarantor.jobRole} onChange={handleChange} required /></Col>

          <Col md={12}>
            <Form.Check
              type="checkbox"
              name="agreementAccepted"
              checked={formData.agreementAccepted}
              onChange={handleChange}
              label="I agree to the loan guidelines."
              required
              style={{ gap: "8px", display: "flex", alignItems: "center" }}
            />
          </Col>

          <Col xs={12} className="text-center">
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              style={{
                backgroundColor: "goldenrod",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "10px 15px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: loading || !isFormValid() ? "not-allowed" : "pointer",
                opacity: loading || !isFormValid() ? 0.7 : 1,
                width: "100%",
              }}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default LoanApplicationForm;
