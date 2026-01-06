// src/controllers/trainingController.js

const TrainData = require("../models/TrainData");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// @desc    Add new training data (question and answer)
// @route   POST /api/train-bot
// @access  Privileged Access
const addTrainData = async (req, res) => {
  const { question, answer } = req.body; // Extract question and answer from the request body

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

  // Check if both question and answer are provided
  if (!question || !answer) {
    return res
      .status(400)
      .json({ message: "Please enter both question and answer." });
  }

  try {
    const emRes = await embeddingModel.embedContent({
      content: { parts: [{ text: question }] },
      taskType: "retrieval_document",
    });

    const embedding = emRes.embedding.values;

    // Create a new TrainingData document
    const trainingData = new TrainData({
      question,
      answer,
      embedding,
    });

    console.log("Adding training data", trainingData);

    // Save the new training data to the database
    const createdTrainingData = await trainingData.save();
    res.status(201).json(createdTrainingData);
  } catch (error) {
    // Handle duplicate question error
    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "This question already exists in training data. Please use a unique question.",
      });
    }
    // Handle other server errors
    console.error("Error adding training data:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { addTrainData };
