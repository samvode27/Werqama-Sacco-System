import Service from '../models/Service.js';

export const createService = async (req, res) => {
    try {
        const { title, description } = req.body;
        const service = await Service.create({ title, description });
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
