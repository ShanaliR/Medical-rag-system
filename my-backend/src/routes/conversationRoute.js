const express = require("express");
const router = express.Router();
const hospitalController = require("../controllers/conversationController");
const { protect } = require("../middleware/authMiddleware");

// Patient Management Routes
router.post("/patients/register", protect, hospitalController.registerPatient);
router.put("/patients/:patientId", protect, hospitalController.updatePatient);
router.get("/patients", protect, hospitalController.getAllPatients);
router.get("/patients/:patientId", protect, hospitalController.getPatient);
router.post("/patients/search", protect, hospitalController.searchPatientsBySimilarity);

// Consultation Routes
router.post("/consultations/start", protect, hospitalController.startConsultation);
router.post("/consultations/ask", protect, hospitalController.askSeniorDoctor);
router.get("/consultations/:sessionId", protect, hospitalController.getConsultation);
router.put("/consultations/:sessionId/end", protect, hospitalController.endConsultation);

module.exports = router;
