import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Container, Form, Button, Card, Spinner, Row, Col, Alert } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/SavingsPage.css';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import moment from 'moment';

const SavingsPage = () => {
    const [amount, setAmount] = useState('');
    const [manualAmount, setManualAmount] = useState('');
    const [receiptFile, setReceiptFile] = useState(null);
    const [savings, setSavings] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    // const { user, token } = useAuth();
    const [receipt, setReceipt] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchSavingsHistory = async () => {
        if (!user || !token) return;

        try {
            setLoading(true);
            const { data } = await api.get(`/savings/member/${user._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSavings(data);
        } catch (err) {
            console.error('Savings fetch error:', err);
            setError('Failed to load savings history.');
        } finally {
            setLoading(false);
        }
    };

    const { user, token, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && user && token) {
            fetchSavingsHistory();
        }
    }, [authLoading, user, token]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const txRefParam = params.get('tx_ref');

        if (params.get('status') === 'success' && txRefParam) {
            toast.success('Payment completed successfully!');
            let retries = 0;
            const maxRetries = 6;

            const interval = setInterval(async () => {
                retries++;
                try {
                    const res = await api.get('/savings/mine');
                    setSavings(res.data);
                    if (res.data.some(s => s.tx_ref === txRefParam)) {
                        clearInterval(interval);
                        toast.success('Payment recorded and visible in history!');
                    } else if (retries >= maxRetries) {
                        clearInterval(interval);
                        toast.info('Payment may take more time to appear.');
                    }
                } catch (error) {
                    if (retries >= maxRetries) {
                        clearInterval(interval);
                        toast.error('Error fetching payment history.');
                    }
                }
            }, 5000);

            return () => clearInterval(interval);
        } else if (params.get('status') === 'failed') {
            toast.error('Payment failed. Please try again.');
        }
    }, [location]);

    const handlePayWithChapa = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error('Please enter a valid amount.');
            return;
        }
        try {
            const res = await api.post('/payment/chapa/init', { amount });
            toast.info('Redirecting to Chapa...');
            window.location.href = res.data.checkout_url;
        } catch (err) {
            console.error(err);
            toast.error('Payment initialization failed.');
        }
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        if (!manualAmount || !receipt) {
            setError('Please provide an amount and receipt.');
            return;
        }

        const formData = new FormData();
        formData.append('amount', manualAmount);
        formData.append('receipt', receipt);

        try {
            setSubmitting(true);
            await api.post('/savings/manual', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Manual saving submitted successfully!');
            setManualAmount('');
            setReceipt(null);
            fetchSavingsHistory();
        } catch (err) {
            setError('Failed to submit manual saving.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="savings-hero text-center">
                <h3 className="gradient-text">Monthly Savings Payment</h3>
                <h6 className="subtitle">Pay your SACCO monthly savings easily and view your payment history below.</h6>
            </div>

            <Container className="savings-container">
                <Row>
                    {/* Chapa Section */}
                    <Col md={6}>
                        <div className="payment-card mb-4">
                            <h5>Pay with Chapa</h5>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Amount (ETB)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter amount to save"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="primary" onClick={handlePayWithChapa}>
                                    Pay with Chapa
                                </Button>
                            </Form>
                        </div>
                    </Col>

                    {/* Manual Section */}
                    <Col md={6}>
                        <Card className="p-4 mb-4 shadow-sm">
                            <h5>Manual Bank Deposit</h5>
                            <Form onSubmit={handleManualSubmit}>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="manualAmount">
                                            <Form.Label>Amount (ETB)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter amount to save"
                                                value={manualAmount}
                                                onChange={(e) => setManualAmount(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="receipt">
                                            <Form.Label>Upload Receipt</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*,application/pdf"
                                                onChange={(e) => setReceipt(e.target.files[0])}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button type="submit" variant="primary" disabled={submitting}>
                                    {submitting ? 'Submitting...' : 'Submit Manual Saving'}
                                </Button>
                            </Form>
                        </Card>
                    </Col>
                </Row>

                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Card className="p-3 shadow-sm mt-4">
                    <h5>Savings History</h5>

                    {loading ? (
                        <div className="text-center my-3">
                            <Spinner animation="border" />
                        </div>
                    ) : error ? (
                        <div className="text-danger text-center my-2">{error}</div>
                    ) : (
                        <table className="table table-hover mt-3">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Method</th>
                                    <th>Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {savings.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No savings yet.
                                        </td>
                                    </tr>
                                ) : (
                                    savings.map((s) => (
                                        <tr key={s._id}>
                                            <td>{moment(s.date).format('YYYY-MM-DD')}</td>
                                            <td>{s.amount.toFixed(2)}</td>
                                            <td>
                                                <span
                                                    className={`badge bg-${s.status === 'approved'
                                                            ? 'success'
                                                            : s.status === 'pending'
                                                                ? 'warning'
                                                                : 'danger'
                                                        }`}
                                                >
                                                    {s.status}
                                                </span>
                                            </td>
                                            <td>{s.method}</td>
                                            <td>
                                                {s.receipt ? (
                                                    <a
                                                        href={`${import.meta.env.VITE_BACKEND_URL}/uploads/${s.receipt}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        View
                                                    </a>
                                                ) : (
                                                    'N/A'
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </Card>

            </Container>
        </>
    );
};

export default SavingsPage;
