// src/routes/trainingRoutes.js

const express = require("express");
const { addTrainingData } = require("../controllers/trainingController");
const { addTrainData } = require("../controllers/tainController");

const router = express.Router();

// Define the route for adding training data
// This route expects a POST request to '/api/train-bot'
// and will be handled by the 'addTrainingData' function.
router.post("/train-bot", addTrainingData);
router.post("/train", addTrainData);

module.exports = router;
