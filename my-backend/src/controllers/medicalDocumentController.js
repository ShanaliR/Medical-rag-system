require("dotenv").config();
const MedicalDocument = require("../models/MedicalDocumentModel");
const Patient = require("../models/PatientModel");
const { GoogleGenAI } = require("@google/genai");
const pdfParse = require("pdf-parse");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const EMBEDDING_MODEL = "embedding-001";

// Helper function to generate embeddings
async function generateEmbedding(text) {
  try {
    const result = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
    });
    return result.embeddings[0].values;
  } catch (error) {
    console.error("Embedding generation error:", error);
    throw error;
  }
}

// Helper function to extract text from PDF
async function extractTextFromPDF(pdfBuffer) {
  try {
    const pdfData = await pdfParse(pdfBuffer);
    return pdfData.text.trim();
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

// Add Medical Document
exports.addMedicalDocument = async (req, res) => {
  try {
    const { patientId, documentName, documentType, date, documentContent } =
      req.body;

    // Validate patient exists
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Get document content from body or uploaded file
    let content = documentContent;

    // If file is uploaded, extract text from PDF
    if (req.file) {
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ error: "Only PDF files are supported" });
      }
      content = await extractTextFromPDF(req.file.buffer);
    }

    if (!content) {
      return res.status(400).json({
        error: "Document content is required (either file or documentContent)",
      });
    }

    // Generate embedding for the document content
    const embedding = await generateEmbedding(content);

    // Create and save medical document
    const medicalDocument = new MedicalDocument({
      patientId,
      documentName: documentName || req.file?.originalname || "Untitled",
      documentType: documentType || "Medical Record",
      date: date ? new Date(date) : new Date(),
      originalContent: content,
      embedding,
      fileSize: req.file?.size || content.length,
      mimeType: req.file?.mimetype || "text/plain",
    });

    const savedDocument = await medicalDocument.save();

    res.status(201).json({
      message: "Medical document added successfully",
      document: {
        id: savedDocument._id,
        patientId: savedDocument.patientId,
        documentName: savedDocument.documentName,
        documentType: savedDocument.documentType,
        date: savedDocument.date,
        uploadedAt: savedDocument.uploadedAt,
      },
    });
  } catch (error) {
    console.error("Error adding medical document:", error);
    res.status(500).json({
      error: "Failed to add medical document",
      details: error.message,
    });
  }
};

// Get All Medical Documents for a Patient
exports.getPatientDocuments = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Validate patient exists
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const documents = await MedicalDocument.find({ patientId })
      .select("-originalContent -embedding")
      .sort({ date: -1 });

    res.status(200).json({
      patientId,
      documentCount: documents.length,
      documents,
    });
  } catch (error) {
    console.error("Error retrieving documents:", error);
    res.status(500).json({
      error: "Failed to retrieve documents",
      details: error.message,
    });
  }
};

// Get Specific Medical Document
exports.getMedicalDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await MedicalDocument.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json({
      document: {
        id: document._id,
        patientId: document.patientId,
        documentName: document.documentName,
        documentType: document.documentType,
        date: document.date,
        uploadedAt: document.uploadedAt,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        content: document.originalContent,
      },
    });
  } catch (error) {
    console.error("Error retrieving document:", error);
    res.status(500).json({
      error: "Failed to retrieve document",
      details: error.message,
    });
  }
};

// Search Documents by Similarity (using embeddings)
exports.searchDocumentsBySimilarity = async (req, res) => {
  try {
    const { patientId, query, limit = 5 } = req.body;

    // Validate patient exists
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);

    // Get all patient documents
    const documents = await MedicalDocument.find({ patientId }).select(
      "-embedding"
    );

    if (documents.length === 0) {
      return res.status(200).json({
        query,
        results: [],
        message: "No documents found for this patient",
      });
    }

    // Calculate similarity for each document (mock cosine similarity)
    const documentsWithScores = documents.map((doc) => {
      const score = cosineSimilarity(queryEmbedding, doc.embedding);
      return {
        ...doc.toObject(),
        similarityScore: score,
      };
    });

    // Sort by similarity score and limit results
    const results = documentsWithScores
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, parseInt(limit));

    res.status(200).json({
      query,
      patientId,
      resultCount: results.length,
      results,
    });
  } catch (error) {
    console.error("Error searching documents:", error);
    res.status(500).json({
      error: "Failed to search documents",
      details: error.message,
    });
  }
};

// Delete Medical Document
exports.deleteMedicalDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await MedicalDocument.findByIdAndDelete(documentId);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json({
      message: "Medical document deleted successfully",
      documentId,
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({
      error: "Failed to delete document",
      details: error.message,
    });
  }
};

// Update Medical Document
exports.updateMedicalDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { documentName, documentType } = req.body;

    const updateData = {};
    if (documentName) updateData.documentName = documentName;
    if (documentType) updateData.documentType = documentType;

    const updatedDocument = await MedicalDocument.findByIdAndUpdate(
      documentId,
      updateData,
      { new: true }
    ).select("-originalContent -embedding");

    if (!updatedDocument) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json({
      message: "Medical document updated successfully",
      document: updatedDocument,
    });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({
      error: "Failed to update document",
      details: error.message,
    });
  }
};

// Helper function to calculate cosine similarity
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
