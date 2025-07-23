import React, { useEffect, useState } from 'react';
import NavigationBar from '../components/Navbar';
import api from '../api/axios';
import { Container, Card, Row, Col } from 'react-bootstrap';

const ServicesPage = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            const res = await api.get('/services');
            setServices(res.data);
        };
        fetchServices();
    }, []);

    return (
        <>
            <NavigationBar />
            <Container className="mt-4">
                <h2>Services</h2>
                <Row>
                    {services.map((item) => (
                        <Col key={item._id} sm={12} md={6} lg={4} className="mb-3">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{item.title}</Card.Title>
                                    <Card.Text>{item.description}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default ServicesPage;
