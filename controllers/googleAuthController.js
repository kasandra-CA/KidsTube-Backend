// controllers/googleAuthController.js
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/authModel");

const client = new OAuth2Client("GOOGLE KEY");

const generateToken = (user) => jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });

const googleLogin = async (req, res) => {
    const { idToken } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: "535454289640-ruei9sos6g72cpcf8d6e3r710qq3b0gu.apps.googleusercontent.com"
        });
        const payload = ticket.getPayload();
        const { email, name, sub } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                firstName: name,
                googleId: sub,
                isGoogleAccount: true,  // Nuevo usuario solo con datos esenciales
                status: "pending"
            });
            await user.save();
            const token = generateToken(user);
            return res.status(200).json({ token, userId: user._id, name: user.firstName, needExtraData: true });
        } else if (!user.googleId) {
            return res.status(409).json({ error: "Este correo ya está registrado con otro método." });
        }

        const token = generateToken(user);
        res.status(200).json({ token, userId: user._id, name: user.firstName, needExtraData: false });

    } catch (err) {
        console.error("❌ Error verificando Google Token:", err);
        res.status(401).json({ error: "Token inválido o expirado" });
    }
};

const completeProfile = async (req, res) => {
    const userId = req.user.id;
    const { lastName, phone, pin, birthdate, country } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  
      // Completar los campos obligatorios
      user.lastName = lastName;
      user.phone = phone;
      user.pin = pin;
      user.birthdate = birthdate;
      user.country = country;
      user.status = "active";

      await user.save();
      res.json({ message: "Perfil completado con éxito" });
    } catch (err) {
      res.status(500).json({ error: "Error actualizando perfil" });
    }
  };  


module.exports = { googleLogin, completeProfile };
