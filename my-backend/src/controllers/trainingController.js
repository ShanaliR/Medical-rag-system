// src/controllers/trainingController.js

const TrainingData = require('../models/TrainingData');

// @desc    Add new training data (question and answer)
// @route   POST /api/train-bot
// @access  Privileged Access
const addTrainingData = async (req, res) => {
    const { question, answer } = req.body; // Extract question and answer from the request body

    // Check if both question and answer are provided
    if (!question || !answer) {
        return res.status(400).json({ message: 'Please enter both question and answer.' });
    }

    try {
        // Create a new TrainingData document
        const trainingData = new TrainingData({
            question,
            answer,
        });

        // Save the new training data to the database
        const createdTrainingData = await trainingData.save();

        // Respond with the newly created training data
        res.status(201).json(createdTrainingData);
    } catch (error) {
        // Handle duplicate question error
        if (error.code === 11000) {
            return res.status(400).json({ message: 'This question already exists in training data. Please use a unique question.' });
        }
        // Handle other server errors
        console.error('Error adding training data:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { addTrainingData };