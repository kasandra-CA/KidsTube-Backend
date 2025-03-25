const Playlist = require("../models/playlistModel");

const getPlaylists = async (req, res) => {
    try {
        const { owner } = req.query;
        const filter = owner ? { owner } : {};
        const playlists = await Playlist.find(filter)
            .populate("profiles", "name avatar")
            .populate("videos");
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createPlaylist = async (req, res) => {
    try {
        const { name, profiles, owner, videos } = req.body;

        if (!name || !owner || !Array.isArray(profiles) || !Array.isArray(videos)) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        const newPlaylist = new Playlist({ name, profiles, owner, videos });
        await newPlaylist.save();
        res.status(201).json({ message: "Playlist creada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, profiles, videos } = req.body;

        await Playlist.findByIdAndUpdate(id, { name, profiles, videos });
        res.json({ message: "Playlist actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deletePlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        await Playlist.findByIdAndDelete(id);
        res.json({ message: "Playlist eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addVideosToPlaylist = async (req, res) => {
    try {
        const { playlistId, videoIds } = req.body;

        if (!playlistId || !Array.isArray(videoIds)) {
            return res.status(400).json({ error: "Datos inválidos" });
        }

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) return res.status(404).json({ error: "Playlist no encontrada" });

        const uniqueVideos = [...new Set([...playlist.videos, ...videoIds])];
        playlist.videos = uniqueVideos;

        await playlist.save();
        res.json({ message: "Videos agregados correctamente", playlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getPlaylists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addVideosToPlaylist
};