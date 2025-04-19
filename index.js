const express = require('express');
const app = express();
const mongoose = require("mongoose");


// Correct MongoDB connection string
const MONGO_URI = "mongodb+srv://kca11tita:7OMjztVsmZUUKqov@cluster0.lr72j.mongodb.net/todo-api?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB successfully!"))
    .catch(err => console.log("MongoDB connection error:", err));

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// CORS configuration
const cors = require("cors");
app.use(cors({
    origin: "*",
    methods: "*"
}));


// Import controllers
const { videoPost, videoGetAll, videoGetById, videoUpdate, videoDelete } = require("./controllers/videosControlles");
const { register, login, validateUserPIN, validateAdminPIN, getUsers } = require('./controllers/authController');
const { getAllRestrictedUsers, createRestrictedUser, updateRestrictedUser, deleteRestrictedUser, validateRestrictedUserPIN } = require("./controllers/restrictedUserController");
const { getPlaylists, createPlaylist, updatePlaylist, deletePlaylist, addVideosToPlaylist } = require("./controllers/playlistController");
const verifyToken = require("./middleware/verifytoken");
const { verifyEmail } = require('./controllers/authController');

const path = require("path");
app.use(express.static(path.join(__dirname, "../KidsTube-Frontend")));

app.get('/api/verify/:token', verifyEmail);

app.get("/api/videos", verifyToken, videoGetAll);
app.post("/api/videos", verifyToken, videoPost);
app.put("/api/videos/:id", verifyToken, videoUpdate);
app.delete("/api/videos/:id", verifyToken, videoDelete);

app.get("/api/playlists", verifyToken, getPlaylists);
app.post("/api/playlists", verifyToken, createPlaylist);
app.put("/api/playlists/:id", verifyToken, updatePlaylist);
app.delete("/api/playlists/:id", verifyToken, deletePlaylist);
app.post("/api/playlists/add-videos", verifyToken, addVideosToPlaylist);

app.get("/api/restricted-users", verifyToken, getAllRestrictedUsers);
app.post("/api/restricted-users", verifyToken, createRestrictedUser);
app.put("/api/restricted-users/:id", verifyToken, updateRestrictedUser);
app.delete("/api/restricted-users/:id", verifyToken, deleteRestrictedUser);
app.post("/api/validate-restricted-pin", validateRestrictedUserPIN);


app.post('/api/register', register);
app.post('/api/login', login);
app.post('/api/validate-pin', validateUserPIN);
app.post('/api/validate-admin-pin', validateAdminPIN);
app.get('/api/users', getUsers);


// Start server
app.listen(3000, () => console.log(`Server running on port 3000!`));
