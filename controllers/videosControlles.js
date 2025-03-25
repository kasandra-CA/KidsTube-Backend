const Video = require("../models/videosModel");

const videoPost = async (req, res) => {
    try {
        const { name, url, description } = req.body;

        if (!name || !url) {
            return res.status(400).json({ error: "Nombre y URL son obligatorios" });
        }

        const video = new Video({ name, url, description });
        await video.save();
        res.status(201).json({ message: "✅ Video agregado con éxito", video });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const videoGetAll = async (req, res) => {
    try {
        const videos = await Video.find();
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const videoGetById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ error: "Video no encontrado" });
        }
        res.status(200).json(video);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const videoUpdate = async (req, res) => {
    try {
        const updatedVideo = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "✅ Video actualizado", updatedVideo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const videoDelete = async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "✅ Video eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    videoPost,
    videoGetAll,
    videoGetById,
    videoUpdate,
    videoDelete
};