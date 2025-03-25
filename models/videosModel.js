const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model('Video', videoSchema);