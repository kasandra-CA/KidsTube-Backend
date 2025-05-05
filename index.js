const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// 🔗 Conexión a MongoDB
const MONGO_URI = "mongodb+srv://kca11tita:7OMjztVsmZUUKqov@cluster0.lr72j.mongodb.net/todo-api?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB successfully!"))
  .catch(err => console.log("❌ MongoDB connection error:", err));

// 🌍 CORS
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  methods: "*"
}));

// 🧠 Middleware para JSON
app.use(express.json());

// 📁 Servir archivos estáticos
app.use(express.static(path.join(__dirname, "../KidsTube-Frontend")));

// ✅ Middleware de autenticación
const verifyToken = require("./middleware/verifytoken");

// 🔌 Controladores
const {
  videoPost,
  videoGetAll,
  videoGetById,
  videoUpdate,
  videoDelete
} = require("./controllers/videosControlles");

console.log("🎥 videoGetAll definido:", typeof videoGetAll); // 👈 agrega esto

const authController = require("./controllers/authController");
const restrictedUserController = require("./controllers/restrictedUserController");
const playlistController = require("./controllers/playlistController");

// 🛠 DEBUG
console.log("📦 Exportaciones de playlistController:", Object.keys(playlistController));

// 📌 Rutas de autenticación
app.post("/api/register", authController.register);
app.post("/api/login", authController.login);
app.get("/api/verify/:token", authController.verifyEmail);
app.post("/api/verify-sms", authController.verifySMSCode);
app.post("/api/validate-pin", authController.validateUserPIN);
app.post("/api/validate-admin-pin", authController.validateAdminPIN);
app.get("/api/users", authController.getUsers);
app.post("/api/google-login", authController.googleLogin);
app.post("/api/complete-profile", verifyToken, authController.completeProfile);


// 📌 Rutas de usuarios restringidos
app.get("/api/restricted-users", verifyToken, restrictedUserController.getAllRestrictedUsers);
app.post("/api/restricted-users", verifyToken, restrictedUserController.createRestrictedUser);
app.put("/api/restricted-users/:id", verifyToken, restrictedUserController.updateRestrictedUser);
app.delete("/api/restricted-users/:id", verifyToken, restrictedUserController.deleteRestrictedUser);
app.post("/api/validate-restricted-pin", restrictedUserController.validateRestrictedUserPIN);

// 📌 Rutas de videos
app.get("/api/videos", verifyToken, videoGetAll);
app.post("/api/videos", verifyToken, videoPost);
app.put("/api/videos/:id", verifyToken, videoUpdate);
app.delete("/api/videos/:id", verifyToken, videoDelete);

// 📌 Rutas de playlists
app.get("/api/playlists", verifyToken, playlistController.getPlaylists);
app.post("/api/playlists", verifyToken, playlistController.createPlaylist);
app.put("/api/playlists/:id", verifyToken, playlistController.updatePlaylist);
app.delete("/api/playlists/:id", verifyToken, playlistController.deletePlaylist);
app.post("/api/playlists/add-videos", verifyToken, playlistController.addVideosToPlaylist);

// 🚀 Servidor
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
