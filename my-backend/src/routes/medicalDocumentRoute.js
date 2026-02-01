const express = require("express");
const router = express.Router();
const multer = require("multer");
const medicalDocumentController = require("../controllers/medicalDocumentController");

// Configure multer for file uploads (PDF files only)
const upload = multer({
  storage: multer.memoryStorage(),
  // fileFilter: (req, file, cb) => {
  //   if (file.mimetype === "application/pdf") {
  //     cb(null, true);
  //   } else {
  //     cb(new Error("Only PDF files are allowed"));
  //   }
  // },


  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Only PDF and image files (PNG, JPG, JPEG) are allowed"),
        false
      );
    }
  },

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Medical Document Routes
router.post(
  "/documents/add",
  upload.single("file"),
  medicalDocumentController.addMedicalDocument
);
router.get(
  "/documents/patient/:patientId",
  medicalDocumentController.getPatientDocuments
);
router.get(
  "/documents/:documentId",
  medicalDocumentController.getMedicalDocument
);
router.post(
  "/documents/search",
  medicalDocumentController.searchDocumentsBySimilarity
);
router.put(
  "/documents/:documentId",
  medicalDocumentController.updateMedicalDocument
);
router.delete(
  "/documents/:documentId",
  medicalDocumentController.deleteMedicalDocument
);

module.exports = router;
