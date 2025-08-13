import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import api from '../api/axios';
import { toast } from 'react-toastify';

const FormUpload = () => {
  const [file, setFile] = useState(null);
  const [type, setType] = useState('membership');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file.");

    const formData = new FormData();
    formData.append('form', file);
    formData.append('type', type);

    try {
      await api.post('/form-uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Form uploaded successfully!');
      setFile(null);
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  return (
    <Card className="p-4 my-4 shadow-sm">
      <h5 className="mb-3">📤 Upload Filled Form</h5>
      <Form onSubmit={handleSubmit}>
        <Row className="align-items-end">
          <Col md={4}>
            <Form.Group controlId="formType">
              <Form.Label>Form Type</Form.Label>
              <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="membership">Membership</option>
                <option value="loan">Loan</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group controlId="formFile">
              <Form.Label>Upload .docx File</Form.Label>
              <Form.Control type="file" accept=".doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Button type="submit" className="w-100">Upload</Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default FormUpload;
