// middleware/verifyToken.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Acceso denegado. Token requerido." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, "secretKey"); // 👈 usa la misma clave que en el login
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Token inválido o expirado." });
    }
};

module.exports = verifyToken;