import React, { useState } from 'react';
import axios from '../api/axios';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/BecomeMembershipFormPage.css'; // optional custom CSS
import { useNavigate } from 'react-router-dom';

const emptyPerson = { fullName: '', subCity: '', city: '', district: '' };

const BecomeMembershipFormPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    gender: '',
    maritalStatus: '',
    educationLevel: '',
    occupation: '',
    phone: '',
    address: {
      subCity: '',
      city: '',
      district: '',
    },
    sourceOfInformation: '',
    idDocument: null,
    beneficiaries: [ { ...emptyPerson }, { ...emptyPerson }, { ...emptyPerson } ],
    witnesses: [ { ...emptyPerson }, { ...emptyPerson }, { ...emptyPerson } ],
    agreementAccepted: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else if (name.startsWith('beneficiaries') || name.startsWith('witnesses')) {
      const [group, index, field] = name.split('.');
      setFormData((prev) => {
        const updated = [...prev[group]];
        updated[index][field] = value;
        return { ...prev, [group]: updated };
      });
    } else if (name === 'idDocument') {
      setFormData((prev) => ({ ...prev, idDocument: e.target.files[0] }));
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!formData.agreementAccepted) {
      toast.error('You must accept the agreement.');
      setSubmitting(false);
      return;
    }

    try {
      const form = new FormData();

      for (let key in formData) {
        if (key === 'beneficiaries' || key === 'witnesses') {
          form.append(key, JSON.stringify(formData[key]));
        } else if (key === 'address') {
          form.append('address', JSON.stringify(formData.address));
        } else if (key === 'idDocument') {
          if (formData.idDocument) form.append('idDocument', formData.idDocument);
        } else {
          form.append(key, formData[key]);
        }
      }

      const res = await axios.post('/memberships', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Membership application submitted!');
      navigate('/member-dashboard', { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong.');
      toast.error(error || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderPersonFields = (group, people) =>
    people.map((person, index) => (
      <Row key={index} className="mb-2">
        <Col md={3}>
          <Form.Control
            placeholder="Full Name"
            name={`${group}.${index}.fullName`}
            value={person.fullName}
            onChange={handleChange}
            required
          />
        </Col>
        <Col md={3}>
          <Form.Control
            placeholder="Sub-City"
            name={`${group}.${index}.subCity`}
            value={person.subCity}
            onChange={handleChange}
            required
          />
        </Col>
        <Col md={3}>
          <Form.Control
            placeholder="City"
            name={`${group}.${index}.city`}
            value={person.city}
            onChange={handleChange}
            required
          />
        </Col>
        <Col md={3}>
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

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow">
        <h3 className="mb-4 text-center">Membership Application Form</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control name="fullName" value={formData.fullName} onChange={handleChange} required />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Age</Form.Label>
                <Form.Control type="number" name="age" value={formData.age} onChange={handleChange} required />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
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
              <Form.Group className="mb-3">
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
              <Form.Group className="mb-3">
                <Form.Label>Education Level</Form.Label>
                <Form.Control name="educationLevel" value={formData.educationLevel} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Occupation</Form.Label>
                <Form.Control name="occupation" value={formData.occupation} onChange={handleChange} required />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control name="phone" value={formData.phone} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>

          <h5 className="mt-4">Address</h5>
          <Row>
            <Col md={4}>
              <Form.Control
                placeholder="Sub-City"
                name="address.subCity"
                value={formData.address.subCity}
                onChange={handleChange}
                required
              />
            </Col>
            <Col md={4}>
              <Form.Control
                placeholder="City"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                required
              />
            </Col>
            <Col md={4}>
              <Form.Control
                placeholder="District"
                name="address.district"
                value={formData.address.district}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>

          <Form.Group className="mt-3">
            <Form.Label>How did you hear about us?</Form.Label>
            <Form.Control name="sourceOfInformation" value={formData.sourceOfInformation} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Upload ID Document</Form.Label>
            <Form.Control type="file" name="idDocument" onChange={handleChange} required />
          </Form.Group>

          <hr />

          <h5 className="mt-4">Beneficiaries (3 Required)</h5>
          {renderPersonFields('beneficiaries', formData.beneficiaries)}

          <h5 className="mt-4">Witnesses (3 Required)</h5>
          {renderPersonFields('witnesses', formData.witnesses)}

          <Form.Group className="mt-4">
            <Form.Check
              name="agreementAccepted"
              checked={formData.agreementAccepted}
              onChange={handleChange}
              label="I accept the association’s terms and conditions."
              required
            />
          </Form.Group>

          <Button type="submit" className="mt-4 w-100" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default BecomeMembershipFormPage;
