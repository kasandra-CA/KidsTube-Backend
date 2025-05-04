const Playlist = require("../models/playlistModel");

const getPlaylists = async (req, res) => {
  try {
    const { restrictedUser } = req.query;

    const query = restrictedUser ? { restrictedUser } : { owner: req.userId };

    const playlists = await Playlist.find(query)
      .populate("restrictedUser", "name")
      .populate("videos"); // ✅ Asegura que lleguen los datos del video al frontend

    res.json(playlists);
  } catch (error) {
    console.error("❌ Error al obtener playlists:", error);
    res.status(500).json({ error: "Error al obtener las playlists" });
  }
};

const createPlaylist = async (req, res) => {
  try {
    const { name, restrictedUser } = req.body;
    const ownerId = req.userId;

    if (!name || !restrictedUser) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const newPlaylist = new Playlist({
      name,
      owner: ownerId,
      restrictedUser
    });

    await newPlaylist.save();
    res.status(201).json({ message: "Playlist creada", playlist: newPlaylist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, restrictedUser } = req.body;

    if (!name || !restrictedUser) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const updated = await Playlist.findByIdAndUpdate(
      id,
      { name, restrictedUser },
      { new: true }
    );

    res.json({ message: "Playlist actualizada", playlist: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    await Playlist.findByIdAndDelete(id);
    res.json({ message: "Playlist eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addVideosToPlaylist = async (req, res) => {
  try {
    const { playlistId, videoIds } = req.body;
    if (!playlistId || !videoIds || !Array.isArray(videoIds)) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const playlist = await Playlist.findById(playlistId);
    playlist.videos.push(...videoIds);
    await playlist.save();

    res.json({ message: "Videos agregados a la playlist", playlist });
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