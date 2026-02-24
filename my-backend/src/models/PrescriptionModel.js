const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true }, 
  frequency: { type: String, required: true }, 
  duration: { type: String, required: true }, 
  instructions: { type: String }, 
});

const prescriptionSchema = new mongoose.Schema({
  patientId: {
    type: String, 
    required: true,
  },
  doctorId: { type: String, required: true },
  doctorName: { type: String, required: true },

  medications: [medicationSchema],

  diagnosis: { type: String },
  notes: { type: String },

  issuedAt: { type: Date, default: Date.now },

  embedding: {
    type: [Number],
  },
});

module.exports = mongoose.model("Prescription", prescriptionSchema);
