const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "RestrictedUser" }],
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Playlist", playlistSchema);