import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Table, Button, Modal, Form, Badge, Row, Col, Container, Spinner, Card } from 'react-bootstrap';
import { FaMoneyBillWave, FaUserFriends, FaCrown, FaChartBar, FaChartPie, FaFilePdf, FaFileCsv, FaFilter } from 'react-icons/fa';
import moment from 'moment';
import { saveAs } from 'file-saver';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

import '../styles/AdminSavingsPage.css'; // Custom CSS for styling

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AdminSavingsPage = () => {
    const [savings, setSavings] = useState([]);
    const [filteredSavings, setFilteredSavings] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [selectedSaving, setSelectedSaving] = useState(null);
    const [note, setNote] = useState('');
    const [actionType, setActionType] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [manualForm, setManualForm] = useState({ member: '', amount: '', method: '', receipt: null, note: '' });

    useEffect(() => { fetchSavings(); }, []);
    useEffect(() => { filterSavings(); }, [filterStatus, savings]);

    const fetchSavings = async () => {
        try {
            setLoading(true);
            const res = await api.get('/savings');
            setSavings(res.data);
        } catch (err) {
            console.error('Error fetching savings:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterSavings = () => {
        let filtered = savings;

        if (filterStatus !== 'all') {
            filtered = filtered.filter(s => s.status === filterStatus);
        }

        if (startDate) {
            filtered = filtered.filter(s => new Date(s.date) >= new Date(startDate));
        }

        if (endDate) {
            filtered = filtered.filter(s => new Date(s.date) <= new Date(endDate));
        }

        if (minAmount) {
            filtered = filtered.filter(s => s.amount >= parseFloat(minAmount));
        }

        setFilteredSavings(filtered);
    };

    const handleAction = (saving, type) => {
        setSelectedSaving(saving);
        setActionType(type);
        setNote('');
        setShowModal(true);
    };

    const submitAction = async () => {
        if (!selectedSaving) return;
        try {
            const url = `/savings/${selectedSaving._id}/${actionType}`;
            await api.put(url, { note });
            setShowModal(false);
            fetchSavings();
        } catch (err) {
            console.error(`Error on ${actionType}:`, err);
        }
    };

    const statusBadge = (status) => {
        const colors = { approved: 'success', pending: 'warning', rejected: 'danger' };
        return <Badge bg={colors[status] || 'secondary'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(manualForm).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });
        try {
            await api.post('/savings/manual', formData);
            fetchSavings();
            setManualForm({ member: '', amount: '', method: '', receipt: null, note: '' });
        } catch (err) {
            console.error('Error adding manual saving:', err.response?.data || err.message);
        }
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, {
            head: [['Member', 'Amount', 'Method', 'Date', 'Status']],
            body: filteredSavings.map(s => [
                s.member?.name || 'N/A',
                `${s.amount} ETB`,
                s.method,
                moment(s.date).format('LLL'),
                s.status
            ])
        });
        doc.save('savings.pdf');
    };

    const getStatistics = () => {
        const totalAmount = savings.reduce((sum, s) => sum + s.amount, 0);
        const memberMap = new Map();
        savings.forEach(s => {
            const memberId = s.member?._id || s.member;
            if (!memberMap.has(memberId)) {
                memberMap.set(memberId, { name: s.member?.name || 'Unknown', total: 0 });
            }
            memberMap.get(memberId).total += s.amount;
        });
        const averagePerMember = memberMap.size ? (totalAmount / memberMap.size).toFixed(2) : 0;
        const topSavers = [...memberMap.values()].sort((a, b) => b.total - a.total).slice(0, 3);
        return { totalAmount, averagePerMember, topSavers };
    };
    const stats = getStatistics();

    const getMonthlyData = () => {
        const monthly = {};
        savings.forEach(s => {
            const month = moment(s.date).format('YYYY-MM');
            monthly[month] = (monthly[month] || 0) + s.amount;
        });
        const labels = Object.keys(monthly).sort();
        const data = labels.map(label => monthly[label]);
        return {
            labels,
            datasets: [{
                label: 'Total Savings',
                data,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderRadius: 8
            }]
        };
    };

    const getStatusData = () => {
        const counts = { approved: 0, pending: 0, rejected: 0 };
        savings.forEach(s => counts[s.status]++);
        return {
            labels: ['Approved', 'Pending', 'Rejected'],
            datasets: [{
                data: [counts.approved, counts.pending, counts.rejected],
                backgroundColor: ['#28a745', '#ffc107', '#dc3545']
            }]
        };
    };
    const monthlyTrend = getMonthlyData();
    const statusDistribution = getStatusData();

    return (
        <Container>
            <h3 className="my-4 text-center text-primary">Admin Savings Management</h3>

            <Row className="mb-4 g-3">
                {/* Total Savings Card */}
                <Col md={4}>
                    <Card className="p-4 shadow rounded text-white" style={{ backgroundColor: '#007bff' }}>
                        <div className="d-flex align-items-center">
                            <FaMoneyBillWave size={36} className="me-3" />
                            <div>
                                <h6 className="mb-1">Total Savings</h6>
                                <p className="fs-5 fw-bold">{stats.totalAmount.toLocaleString()} ETB</p>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Average per Member Card */}
                <Col md={4}>
                    <Card className="p-4 shadow rounded text-white" style={{ backgroundColor: '#17a2b8' }}>
                        <div className="d-flex align-items-center">
                            <FaUserFriends size={36} className="me-3" />
                            <div>
                                <h6 className="mb-1">Average per Member</h6>
                                <p className="fs-5 fw-bold">{stats.averagePerMember} ETB</p>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Top Savers Card */}
                <Col md={4}>
                    <Card className="p-4 shadow rounded text-dark" style={{ backgroundColor: '#ffc107' }}>
                        <div className="d-flex align-items-start">
                            <FaCrown size={36} className="me-3 mt-1" />
                            <div>
                                <h6 className="mb-2">Top Savers</h6>
                                <ul className="mb-0 list-unstyled">
                                    {stats.topSavers.map((s, i) => (
                                        <li key={i}><strong>{s.name}</strong>: {s.total.toLocaleString()} ETB</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4 charts-row">
                <Col md={6}>
                    <Card className="p-3 h-100 chart-card border-0 shadow-sm bg-light">
                        <div className="d-flex align-items-center justify-content-center mb-2">
                            <FaChartBar className="me-2 text-primary" size={20} />
                            <h6 className="mb-0">Monthly Savings Trend</h6>
                        </div>
                        <Bar data={monthlyTrend} options={{
                            responsive: true,
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    backgroundColor: '#fff',
                                    titleColor: '#000',
                                    bodyColor: '#000',
                                    borderColor: '#ccc',
                                    borderWidth: 1,
                                },
                            },
                            scales: {
                                x: { grid: { display: false } },
                                y: { ticks: { beginAtZero: true } },
                            },
                        }} />
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="p-3 h-100 chart-card border-0 shadow-sm bg-light">
                        <div className="d-flex align-items-center justify-content-center mb-2">
                            <FaChartPie className="me-2 text-warning" size={20} />
                            <h6 className="mb-0">Savings Status Distribution</h6>
                        </div>
                        <div className="d-flex justify-content-center">
                            <div style={{ width: '220px', height: '320px' }}>
                                <Pie
                                    data={statusDistribution}
                                    width={250}
                                    height={250}
                                    options={{
                                        responsive: false,
                                        maintainAspectRatio: true,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: { boxWidth: 12 }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4 mt-4 align-items-end g-3 filter-bar px-2 py-3 rounded shadow-sm bg-light">
                <Col md={2} sm={6}>
                    <Form.Label className="fw-semibold text-muted">Status</Form.Label>
                    <Form.Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="rounded-2"
                    >
                        <option value="all">All</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                    </Form.Select>
                </Col>

                <Col md={3} sm={6}>
                    <Form.Label className="fw-semibold text-muted">Date From</Form.Label>
                    <Form.Control
                        type="date"
                        onChange={(e) => setStartDate(e.target.value)}
                        className="rounded-2"
                    />
                </Col>

                <Col md={3} sm={6}>
                    <Form.Label className="fw-semibold text-muted">Date To</Form.Label>
                    <Form.Control
                        type="date"
                        onChange={(e) => setEndDate(e.target.value)}
                        className="rounded-2"
                    />
                </Col>

                <Col md={2} sm={6}>
                    <Form.Label className="fw-semibold text-muted">Min Amount</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="e.g. 100"
                        onChange={(e) => setMinAmount(e.target.value)}
                        className="rounded-2"
                    />
                </Col>

                <Col md={2} className="d-flex align-items-end justify-content-start gap-2">
                    <Button onClick={exportPDF} variant="danger" className="rounded-2 d-flex align-items-center gap-1 px-3">
                        <FaFilePdf /> PDF
                    </Button>
                    <CSVLink
                        data={filteredSavings.map(s => ({
                            Member: s.member?.name,
                            Amount: s.amount,
                            Method: s.method,
                            Date: moment(s.date).format('LLL'),
                            Status: s.status
                        }))}
                        filename="savings.csv"
                        className="btn btn-outline-primary rounded-2 d-flex align-items-center gap-1 px-3"
                    >
                        <FaFileCsv /> CSV
                    </CSVLink>
                </Col>
            </Row>

            <Card className="mb-4 px-4 py-3 border-0 shadow-sm bg-light">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 fw-semibold text-dark">Add Manual Saving Entry</h5>
                    {!showForm && (
                        <Button
                            variant="success"
                            className="px-4 py-2 fw-medium border-0"
                            onClick={() => setShowForm(true)}
                            style={{ boxShadow: 'none' }}
                        >
                            + Add
                        </Button>
                    )}
                </div>

                {showForm && (
                    <Form onSubmit={handleManualSubmit}>
                        <Row className="g-3">
                            <Col md={2}>
                                <Form.Control
                                    placeholder="Member ID"
                                    value={manualForm.member}
                                    required
                                    onChange={e => setManualForm({ ...manualForm, member: e.target.value })}
                                    className="rounded-1 border"
                                />
                            </Col>
                            <Col md={2}>
                                <Form.Control
                                    type="number"
                                    placeholder="Amount"
                                    value={manualForm.amount}
                                    required
                                    onChange={e => setManualForm({ ...manualForm, amount: e.target.value })}
                                    className="rounded-1 border"
                                />
                            </Col>
                            <Col md={2}>
                                <Form.Control
                                    placeholder="Method"
                                    value={manualForm.method}
                                    required
                                    onChange={e => setManualForm({ ...manualForm, method: e.target.value })}
                                    className="rounded-1 border"
                                />
                            </Col>
                            <Col md={2}>
                                <Form.Control
                                    type="file"
                                    onChange={e => setManualForm({ ...manualForm, receipt: e.target.files[0] })}
                                    className="rounded-1 border"
                                />
                            </Col>
                            <Col md={2}>
                                <Form.Control
                                    placeholder="Note"
                                    value={manualForm.note}
                                    onChange={e => setManualForm({ ...manualForm, note: e.target.value })}
                                    className="rounded-1 border"
                                />
                            </Col>
                            <Col md={2} className="d-flex gap-2">
                                <Button
                                    type="submit"
                                    variant="success"
                                    className="w-100 rounded-1 border-0"
                                    style={{ boxShadow: 'none' }}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowForm(false)}
                                    className="w-100 rounded-1"
                                    style={{ boxShadow: 'none' }}
                                >
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Card>


            {loading ? (<div className="text-center my-5"><Spinner animation="border" variant="primary" /></div>) : (
                <div className="table-responsive">
                    <Table striped bordered hover className="shadow-sm">
                        <thead className="table-light text-center">
                            <tr><th>#</th><th>Member</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th><th>Receipt</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filteredSavings.map((saving, index) => (
                                <tr key={saving._id}>
                                    <td>{index + 1}</td>
                                    <td>{saving.member?.name}</td>
                                    <td>{saving.amount} ETB</td>
                                    <td>{saving.method}</td>
                                    <td>{moment(saving.date).format('LLL')}</td>
                                    <td>{statusBadge(saving.status)}</td>
                                    <td>{saving.receipt && <a href={saving.receipt} target="_blank" rel="noreferrer">View</a>}</td>
                                    <td>
                                        {saving.status === 'pending' && (<><Button variant="success" size="sm" onClick={() => handleAction(saving, 'approve')}>Approve</Button>{' '}<Button variant="danger" size="sm" onClick={() => handleAction(saving, 'reject')}>Reject</Button></>)}
                                        {saving.adminNotes?.length > 0 && (<Button variant="info" size="sm" onClick={() => handleAction(saving, '')}>Notes</Button>)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{actionType === '' ? 'Admin Notes' : `${actionType === 'approve' ? 'Approve' : 'Reject'} Saving`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {actionType === '' ? (
                        selectedSaving?.adminNotes?.length > 0 ? (
                            <ul className="ps-3">
                                {selectedSaving.adminNotes.map((note, idx) => (<li key={idx}><strong>{moment(note.date).format('LLL')}:</strong> {note.note}</li>))}
                            </ul>
                        ) : <p>No notes available.</p>
                    ) : (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Note</Form.Label>
                                <Form.Control as="textarea" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={`Enter a note for this ${actionType}`} />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                {actionType && (
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant={actionType === 'approve' ? 'success' : 'danger'} onClick={submitAction}>Confirm {actionType}</Button>
                    </Modal.Footer>
                )}
            </Modal>
        </Container>
    );
};

export default AdminSavingsPage;