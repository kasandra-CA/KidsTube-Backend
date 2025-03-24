// videosModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String },
  playlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', required: true } // 🔗 Relación con playlist
});

module.exports = mongoose.model('Video', videoSchema);
