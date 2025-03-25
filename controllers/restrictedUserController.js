const RestrictedUser = require("../models/restrictedUserModel");

// Obtener todos los usuarios restringidos por usuario iniciado
const getAllRestrictedUsers = async (req, res) => {
    try {
        const ownerId = req.query.owner; // viene como ?owner=123
        const filter = ownerId ? { owner: ownerId } : {};

        const users = await RestrictedUser.find(filter).select("name pin avatar");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear usuario restringido
const createRestrictedUser = async (req, res) => {
    try {
        const { name, pin, avatar, owner } = req.body;

        if (!name || !pin || pin.length !== 6 || !avatar) {
            return res.status(400).json({ error: "Todos los campos son obligatorios y el PIN debe tener 6 dígitos." });
        }

        const newUser = new RestrictedUser({ name, pin, avatar, owner });
        await newUser.save();
        res.status(201).json({ message: "Usuario restringido creado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar usuario restringido
const updateRestrictedUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, pin, avatar } = req.body;

        if (!name || !pin || pin.length !== 6 || !avatar) {
            return res.status(400).json({ error: "Todos los campos son obligatorios y el PIN debe tener 6 dígitos." });
        }

        await RestrictedUser.findByIdAndUpdate(id, { name, pin, avatar });
        res.json({ message: "Usuario restringido actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar usuario restringido
const deleteRestrictedUser = async (req, res) => {
    try {
        const { id } = req.params;
        await RestrictedUser.findByIdAndDelete(id);
        res.json({ message: "Usuario restringido eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const validateRestrictedUserPIN = async (req, res) => {
    try {
        const { userId, pin } = req.body;
        const user = await RestrictedUser.findById(userId);

        if (!user || user.pin !== pin) {
            return res.status(401).json({ error: "PIN incorrecto" });
        }

        res.json({ message: "✅ Acceso permitido" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllRestrictedUsers,
    createRestrictedUser,
    updateRestrictedUser,
    deleteRestrictedUser,
    validateRestrictedUserPIN
};
