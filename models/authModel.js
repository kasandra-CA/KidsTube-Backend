// authModel.js - Modelo de usuario
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    pin: { type: String, required: true, minlength: 6, maxlength: 6 },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String },
    birthdate: { type: Date, required: true },
    status: { type: String, enum: ["pending", "active"], default: "pending" },
    verificationToken: { type: String },

});

// Hash de contraseña antes de guardar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);