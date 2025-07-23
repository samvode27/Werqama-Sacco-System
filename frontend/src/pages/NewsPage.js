import React, { useEffect, useState } from 'react';
import NavigationBar from '../components/Navbar';
import api from '../api/axios';
import { Container, Card, Row, Col } from 'react-bootstrap';

const NewsPage = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            const res = await api.get('/news');
            setNews(res.data);
        };
        fetchNews();
    }, []);

    return (
        <>
            <NavigationBar />
            <Container className="mt-4">
                <h2>News</h2>
                <Row>
                    {news.map((item) => (
                        <Col key={item._id} sm={12} md={6} lg={4} className="mb-3">
                            <Card>
                                {item.image && (
                                    <Card.Img
                                        variant="top"
                                        src={`http://localhost:5000/${item.image}`}
                                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <Card.Body>
                                    <Card.Title>{item.title}</Card.Title>
                                    <Card.Text>{item.content}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default NewsPage;
