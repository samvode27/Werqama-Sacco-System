import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
    Button,
    Modal,
    Form,
    Card,
    Row,
    Col,
    Image,
    Container,
} from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/CreateNewsPage.css';

const CreateNewsPage = () => {
    const [newsList, setNewsList] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [editingNews, setEditingNews] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [search, setSearch] = useState('');
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const { data } = await api.get('/news');
            setNewsList(data);
        } catch (err) {
            toast.error('Failed to fetch news');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    const handleEdit = (news) => {
        setEditingNews(news);
        setTitle(news.title);
        setContent(news.content);
        setPreview(news.image ? `${process.env.REACT_APP_API_URL}/${news.image}` : null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this news?')) return;
        try {
            await api.delete(`/news/${id}`);
            toast.success('News deleted');
            fetchNews();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) formData.append('newsImage', image);

        try {
            if (editingNews) {
                await api.put(`/news/${editingNews._id}`, formData);
                toast.success('News updated');
            } else {
                await api.post('/news', formData);
                toast.success('News created');
            }
            resetForm();
            fetchNews();
        } catch (err) {
            toast.error('Submit failed');
        }
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setImage(null);
        setPreview(null);
        setEditingNews(null);
    };

    const filteredNews = newsList.filter((n) => {
        const titleMatch = n.title.toLowerCase().includes(search.toLowerCase());
        const dateMatch = filterDate
            ? new Date(n.createdAt).toISOString().slice(0, 10) === filterDate
            : true;
        return titleMatch && dateMatch;
    });

    return (
        <Container className="news-container mt-4">
            <ToastContainer />
            <h2 className="mb-4 text-center text-primary fw-bold">
                {editingNews ? '✏️ Edit News' : '📰 Create News'}
            </h2>

            {/* Create/Edit Form */}
            <Card className="p-4 shadow-sm mb-5 bg-white rounded-4 border-0">
                <Form onSubmit={handleSubmit} encType="multipart/form-data" className="news-form">
                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter news title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="shadow-sm"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">Image (optional)</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="newsImage"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="shadow-sm"
                                />
                                {preview && (
                                    <Image
                                        src={preview}
                                        className="preview-img mt-2 rounded-3 shadow-sm"
                                        fluid
                                    />
                                )}
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">Content</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Write the news content..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                    className="shadow-sm"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="mt-4 d-flex gap-2 flex-wrap">
                        <Button type="submit" variant="primary" className="fw-semibold px-4 py-2 shadow-sm">
                            {editingNews ? 'Update News' : 'Create News'}
                        </Button>
                        {editingNews && (
                            <Button
                                variant="secondary"
                                onClick={resetForm}
                                className="fw-semibold px-4 py-2 shadow-sm"
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </Form>
            </Card>

            {/* Filter */}
            <Row className="mb-3 g-3 align-items-center">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="shadow-sm"
                    />
                </Col>
                <Col md={6}>
                    <Form.Control
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="shadow-sm"
                    />
                </Col>
            </Row>

            {/* News Cards */}
            <Row className="g-4">
                {filteredNews.map((n) => (
                    <Col key={n._id} md={4} sm={6}>
                        <Card className="news-card h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-scale">
                            {n.image && (
                                <Card.Img
                                    variant="top"
                                    src={`${process.env.REACT_APP_API_URL}/${n.image}`}
                                    className="news-card-img"
                                />
                            )}
                            <Card.Body>
                                <Card.Title className="fw-bold">{n.title}</Card.Title>
                                <Card.Text className="text-muted">{n.content.slice(0, 120)}...</Card.Text>
                                <div className="d-flex gap-2 flex-wrap">
                                    <Button
                                        variant="info"
                                        size="sm"
                                        onClick={() => {
                                            setModalContent(n);
                                            setShowModal(true);
                                        }}
                                    >
                                        View
                                    </Button>
                                    <Button variant="warning" size="sm" onClick={() => handleEdit(n)}>
                                        Edit
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(n._id)}>
                                        Delete
                                    </Button>
                                </div>
                            </Card.Body>
                            <Card.Footer className="text-muted small d-flex justify-content-between">
                                <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                                <span className="fw-semibold text-secondary">{n.title.length} chars</span>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Modal for Viewing News */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
                centered
                className="news-view-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">{modalContent?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="lead">{modalContent?.content}</p>
                    {modalContent?.image && (
                        <Image
                            src={`${process.env.REACT_APP_API_URL}/${modalContent.image}`}
                            alt="News"
                            fluid
                            className="mt-3 rounded-4 shadow-sm"
                        />
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default CreateNewsPage;
