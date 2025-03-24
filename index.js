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
const { register, login, /*getRestrictedUsers,*/ validateUserPIN, validateAdminPIN, getUsers } = require('./controllers/authController');
const {getAllRestrictedUsers, createRestrictedUser, updateRestrictedUser, deleteRestrictedUser} = require("./controllers/restrictedUserController");

app.get("/api/restricted-users", getAllRestrictedUsers);
app.post("/api/restricted-users", createRestrictedUser);
app.put("/api/restricted-users/:id", updateRestrictedUser);
app.delete("/api/restricted-users/:id", deleteRestrictedUser);

app.post('/api/register', register);
app.post('/api/login', login);
/*app.get('/api/users', getRestrictedUsers);*/
app.post('/api/validate-pin', validateUserPIN);
app.post('/api/validate-admin-pin', validateAdminPIN);
app.get('/api/users', getUsers);

app.post("/api/videos", videoPost);
app.get("/api/videos", videoGetAll);
app.get("/api/videos/:id", videoGetById);
app.put("/api/videos/:id", videoUpdate);
app.delete("/api/videos/:id", videoDelete);

// Start server
app.listen(3000, () => console.log(`Server running on port 3000!`));
