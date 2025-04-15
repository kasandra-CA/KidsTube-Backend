const Video = require("../models/videosModel");

// Crear video asociado a un usuario
const videoPost = async (req, res) => {
    try {
        const { name, url, description, owner } = req.body;

        if (!name || !url || !owner) {
            return res.status(400).json({ error: "Nombre, URL y owner son obligatorios" });
        }

        const video = new Video({ name, url, description, owner });
        await video.save();
        res.status(201).json({ message: "✅ Video agregado con éxito", video });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener solo los videos del usuario logueado
const videoGetAll = async (req, res) => {
    try {
        const { owner } = req.query;
        if (!owner) return res.status(400).json({ error: "Falta el parámetro owner" });

        const videos = await Video.find({ owner });
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