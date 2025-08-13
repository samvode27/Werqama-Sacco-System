// src/pages/LoanPage.js

import React from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import LoanApplicationForm from '../components/LoanApplicationForm';
import LoanHistoryTable from '../components/LoanHistoryTable';

const LoanPage = () => {

  return (
    <div className="container mt-5">
      {/* Loan Application Form */}
      <div className="mb-5" data-aos="fade-up">
        <h3 className="mb-3 text-primary text-center">Apply for a Loan</h3>
        <LoanApplicationForm />
      </div>

      {/* Loan History Table */}
      <div data-aos="fade-up">
        <h3 className="mb-3 text-success text-center">Loan Status & History</h3>
        <LoanHistoryTable />
      </div>
    </div>
  );
};

export default LoanPage;
