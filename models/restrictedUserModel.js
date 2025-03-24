const mongoose = require("mongoose");

const restrictedUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pin: { type: String, required: true },
    avatar: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // ⬅️ NUEVO
});

module.exports = mongoose.model("RestrictedUser", restrictedUserSchema);