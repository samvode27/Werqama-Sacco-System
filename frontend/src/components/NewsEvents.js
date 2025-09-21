// src/components/NewsEvents.js
import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Modal, Spinner } from 'react-bootstrap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/NewsEvents.css';
import api from '../api/axios';
import { LanguageContext } from '../contexts/LanguageContext';
import translations from '../translations';

function NewsEvents() {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const [showModal, setShowModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get('/news');
        setNewsItems(res.data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const openModal = (item) => {
    setSelectedNews(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedNews(null);
  };

  return (
    <section className="news-events-section" id="news-events">
      <Container>
        <div className="text-center mb-5" data-aos="fade-down">
          <h2 className="section-titlee">{t.newsTitle}</h2>
          <p className="section-subtitle">{t.newsSubtitle}</p>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : newsItems.length === 0 ? (
          <p className="text-center text-muted">{t.newsNoItems}</p>
        ) : (
          <Row className="g-4">
            {newsItems.map((item, idx) => (
              <Col key={item._id} xs={12} sm={6} lg={3} data-aos="zoom-in" data-aos-delay={idx * 150}>
                <Card className="news-card h-100" onClick={() => openModal(item)}>
                  <div className="news-card-img-wrapper">
                    {item.image && (
                      <Card.Img
                        src={`${process.env.REACT_APP_API_URL}/${item.image}`}
                        alt={item.title}
                        className="news-card-img"
                      />
                    )}
                    <div className="news-card-overlay"></div>
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <h5 className="fw-bold">{item.title}</h5>
                    <p className="text-muted small">{item.content?.substring(0, 60)}...</p>
                    <button className="mt-auto button">{t.newsReadMore}</button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Modal */}
        <Modal show={showModal} onHide={closeModal} centered size="lg" className="news-modal">
          {selectedNews && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>{selectedNews.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedNews.image && (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${selectedNews.image}`}
                    alt={selectedNews.title}
                    className="img-fluid rounded mb-3"
                  />
                )}
                <p>{selectedNews.content}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button className='aaa' onClick={closeModal}>
                  {t.newsClose}
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal>
      </Container>
    </section>
  );
}

export default NewsEvents;
