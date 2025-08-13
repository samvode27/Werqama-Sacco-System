// src/components/ApplicationForms.js
import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FaWpforms } from 'react-icons/fa';

const ApplicationForms = () => {
  const forms = [
    {
      title: 'Membership Application Form',
      url: 'https://forms.gle/DwNKAd6gWDMzxuxo8',
    },
    {
      title: 'Loan Application Form',
      url: 'https://forms.gle/PjgE4EGp2L2fTBSt8',
    },
  ];

  return (
    <div className="mt-5">
      <h4 className="mb-3 text-center">📝 Apply Online</h4>
      <Row className="justify-content-center">
        {forms.map((form, idx) => (
          <Col md={4} key={idx} className="mb-3">
            <Card className="text-center shadow-sm p-3">
              <Card.Body>
                <Card.Title>{form.title}</Card.Title>
                <Button
                  variant="success"
                  href={form.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3"
                >
                  <FaWpforms className="me-2" />
                  Fill Form
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ApplicationForms;
