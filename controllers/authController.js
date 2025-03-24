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
        res.json({ message: 'Login exitoso', token, user }); // ⬅️ Incluye el usuario
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("firstName lastName email pin");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener usuarios restringidos asociados a la cuenta principal
/*const getRestrictedUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "restricted" }).select("firstName lastName email pin");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};*/

// Validar PIN de usuario restringido
const validateUserPIN = async (req, res) => {
    try {
        const { userId, pin } = req.body;
        const user = await User.findById(userId);

        if (!user || user.pin !== pin) {
            return res.status(401).json({ error: "PIN incorrecto" });
        }

        res.json({ message: "✅ Acceso permitido", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Validar PIN del administrador
const validateAdminPIN = async (req, res) => {
    try {
        const { pin } = req.body;

        const admin = await User.findOne({ pin }); // Busca por PIN exacto

        if (!admin) {
            return res.status(401).json({ error: "PIN incorrecto" });
        }

        res.json({ message: "✅ Acceso a administración permitido" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login, getUsers, /*getRestrictedUsers,*/ validateUserPIN, validateAdminPIN };