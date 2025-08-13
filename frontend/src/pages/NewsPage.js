// src/pages/NewsPage.js

import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
    Container,
    Card,
    Row,
    Col,
    Spinner,
    Modal,
    Button
} from 'react-bootstrap';
import '../styles/NewsPage.css';

const NewsPage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNews, setSelectedNews] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await api.get('/news');
                setNews(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    const handleCardClick = (item) => {
        setSelectedNews(item);
    };

    const handleCloseModal = () => {
        setSelectedNews(null);
    };

    return (
        <Container className="news-container mt-4">
            <h2 className="news-title text-center mb-4">📢 Latest SACCO News</h2>

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : news.length === 0 ? (
                <p className="text-center text-muted">No news available currently.</p>
            ) : (
                <Row className="g-4">
                    {news.map((item) => (
                        <Col key={item._id} xs={12} sm={6} md={4}>
                            <Card className="news-card h-100" onClick={() => handleCardClick(item)}>
                                {item.image && (
                                    <Card.Img
                                        variant="top"
                                        src={`${process.env.REACT_APP_API_URL}/${item.image}`}
                                        className="news-image"
                                    />
                                )}
                                <Card.Body>
                                    <Card.Title className="news-card-title">{item.title}</Card.Title>
                                    <Card.Text className="news-snippet">
                                        {item.content.length > 100
                                            ? `${item.content.substring(0, 100)}...`
                                            : item.content}
                                        <span className="read-more"> Read More</span>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* News Modal */}
            <Modal show={!!selectedNews} onHide={handleCloseModal} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedNews?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedNews?.image && (
                        <img
                            src={`${process.env.REACT_APP_API_URL}/${selectedNews.image}`}
                            alt="News"
                            className="img-fluid rounded mb-3"
                        />
                    )}
                    <p>{selectedNews?.content}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default NewsPage;
