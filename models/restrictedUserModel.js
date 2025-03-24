const mongoose = require("mongoose");

const restrictedUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pin: { type: String, required: true },
    avatar: { type: String, required: true }
});

module.exports = mongoose.model("RestrictedUser", restrictedUserSchema);