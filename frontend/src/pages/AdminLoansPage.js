import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Table, Form, Button, Row, Col, Card, Badge, Modal, ListGroup } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import moment from 'moment';
import '../styles/AdminLoansPage.css';

const AdminLoansPage = () => {
    const [loans, setLoans] = useState([]);
    const [filteredLoans, setFilteredLoans] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [memberHistory, setMemberHistory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loanTypeFilter, setLoanTypeFilter] = useState('');
    const [adminNote, setAdminNote] = useState('');
    const [memberLoanHistory, setMemberLoanHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);


    useEffect(() => {
        fetchLoans();
    }, []);

    useEffect(() => {
        filterLoans();
    }, [loans, statusFilter, searchQuery, loanTypeFilter]);

    const fetchLoans = async () => {
        try {
            const res = await axios.get('/loans/all');
            setLoans(res.data);
        } catch (err) {
            console.error('Failed to fetch loans:', err);
        }
    };

    const fetchMemberHistory = async (memberId) => {
        try {
            setLoadingHistory(true);
            const res = await axios.get(`/api/member-history/${memberId}`);
            setMemberLoanHistory(res.data);
        } catch (err) {
            console.error('Error fetching member loan history:', err);
            setMemberLoanHistory([]);
        } finally {
            setLoadingHistory(false);
        }
    };

    const openLoanModal = (loan) => {
        setSelectedLoan(loan);
        setShowModal(true);
        if (loan.memberId) {
            fetchMemberHistory(loan.memberId);
        }
    };

    const filterLoans = () => {
        let filtered = [...loans];

        if (statusFilter) {
            filtered = filtered.filter(loan => loan.status === statusFilter);
        }

        if (searchQuery) {
            filtered = filtered.filter(loan =>
                (loan.member?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (loanTypeFilter) {
            filtered = filtered.filter(loan => loan.loanType === loanTypeFilter);
        }

        setFilteredLoans(filtered);
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'approved': return 'success';
            case 'rejected': return 'danger';
            case 'disbursed': return 'info';
            default: return 'secondary';
        }
    };

    const statuses = ['pending', 'approved', 'rejected', 'disbursed'];

    const chartData = {
        labels: statuses.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        datasets: ['count', 'amount'].map((type) => ({
            label: type === 'count' ? 'Loan Count' : 'Total Amount (ETB)',
            data: statuses.map(status =>
                type === 'count'
                    ? loans.filter(l => l.status === status).length
                    : loans.filter(l => l.status === status).reduce((sum, l) => sum + parseFloat(l.amount || 0), 0)
            ),
            backgroundColor:
                type === 'count'
                    ? 'rgba(91, 192, 222, 0.6)'
                    : 'rgba(92, 184, 92, 0.6)',
            borderColor: type === 'count' ? '#5bc0de' : '#5cb85c',
            borderWidth: 1,
            borderRadius: 10,
            yAxisID: type === 'count' ? 'y1' : 'y2',
        }))
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: 'Loan Status Overview'
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        const label = ctx.dataset.label;
                        const val = ctx.raw;
                        return label.includes('Amount') ? `${label}: ETB ${val.toLocaleString()}` : `${label}: ${val}`;
                    }
                }
            }
        },
        scales: {
            y1: {
                type: 'linear',
                position: 'left',
                suggestedMax: 10,
                title: { display: true, text: 'Loan Count' }
            },
            y2: {
                type: 'linear',
                position: 'right',
                title: { display: true, text: 'Total Amount (ETB)' },
                grid: { drawOnChartArea: false },
                suggestedMax: 100000
            }
        }
    };

    const handleDecision = async (decision) => {
        try {
            await axios.put(`/loans/${selectedLoan._id}/status`, {
                status: decision,
                note: adminNote,
            });

            alert(`Loan ${decision} successfully`);
            setShowModal(false); // Close modal after action
            fetchLoans(); // Refresh loan list
        } catch (error) {
            console.error('Error updating loan status:', error);
            alert('Failed to update loan status');
        }
    };

    useEffect(() => {
        if (showModal) {
            setAdminNote('');
        }
    }, [showModal]);

    const statusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'approved': return 'success';
            case 'rejected': return 'danger';
            default: return 'secondary';
        }
    };

    return (
        <div className="dashboard-container">
            <h2 className="loan-title">Loan Management Dashboard</h2>

            <Card className="mb-4 card-analytics">
                <Card.Body>
                    <h5 className="mb-3">Loan Status Overview</h5>
                    <div style={{ height: '400px' }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </Card.Body>
            </Card>

            <Row className="mb-3 g-3 filter-bar">
                <Col md={3}>
                    <Form.Control
                        type="text"
                        placeholder="🔍 Search member name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Col>
                <Col md={3}>
                    <Form.Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="">All Statuses</option>
                        {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Form.Select value={loanTypeFilter} onChange={e => setLoanTypeFilter(e.target.value)}>
                        <option value="">All Types</option>
                        <option value="emergency">Emergency</option>
                        <option value="education">Education</option>
                        <option value="business">Business</option>
                        <option value="personal">Personal</option>
                        {/* Add your actual types */}
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('');
                            setLoanTypeFilter('');
                        }}
                    >
                        Reset
                    </Button>
                </Col>
            </Row>

            <Card className="loan-table">
                <Card.Body>
                    <h5 className="mb-3">All Loan Applications</h5>
                    <Table responsive bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>User</th>
                                <th>Email</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Duration</th>
                                <th>Purpose</th>
                                <th>Submitted</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLoans.map((loan, index) => (
                                <tr key={loan._id}>
                                    <td>{index + 1}</td>
                                    <td>{loan.member?.name || 'N/A'}</td>
                                    <td>{loan.member?.email || 'N/A'}</td>
                                    <td>ETB {loan.loanAmount?.toLocaleString() || 'N/A'}</td>
                                    <td><Badge bg={getStatusVariant(loan.status)}>{loan.status}</Badge></td>
                                    <td>{loan.loanDurationMonths || 'N/A'} months</td>
                                    <td>{loan.loanPurpose || 'N/A'}</td>
                                    <td>{moment(loan.createdAt).fromNow()}</td>
                                    <td>
                                        <Button size="sm" onClick={() => openLoanModal(loan)}>
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Loan Detail Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Loan Details for {selectedLoan?.member?.fullName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedLoan ? (
                        <>
                            <p><strong>Amount:</strong> {selectedLoan.amount}</p>
                            <p><strong>Type:</strong> {selectedLoan.loanType}</p>
                            <p><strong>Duration:</strong> {selectedLoan.duration} months</p>
                            <p><strong>Status:</strong> <Badge bg={statusColor(selectedLoan.status)}>{selectedLoan.status}</Badge></p>

                            {/* Timeline / Status Updates */}
                            <h5>Status Timeline</h5>
                            <ListGroup className="mb-3">
                                {selectedLoan.statusTimeline.map((entry, idx) => (
                                    <ListGroup.Item key={idx}>
                                        <strong>{entry.status}</strong> - {moment(entry.date).format('LLL')}
                                        {entry.note && <div><em>{entry.note}</em></div>}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>

                            {/* Uploaded Documents */}
                            <h5>Documents</h5>
                            {selectedLoan.documents?.length > 0 ? (
                                <ListGroup className="mb-3">
                                    {selectedLoan.documents.map((doc, index) => (
                                        <ListGroup.Item key={index}>
                                            <a href={`${process.env.REACT_APP_API_URL}/uploads/${doc}`} target="_blank" rel="noreferrer">{doc}</a>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : <p>No documents uploaded.</p>}

                            {/* Admin Notes */}
                            <Form.Group className="mb-3">
                                <Form.Label>Admin Note</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="Write your decision note..."
                                />
                            </Form.Group>

                            {/* Action Buttons */}
                            <div className="d-flex justify-content-end gap-3">
                                <Button variant="success" onClick={() => handleDecision('approved')}>Approve</Button>
                                <Button variant="danger" onClick={() => handleDecision('rejected')}>Reject</Button>
                            </div>

                            {/* Member Loan & Repayment History */}
                            <h5 className="mt-4">Member History</h5>
                            <Row>
                                <Col>
                                    <h6>Past Loans</h6>
                                    <ul>
                                        {memberHistory?.loans?.map((loan, idx) => (
                                            <li key={idx}>{loan.amount} - {loan.status} - {moment(loan.createdAt).format('L')}</li>
                                        ))}
                                    </ul>
                                </Col>
                                <Col>
                                    <h6>Repayments</h6>
                                    <ul>
                                        {memberHistory?.repayments?.map((rep, idx) => (
                                            <li key={idx}>{rep.amountPaid} on {moment(rep.date).format('L')}</li>
                                        ))}
                                    </ul>
                                </Col>
                            </Row>
                        </>
                    ) : (
                        <p>Loading loan data...</p>
                    )}
                </Modal.Body>
            </Modal>

        </div>
    );
};

export default AdminLoansPage;
