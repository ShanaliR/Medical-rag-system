const express = require("express");
const router = express.Router();
const hospitalController = require("../controllers/conversationController");

// Patient Management Routes
router.post("/patients/register", hospitalController.registerPatient);
router.put("/patients/:patientId", hospitalController.updatePatient);
router.get("/patients", hospitalController.getAllPatients);
router.get("/patients/:patientId", hospitalController.getPatient);
router.post("/patients/search", hospitalController.searchPatientsBySimilarity);

// Consultation Routes
router.post("/consultations/start", hospitalController.startConsultation);
router.post("/consultations/ask", hospitalController.askSeniorDoctor);
router.get("/consultations/:sessionId", hospitalController.getConsultation);
router.put("/consultations/:sessionId/end", hospitalController.endConsultation);

module.exports = router;
