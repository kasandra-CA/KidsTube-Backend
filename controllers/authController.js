// authController.js - Controlador de autenticación
const User = require('../models/authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require("uuid");
const { sendVerificationEmail } = require("../utils/mailer");
const { sendSMS } = require("../utils/smsSender");

const verificationCodes = {}; // Memoria temporal para códigos SMS

// Registro de usuario
const register = async (req, res) => {
    try {
        const { email, password, phone, pin, firstName, lastName, country, birthdate } = req.body;

        const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
        if (age < 18) return res.status(400).json({ error: 'Debes ser mayor de 18 años' });

        if (await User.findOne({ email })) return res.status(400).json({ error: 'El correo ya está registrado' });

        const verificationToken = uuidv4();

        const user = new User({
            email,
            password,
            phone,
            pin,
            firstName,
            lastName,
            country,
            birthdate,
            verificationToken,
            status: "pending"
        });

        await user.save();
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: "Registro exitoso. Revisa tu correo para verificar tu cuenta." });
    } catch (error) {
        console.error("❌ Error en registro:", error);
        res.status(500).json({ error: error.message });
    }
};

// Verificación por correo (token desde enlace)
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ verificationToken: token });

        if (!user) return res.status(400).send("Token inválido o expirado");

        user.status = "active";
        user.verificationToken = undefined;
        await user.save();

        res.status(200).send("Cuenta verificada"); // Redirige al login
    } catch (error) {
        console.error("❌ Error al verificar email:", error);
        res.status(500).send("Error al verificar el correo");
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Usuario o contraseña inválida" });
        }

        if (user.status !== "active") {
            return res.status(403).json({ error: "Tu cuenta aún no está verificada por correo." });
        }

        const code = Math.floor(100000 + Math.random() * 900000);
        verificationCodes[user._id] = code;

        console.log(`📲 Enviando código ${code} a ${user.phone}`);

        // Simulación de envío de SMS (puedes cambiar esto por sendSMS si lo usas en producción)
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (smsError) {
            console.error("❌ Error al enviar SMS:", smsError);
            return res.status(500).json({ error: "No se pudo enviar el código SMS." });
        }

        return res.status(200).json({
            message: "Código enviado por SMS",
            userId: user._id,
            user: { firstName: user.firstName }
        });
    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

// Verificar código SMS
const verifySMSCode = async (req, res) => {
    try {
        const { userId, code } = req.body;
        const expectedCode = verificationCodes[userId];

        if (!expectedCode || expectedCode != code) {
            return res.status(400).json({ error: "Código incorrecto o expirado" });
        }

        delete verificationCodes[userId];

        const token = jwt.sign({ id: userId }, 'secretKey', { expiresIn: '1h' });

        res.json({ message: "Autenticación completa", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener usuarios (opcional para panel admin)
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("firstName lastName email pin");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
        const admin = await User.findOne({ pin });

        if (!admin) {
            return res.status(401).json({ error: "PIN incorrecto" });
        }

        res.json({ message: "✅ Acceso a administración permitido" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    register,
    login,
    getUsers,
    validateUserPIN,
    validateAdminPIN,
    verifyEmail,
    verifySMSCode
};