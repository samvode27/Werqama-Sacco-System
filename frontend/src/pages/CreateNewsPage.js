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
        if (image) formData.append('image', image);

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
            <h2 className="mb-3">{editingNews ? '✏️ Edit News' : '📰 Create News'}</h2>

            <Form onSubmit={handleSubmit} encType="multipart/form-data" className="news-form mb-5">
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter news title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Write the news content..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Image (optional)</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                    {preview && <Image src={preview} className="preview-img mt-2" fluid />}
                </Form.Group>

                <div className="mt-3">
                    <Button type="submit" variant="primary">
                        {editingNews ? 'Update News' : 'Create News'}
                    </Button>
                    {editingNews && (
                        <Button variant="secondary" className="ms-2" onClick={resetForm}>
                            Cancel
                        </Button>
                    )}
                </div>
            </Form>

            <h3 className="mb-3">📚 All News</h3>
            
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Col>

                <Col md={6}>
                    <Form.Control
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                </Col>
            </Row>

            <Row>
                {filteredNews.map((n) => (
                    <Col key={n._id} md={4} className="mb-4">
                        <Card className="news-card h-100 shadow-sm">
                            {n.image && (
                                <Card.Img
                                    variant="top"
                                    src={`${process.env.REACT_APP_API_URL}/${n.image}`}
                                    className="news-card-img"
                                />
                            )}
                            <Card.Body>
                                <Card.Title>{n.title}</Card.Title>
                                <Card.Text>{n.content.slice(0, 100)}...</Card.Text>
                                <Button
                                    variant="info"
                                    size="sm"
                                    onClick={() => {
                                        setModalContent(n);
                                        setShowModal(true);
                                    }}
                                >
                                    View
                                </Button>{' '}
                                <Button variant="warning" size="sm" onClick={() => handleEdit(n)}>
                                    Edit
                                </Button>{' '}
                                <Button variant="danger" size="sm" onClick={() => handleDelete(n._id)}>
                                    Delete
                                </Button>
                            </Card.Body>
                            <Card.Footer className="text-muted small">
                                {new Date(n.createdAt).toLocaleDateString()}
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{modalContent?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{modalContent?.content}</p>
                    {modalContent?.image && (
                        <Image
                            src={`${process.env.REACT_APP_API_URL}/${modalContent.image}`}
                            alt="News"
                            fluid
                            className="mt-2"
                        />
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default CreateNewsPage;
