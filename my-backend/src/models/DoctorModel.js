const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      default: "General",
    },
    hospital: {
      type: String,
    },
    role: {
      type: String,
      default: "doctor",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);