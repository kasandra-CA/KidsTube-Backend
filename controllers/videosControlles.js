const Video = require('../models/videosModel');

// 🔁 Convertir URL a embed
function convertToEmbedUrl(originalUrl) {
  try {
    const urlObj = new URL(originalUrl);
    let videoId = new URLSearchParams(urlObj.search).get("v");
    if (!videoId && urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.split("/")[1];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch (e) {
    return null;
  }
}

// 📌 Crear video
const videoPost = async (req, res) => {
  try {
    const { name, url, description, owner } = req.body;
    if (!name || !url || !owner) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    const embedUrl = convertToEmbedUrl(url);
    if (!embedUrl) {
      return res.status(400).json({ error: "URL no válida para incrustar." });
    }

    const video = new Video({
      name,
      url: embedUrl,
      description,
      owner
    });

    await video.save();
    res.status(201).json({ message: "✅ Video creado correctamente", video });
  } catch (error) {
    console.error("❌ Error al crear video:", error);
    res.status(500).json({ error: "Error al crear el video" });
  }
};

// 📥 Obtener videos
const videoGetAll = async (req, res) => {
  try {
    const { owner } = req.query;
    const filter = owner ? { owner } : {};
    const videos = await Video.find(filter);
    res.json(videos);
  } catch (error) {
    console.error("❌ Error al obtener videos:", error);
    res.status(500).json({ error: "Error al obtener los videos" });
  }
};

// ✏️ Actualizar video
const videoUpdate = async (req, res) => {
  try {
    const { name, url, description } = req.body;

    const embedUrl = convertToEmbedUrl(url);
    if (!embedUrl) {
      return res.status(400).json({ error: "URL no válida para incrustar." });
    }

    const updated = await Video.findByIdAndUpdate(
      req.params.id,
      { name, url: embedUrl, description },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Video no encontrado" });
    }

    res.json({ message: "Video actualizado", video: updated });
  } catch (error) {
    console.error("❌ Error al actualizar video:", error);
    res.status(500).json({ error: "Error al actualizar el video" });
  }
};

// 🗑️ Eliminar video
const videoDelete = async (req, res) => {
  try {
    const deleted = await Video.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Video no encontrado" });
    }
    res.json({ message: "Video eliminado" });
  } catch (error) {
    console.error("❌ Error al eliminar video:", error);
    res.status(500).json({ error: "Error al eliminar el video" });
  }
};

// ✅ Exportar todo lo necesario para index.js
module.exports = {
  videoPost,
  videoGetAll,
  videoUpdate,
  videoDelete
};
