const express = require('express');
const app = express();
const mongoose = require("mongoose");

// Correct MongoDB connection string
const MONGO_URI = "mongodb+srv://irella:12345@cluster0.lrdhi.mongodb.net/?tls=true";

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


// Import controlers
const { videoPost, videoGetAll, videoGetById, videoUpdate, videoDelete } = require("./controllers/videosControlles");
const { register, login } = require('./controllers/authController');

app.post('/api/register', register);
app.post('/api/login', login);

app.post("/api/videos", videoPost);
app.get("/api/videos", videoGetAll);
app.get("/api/videos/:id", videoGetById);
app.put("/api/videos/:id", videoUpdate);
app.delete("/api/videos/:id", videoDelete);

// Start server
app.listen(3000, () => console.log(`Server running on port 3000!`));
