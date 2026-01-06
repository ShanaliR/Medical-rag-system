// models/Document.js
const mongoose = require("mongoose");

const trainDataSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true, // The question field is mandatory
      unique: true, // Each question must be unique to avoid duplicate training entries
    },
    answer: {
      type: String,
      required: true, // The answer field is mandatory
    },
    embedding: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TrainData", trainDataSchema);
