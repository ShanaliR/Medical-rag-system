// src/models/TrainingData.js

const mongoose = require('mongoose');

// Define the schema for training data
// This schema will store questions and their corresponding answers,
// which will be used to train and customize the bot's responses.
const TrainingDataSchema = mongoose.Schema({
    question: {
        type: String,
        required: true, // The question field is mandatory
        unique: true,   // Each question must be unique to avoid duplicate training entries
    },
    answer: {
        type: String,
        required: true, // The answer field is mandatory
    },
}, {
    timestamps: true, // Adds 'createdAt' and 'updatedAt' fields automatically
});

// Create and export the Mongoose model based on the schema
const TrainingData = mongoose.model('TrainingData', TrainingDataSchema);

module.exports = TrainingData;
