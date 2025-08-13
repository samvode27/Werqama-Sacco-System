import News from '../models/News.js';
import fs from 'fs';
import path from 'path';

export const createNews = async (req, res) => {
    console.log('REQ.BODY:', req.body);
    console.log('REQ.FILE:', req.file);

    try {
        const { title, content } = req.body;
        const imagePath = req.file?.path?.replace(/\\/g, '/');

        const news = new News({
            title,
            content,
            image: imagePath,
        });

        await news.save();

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

const deleteImage = (imagePath) => {
    if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
};

// controllers/newsController.js
export const updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });

    news.title = req.body.title || news.title;
    news.content = req.body.content || news.content;

    if (req.file) {
      // handle image replacement
      news.image = req.file.path;
    }

    const updatedNews = await news.save();
    res.json(updatedNews);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) return res.status(404).json({ message: 'News not found' });

        // Delete image from disk
        deleteImage(news.image);

        await news.deleteOne();
        res.json({ message: 'News deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
