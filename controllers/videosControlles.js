const Video = require('../models/videosModel');

// 🔁 Convertir URL normal a formato embed
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

// 🚀 Crear un nuevo video
const createVideo = async (req, res) => {
  try {
    const { name, url, description, owner } = req.body;

    if (!name || !url || !owner) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    const embedUrl = convertToEmbedUrl(url);
    if (!embedUrl) {
      return res.status(400).json({ error: "La URL no es válida para incrustar." });
    }

    const video = new Video({
      name,
      url: embedUrl, // ✅ Guardar URL en formato embed
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

// 📥 Obtener todos los videos del usuario
const getAllVideos = async (req, res) => {
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

module.exports = {
  createVideo,
  getAllVideos
};
