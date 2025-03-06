// authController.js - Controlador de autenticación
const User = require('../models/authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Registrar usuario
const register = async (req, res) => {
    try {
        const { email, password, phone, pin, firstName, lastName, country, birthdate } = req.body;
        
        // Validar edad
        const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
        if (age < 18) return res.status(400).json({ error: 'Debes ser mayor de 18 años' });
        
        // Verificar usuario existente
        if (await User.findOne({ email })) return res.status(400).json({ error: 'El correo ya está registrado' });
        
        const user = new User({ email, password, phone, pin, firstName, lastName, country, birthdate });
        await user.save();
        res.status(201).json({ message: 'Registro exitoso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login de usuario
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Usuario o contraseña inválida' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Usuario o contraseña inválida' });
        
        const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
        res.json({ message: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login };