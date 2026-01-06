require("dotenv").config();
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Docs = require("../models/docs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MAX_CHUNK_SIZE = 800; // characters per chunk

function splitIntoChunks(text) {
  const paragraphs = text
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const chunks = [];

  for (const para of paragraphs) {
    if (para.length <= MAX_CHUNK_SIZE) {
      chunks.push(para);
    } else {
      const sentences = para.match(/[^.!?]+[.!?]+/g) || [para];
      let currentChunk = "";

      for (const sentence of sentences) {
        if ((currentChunk + sentence).length <= MAX_CHUNK_SIZE) {
          currentChunk += sentence;
        } else {
          if (currentChunk) chunks.push(currentChunk.trim());
          currentChunk = sentence;
        }
      }

      if (currentChunk) chunks.push(currentChunk.trim());
    }
  }

  return chunks;
}

/**
 * Embed a PDF buffer and save chunks to Docs collection
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {string} fileName - original file name
 */
async function embedAndSaveDocument(pdfBuffer, fileName) {
  const pdfData = await pdfParse(pdfBuffer);
  const rawText = pdfData.text.trim();

  if (!rawText || rawText.length < 50) {
    throw new Error("No meaningful content extracted from PDF.");
  }

  const chunks = splitIntoChunks(rawText);
  console.log(`✂️  Split document "${fileName}" into ${chunks.length} chunks`);

  const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
  const savedDocs = [];

  for (let i = 0; i < chunks.length; i++) {
    const textChunk = chunks[i];

    try {
      const res = await embeddingModel.embedContent({
        content: { parts: [{ text: textChunk }] },
        taskType: "retrieval_document",
      });

      const embedding = res.embedding.values;

      const doc = new Docs({
        fileName,
        section: `chunk-${i + 1}`,
        content: textChunk,
        embedding,
      });

      const saved = await doc.save();
      savedDocs.push(saved);
      console.log(`✅ Saved chunk ${i + 1}/${chunks.length}`);
    } catch (err) {
      console.error(`❌ Error embedding chunk ${i + 1}:`, err.message);
    }
  }

  return savedDocs;
}

module.exports = { embedAndSaveDocument };
