const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http"); // Import http module for Socket.IO
const connectDB = require("./src/config/db");
const trainingRoutes = require("./src/routes/trainingRoutes");
const conversationRoute = require("./src/routes/conversationRoute");
const medicalDocumentRoute = require("./src/routes/medicalDocumentRoute");

// Import new live chat routes
const fs = require("fs");
const path = require("path");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app); // Create HTTP server from Express app

// Middleware to enable CORS for all origins
app.use(cors());
app.use(express.json({ limit: "20mb" })); // allow large audio

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure the 'uploads' directory exists for Multer
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Define API routes
app.use("/api", conversationRoute);
app.use("/api", medicalDocumentRoute);
// app.use("/api/data", dataRouter);

// Basic route for home
app.get("/", (req, res) => {
  res.send("Rag Backend API is running...");
});

const PORT = process.env.PORT || 8000;

// Start the server (using http server, not just express app)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
