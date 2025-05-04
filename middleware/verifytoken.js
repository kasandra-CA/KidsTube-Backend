// middleware/verifyToken.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Acceso denegado. Token requerido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secretKey");
    req.user = { id: decoded.id };         // 👈 acceso a req.user.id
    req.userId = decoded.id;               // ✅ acceso directo a req.userId (para controladores)
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido o expirado." });
  }
};

module.exports = verifyToken;