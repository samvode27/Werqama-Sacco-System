import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    Container, Form, Button, Card, Spinner, Row, Col, Alert, Table, Modal
} from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/SavingsPage.css';
import { useSelector } from 'react-redux';
import moment from 'moment';

const SavingsPage = () => {
    const { currentUser, token } = useSelector(state => state.user);

    const [amount, setAmount] = useState('');
    const [manualAmount, setManualAmount] = useState('');
    const [savings, setSavings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [receipt, setReceipt] = useState(null);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Filters & pagination
    const [statusFilter, setStatusFilter] = useState('');
    const [methodFilter, setMethodFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    // Receipt modal
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    const fetchSavingsHistory = async () => {
        if (!currentUser || !token) return;
        setLoading(true);
        try {
            const params = { page, limit };
            if (statusFilter) params.status = statusFilter;
            if (methodFilter) params.method = methodFilter;
            if (startDate && endDate) {
                params.startDate = startDate;
                params.endDate = endDate;
            }

            const { data } = await api.get(`/savings/member/${currentUser._id}`, {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });
            setSavings(data);
            setTotalPages(Math.ceil(data.total / limit));
        } catch (err) {
            setError('Failed to load savings history.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser && token) fetchSavingsHistory();
    }, [currentUser, token, page, statusFilter, methodFilter, startDate, endDate]);

    const handlePayWithChapa = async () => {
        if (!amount || Number(amount) <= 0) return toast.error('Enter valid amount.');
        try {
            const res = await api.post('/payment/chapa/init', { amount });
            window.location.href = res.data.checkout_url;
        } catch (err) {
            toast.error('Payment initialization failed.');
        }
    };

    const handleManualSubmit = async e => {
        e.preventDefault();
        if (!manualAmount || !receipt) return setError('Amount and receipt required.');

        const formData = new FormData();
        formData.append('amount', manualAmount);
        formData.append('receipt', receipt);

        try {
            setSubmitting(true);
            await api.post('/savings/submit', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Manual saving submitted!');
            setManualAmount('');
            setReceipt(null);
            fetchSavingsHistory();
        } catch (err) {
            setError('Failed to submit manual saving.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleExportCSV = () => {
        if (!savings || savings.length === 0) {
            toast.error('No data to export.');
            return;
        }

        // Create CSV header
        const headers = ['Date', 'Amount', 'Status', 'Method', 'Receipt', 'Notes'];

        // Map savings data to CSV rows
        const rows = savings.map(s => [
            moment(s.date).format('YYYY-MM-DD'),
            s.amount.toFixed(2),
            s.status,
            s.method,
            s.receipt ? s.receipt : 'No Receipt',
            s.adminNotes && s.adminNotes.length > 0
                ? s.adminNotes.map(note => note.note).join('; ')
                : 'No Notes'
        ]);

        // Combine header and rows
        const csvContent = [headers, ...rows]
            .map(e => e.map(a => `"${a}"`).join(',')) // quote each field
            .join('\n');

        // Create a Blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'savings.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('CSV exported successfully!');
    };

    return (
        <>
            <ToastContainer />
            <section className="savings-hero text-center">
                <h3 className="title mt-5 pt-3">Monthly Savings Payment</h3>
                <p className="subtitlee pb-4">Pay your SACCO monthly savings easily and view history below.</p>
            </section>

            <Container>
                {/* Payment Cards */}
                <Row className="g-4 mb-4">
                    <Col md={6}>
                        <Card className="savings-card">
                            <h5>Pay with Chapa</h5>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Amount (ETB)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                    />
                                </Form.Group>
                                <button
                                    type="button"
                                    onClick={handlePayWithChapa}
                                    style={{
                                        width: "100%",
                                        backgroundColor: "goldenrod",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        padding: "10px",
                                        fontSize: "1rem",
                                        fontWeight: "600",
                                    }}
                                >
                                    Pay with Chapa
                                </button>
                            </Form>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="savings-card">
                            <h5>Manual Deposit</h5>
                            <Form onSubmit={handleManualSubmit}>
                                <Row className="g-3">
                                    <Col xs={12} md={6}>
                                        <Form.Group>
                                            <Form.Label>Amount (ETB)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={manualAmount}
                                                onChange={e => setManualAmount(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group>
                                            <Form.Label>Upload Receipt</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*,application/pdf"
                                                onChange={e => setReceipt(e.target.files[0])}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    style={{
                                        width: "100%",
                                        backgroundColor: "goldenrod",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        padding: "10px",
                                        fontSize: "1rem",
                                        fontWeight: "600",
                                        marginTop: "15px",
                                        opacity: submitting ? 0.7 : 1,
                                        cursor: submitting ? "not-allowed" : "pointer",
                                    }}
                                >
                                    {submitting ? "Submitting..." : "Submit"}
                                </button>
                            </Form>
                        </Card>
                    </Col>
                </Row>

                {/* Savings History */}
                <div className="container-fluid">
                    <h5 className="mb-3">Savings History</h5>
                    <Row className="g-2 mb-3">
                        <Col xs={6} md={2}>
                            <Form.Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                                <option value="">All Status</option>
                                <option value="approved">Approved</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                            </Form.Select>
                        </Col>
                        <Col xs={6} md={2}>
                            <Form.Select value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
                                <option value="">All Methods</option>
                                <option value="Chapa">Chapa</option>
                                <option value="Bank">Bank</option>
                            </Form.Select>
                        </Col>
                        <Col xs={6} md={3}>
                            <Form.Control type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        </Col>
                        <Col xs={6} md={3}>
                            <Form.Control type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                        </Col>
                        <Col xs={12} md={2}>
                            <button
                                type="button"
                                onClick={handleExportCSV}
                                style={{
                                    width: "100%",
                                    backgroundColor: "goldenrod",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "7px",
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                }}
                            >
                                Export CSV
                            </button>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-4"><Spinner animation="border" /></div>
                    ) : savings.length === 0 ? (
                        <Alert variant="info">No savings yet.</Alert>
                    ) : (
                        <Table hover responsive className="text-center">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Method</th>
                                    <th>Receipt</th>
                                    <th>Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {savings.map(s => (
                                    <tr key={s._id}>
                                        <td>{moment(s.date).format('YYYY-MM-DD')}</td>
                                        <td>{s.amount.toFixed(2)}</td>
                                        <td>
                                            <span className={`badge bg-${s.status === 'approved' ? 'success' : s.status === 'pending' ? 'warning' : 'danger'}`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td>{s.method}</td>
                                        <td>
                                            {s.receipt ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setModalImage(`${process.env.REACT_APP_API_URL}/uploads/receipts/${s.receipt}`);
                                                        setShowModal(true);
                                                    }}
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        color: "goldenrod",
                                                        textDecoration: "underline",
                                                        cursor: "pointer",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    View
                                                </button>
                                            ) : (
                                                "No Receipt"
                                            )}
                                        </td>
                                        <td>
                                            {s.adminNotes.length > 0
                                                ? s.adminNotes.map((note, i) => (
                                                    <div key={i} title={note.note}>
                                                        {moment(note.date).format('MM/DD')}: {note.note}
                                                    </div>
                                                ))
                                                : 'No Notes'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            </Container>

            {/* Receipt Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Body>
                    <img src={modalImage} alt="Receipt" className="w-100 rounded" />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default SavingsPage;
