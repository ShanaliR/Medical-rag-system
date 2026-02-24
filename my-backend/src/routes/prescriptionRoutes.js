const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescriptionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, prescriptionController.addPrescription);
router.get("/:patientId", protect, prescriptionController.getPatientPrescriptions);
router.delete("/:prescriptionId", protect, prescriptionController.deletePrescription);

module.exports = router;
