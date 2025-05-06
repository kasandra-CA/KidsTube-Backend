// authModel.js - Modelo de usuario
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return !this.isGoogleAccount;
    }
  },
  phone: {
    type: String,
    required: function () {
      return !this.isGoogleAccount;
    }
  },
  pin: {
    type: String,
    minlength: 6,
    maxlength: 6,
    required: function () {
      return !this.isGoogleAccount;
    }
  },
  firstName: { type: String, required: true },
  lastName: {
    type: String,
    required: function () {
      return !this.isGoogleAccount;
    }
  },
  country: { type: String },
  birthdate: {
    type: Date,
    required: function () {
      return !this.isGoogleAccount;
    }
  },
  status: {
    type: String,
    enum: ["pending", "active"],
    default: "pending"
  },
  verificationToken: { type: String },
  googleId: { type: String },
  isGoogleAccount: { type: Boolean, default: false }
});

// 🔐 Hashear la contraseña antes de guardar si no es cuenta Google
userSchema.pre('save', async function (next) {
  if (!this.isGoogleAccount && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
