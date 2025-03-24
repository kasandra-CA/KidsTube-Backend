const Playlist = require("../models/playlistModel");

// Obtener playlists por dueño
const getPlaylists = async (req, res) => {
    try {
        const { owner } = req.query;
        const playlists = await Playlist.find({ owner }).populate("profiles", "name avatar");
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear playlist
const createPlaylist = async (req, res) => {
    try {
        const { name, profiles, owner } = req.body;
        const newPlaylist = new Playlist({ name, profiles, owner });
        await newPlaylist.save();
        res.status(201).json({ message: "Playlist creada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Editar playlist
const updatePlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, profiles } = req.body;
        await Playlist.findByIdAndUpdate(id, { name, profiles });
        res.json({ message: "Playlist actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar playlist
const deletePlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        await Playlist.findByIdAndDelete(id);
        res.json({ message: "Playlist eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getPlaylists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist
};
