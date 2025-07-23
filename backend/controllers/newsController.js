import News from '../models/News.js';

export const createNews = async (req, res) => {
    console.log('REQ.BODY:', req.body);
    console.log('REQ.FILE:', req.file);

    try {
        const { title, content } = req.body;
        const image = req.file ? req.file.path : '';

        const news = await News.create({ title, content, image });
        res.status(201).json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getNews = async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
