import React, { useEffect, useState } from 'react';
import NavigationBar from '../components/Navbar';
import api from '../api/axios';
import { Container, Table } from 'react-bootstrap';
import '../styles/Dashboard.css';

const AdminSavingsPage = () => {
    const [savings, setSavings] = useState([]);

    useEffect(() => {
        const fetchSavings = async () => {
            try {
                const res = await api.get('/savings/all');
                setSavings(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSavings();
    }, []);

    return (
        <>
            <NavigationBar />
            <Container className="dashboard-container">
                <div className="hero">
                    <h1>All Members' Savings</h1>
                    <p>Review and track savings made by members for operational monitoring.</p>
                </div>
                {savings.length === 0 ? (
                    <p>No savings recorded yet.</p>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Member</th>
                                <th>Email</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {savings.map((saving, idx) => (
                                <tr key={saving._id}>
                                    <td>{idx + 1}</td>
                                    <td>{saving.member?.name}</td>
                                    <td>{saving.member?.email}</td>
                                    <td>{saving.amount} ETB</td>
                                    <td>{saving.method}</td>
                                    <td>{new Date(saving.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Container>
        </>
    );
};

export default AdminSavingsPage;
