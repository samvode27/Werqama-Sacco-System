// src/pages/SavingsPage.js
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Container, Form, Button, Table } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavigationBar from '../components/Navbar';
import '../styles/SavingsPage.css';
import { useLocation } from 'react-router-dom';

const SavingsPage = () => {
    const [amount, setAmount] = useState('');
    const [savings, setSavings] = useState([]);
    const location = useLocation();

    const fetchSavingsHistory = async () => {
        try {
            const res = await api.get('/savings/mine');
            setSavings(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSavingsHistory();
    }, []);

    useEffect(() => {
        console.log('Redirected back with:', location.search);
        const params = new URLSearchParams(location.search);
        const txRefParam = params.get('tx_ref');

        if (params.get('status') === 'success' && txRefParam) {
            toast.success('Payment completed successfully!');

            let retries = 0;
            const maxRetries = 6;

            const interval = setInterval(async () => {
                retries++;
                console.log('Polling for updated savings... Attempt', retries);

                try {
                    const res = await api.get('/savings/mine');
                    setSavings(res.data);

                    if (res.data.some(s => s.tx_ref === txRefParam)) {
                        console.log('New payment found, stopping polling.');
                        clearInterval(interval);
                        toast.success('Payment recorded and visible in history!');
                    } else if (retries >= maxRetries) {
                        console.log('Max polling attempts reached, stopping.');
                        clearInterval(interval);
                        toast.info('Payment may take more time to appear.');
                    }
                } catch (error) {
                    console.error('Error during polling:', error);
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

    return (
        <>
            <NavigationBar />
            <ToastContainer />
            <Container className="savings-container">
                <h2 className="mb-4">Monthly Savings Payment</h2>
                <Form className="mb-4">
                    <Form.Group className="mb-3">
                        <Form.Label>Enter Amount (ETB)</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter amount to save"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="success" onClick={handlePayWithChapa}>
                        Pay with Chapa
                    </Button>
                </Form>
                <h4>My Savings History</h4>
                {savings.length === 0 ? (
                    <p>No savings records yet.</p>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Amount (ETB)</th>
                                <th>Method</th>
                                <th>Reference</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {savings.map((saving, index) => (
                                <tr key={saving._id}>
                                    <td>{index + 1}</td>
                                    <td>{saving.amount}</td>
                                    <td>{saving.method}</td>
                                    <td>{saving.tx_ref}</td>
                                    <td>{new Date(saving.date).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Container>
        </>
    );
};

export default SavingsPage;
