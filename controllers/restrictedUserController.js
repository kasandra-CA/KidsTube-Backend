const RestrictedUser = require("../models/restrictedUserModel");

// Obtener todos los usuarios restringidos
const getAllRestrictedUsers = async (req, res) => {
    try {
        const users = await RestrictedUser.find().select("name pin avatar");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear usuario restringido
const createRestrictedUser = async (req, res) => {
    try {
        const { name, pin, avatar } = req.body;

        if (!name || !pin || pin.length !== 6 || !avatar) {
            return res.status(400).json({ error: "Todos los campos son obligatorios y el PIN debe tener 6 dígitos." });
        }

        const newUser = new RestrictedUser({ name, pin, avatar });
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

module.exports = {
    getAllRestrictedUsers,
    createRestrictedUser,
    updateRestrictedUser,
    deleteRestrictedUser
};
