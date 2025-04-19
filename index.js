const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Conexión a MongoDB Atlas
const MONGO_URI = "mongodb+srv://kca11tita:7OMjztVsmZUUKqov@cluster0.lr72j.mongodb.net/todo-api?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB successfully!"))
  .catch(err => console.log("❌ MongoDB connection error:", err));

// CORS (solo una vez)
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: "*"
}));

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, "../KidsTube-Frontend")));

// Importar controladores
const { videoPost, videoGetAll, videoGetById, videoUpdate, videoDelete } = require("./controllers/videosControlles");
const { register, login, validateUserPIN, validateAdminPIN, getUsers, verifyEmail, verifySMSCode } = require("./controllers/authController");
const { getAllRestrictedUsers, createRestrictedUser, updateRestrictedUser, deleteRestrictedUser, validateRestrictedUserPIN } = require("./controllers/restrictedUserController");
const { getPlaylists, createPlaylist, updatePlaylist, deletePlaylist, addVideosToPlaylist } = require("./controllers/playlistController");

const verifyToken = require("./middleware/verifytoken");

// Rutas de autenticación
app.post('/api/register', register);
app.post('/api/login', login);
app.get('/api/verify/:token', verifyEmail);
app.post('/api/verify-sms', verifySMSCode);
app.post('/api/validate-pin', validateUserPIN);
app.post('/api/validate-admin-pin', validateAdminPIN);
app.get('/api/users', getUsers);

// Rutas de usuarios restringidos
app.get("/api/restricted-users", verifyToken, getAllRestrictedUsers);
app.post("/api/restricted-users", verifyToken, createRestrictedUser);
app.put("/api/restricted-users/:id", verifyToken, updateRestrictedUser);
app.delete("/api/restricted-users/:id", verifyToken, deleteRestrictedUser);
app.post("/api/validate-restricted-pin", validateRestrictedUserPIN);

// Rutas de videos
app.get("/api/videos", verifyToken, videoGetAll);
app.post("/api/videos", verifyToken, videoPost);
app.put("/api/videos/:id", verifyToken, videoUpdate);
app.delete("/api/videos/:id", verifyToken, videoDelete);

// Rutas de playlists
app.get("/api/playlists", verifyToken, getPlaylists);
app.post("/api/playlists", verifyToken, createPlaylist);
app.put("/api/playlists/:id", verifyToken, updatePlaylist);
app.delete("/api/playlists/:id", verifyToken, deletePlaylist);
app.post("/api/playlists/add-videos", verifyToken, addVideosToPlaylist);

// Iniciar servidor
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));