// ragPipeline.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Docs = require("../models/docs");
const TrainData = require("../models/TrainData");
const {
  REPHRASE_PROMPT_TEMPLATE,
  MAIN_HR_PROMPT_TEMPLATE,
  TRANSLATE_PROMPT_TEMPLATE,
  QA_PROMPT_TEMPLATE,
  HR_ASSISTANT_PROMPT,
} = require("../utils/promptTemplates");
const { mcpChat } = require("../controllers/mcpTestController");

const HUMAN_ASSISTANCE_FLAG = "Please contact Human assistance.";

class RAGPipeline {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.HUMAN_ASSISTANCE_FLAG = HUMAN_ASSISTANCE_FLAG;
  }

  // 🔧 Utility: Gemini Model Fetcher
  getGeminiModel(modelName = "gemini-2.5-flash", systemInstruction = null) {
    const config = { model: modelName };
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    return this.genAI.getGenerativeModel(config);
  }

  // 🔧 Utility: Translate Text via Gemini
  async translateViaGemini(text, targetLangCode) {
    if (!text || !targetLangCode) return text;
    const prompt = TRANSLATE_PROMPT_TEMPLATE.replace(
      "{textToTranslate}",
      text
    ).replace("{targetLanguageCode}", targetLangCode);

    try {
      const result = await this.getGeminiModel().generateContent(prompt);

      const translated = result.response.text();
      console.log(
        `Translation to ${targetLangCode} content: ${text} successful: "${translated}"`
      );
      return translated;
    } catch (err) {
      console.error(`Translation error:`, err);
      return text;
    }
  }

  // 🔧 Utility: Generate Content via Gemini
  async generateAndRephraseResponse(prompt) {
    const model = this.getGeminiModel();
    const response = await model.generateContent(prompt);
    return response.response.text();
  }

  // 🔧 Utility: Format conversation history for context
  formatConversationHistory(messageHistory = []) {
    if (!messageHistory || messageHistory.length === 0) {
      return null;
    }

    // Limit history to last 6 messages to avoid token overflow
    const recentMessages = messageHistory.slice(-6);

    const formattedHistory = recentMessages
      .map((msg) => {
        const from = msg.from === "user" ? "User" : "HR Assistant";
        const content = msg.message || msg.content || "";
        return `${from}: ${content}`;
      })
      .join("\n");

    return formattedHistory || null;
  }

  // 🔍 Vector Search: Documents
  async getRelevantChunks(query, topK = 10) {
    const embedModel = this.getGeminiModel("embedding-001");
    const res = await embedModel.embedContent({
      content: { parts: [{ text: query }] },
      taskType: "retrieval_query",
    });
    const queryVector = res.embedding.values;

    return Docs.aggregate([
      {
        $vectorSearch: {
          queryVector,
          path: "embedding",
          numCandidates: 100,
          limit: topK,
          index: "vector_index",
        },
      },
    ]);
  }

  // 🔍 Vector Search: Training Q&A
  async getRelevantTrainData(query, topK = 3) {
    const embedModel = this.getGeminiModel("embedding-001");
    const res = await embedModel.embedContent({
      content: { parts: [{ text: query }] },
      taskType: "retrieval_query",
    });
    const queryVector = res.embedding.values;

    return TrainData.aggregate([
      {
        $vectorSearch: {
          queryVector,
          path: "embedding",
          numCandidates: 200,
          limit: topK,
          index: "vector_training_index",
        },
      },
    ]);
  }

  // 📄 Document-based Answer Generation
  async getDocumentResponse(message, processedMessage, lang, messageHistory = []) {
    const employee_id = "EMP0002";
    const chunks = await this.getRelevantChunks(processedMessage);
    console.log(
      `[Doc Search] Found ${chunks.length} chunks for "${processedMessage}"`
    );

    if (!chunks.length) return this.HUMAN_ASSISTANCE_FLAG;

    const context = chunks
      .map((c, i) => `Context ${i + 1}:\n${c.content.trim().slice(0, 1000)}`)
      .join("\n\n");

    const toolRes = await mcpChat(processedMessage, employee_id);
    console.log("[Tool Execution] Result:", toolRes);

    // Build conversation history context
    const conversationHistory = this.formatConversationHistory(messageHistory);

    const prompt = HR_ASSISTANT_PROMPT.replace("{contextExamples}", context)
      .replace("{userQuestion}", processedMessage)
      .replace("{language}", lang)
      .replace("{conversationHistory}", conversationHistory ? conversationHistory : "N/A")
      .replace("{toolResponse}", toolRes.response);

    // Use conversation history as system instruction
    const systemInstruction = conversationHistory ? 
      `You are an HR assistant with knowledge of this conversation history:\n${conversationHistory}\n\nUse this context to provide consistent and contextual responses.` : 
      null;

    const model = this.getGeminiModel("gemini-2.5-flash", systemInstruction);
    return await model.generateContent(prompt).then(result => result.response.text());
  }

  // ❓ Training Q&A-based Answer Generation
  async getTrainingResponse(message, processedMessage, messageHistory = []) {
    const chunks = await this.getRelevantTrainData(processedMessage);
    console.log(
      `[Q&A Search] Found ${chunks.length} entries for "${processedMessage}"`
    );

    if (!chunks.length) return this.HUMAN_ASSISTANCE_FLAG;

    const context = chunks
      .map(
        (chunk) =>
          `Q: ${chunk.question.trim().slice(0, 1000)}\nA: ${chunk.answer
            .trim()
            .slice(0, 1000)}`
      )
      .join("\n\n");

    // Build conversation history context
    const conversationHistory = this.formatConversationHistory(messageHistory);

    const prompt = QA_PROMPT_TEMPLATE.replace(
      "{contextExamples}",
      context
    ).replace("{userQuestion}", message);

    // Use conversation history as system instruction
    const systemInstruction = conversationHistory ? 
      `You are an HR assistant with knowledge of this conversation history:\n${conversationHistory}\n\nUse this context to provide consistent and contextual responses.` : 
      null;

    const model = this.getGeminiModel("gemini-2.5-flash", systemInstruction);
    return await model.generateContent(prompt).then(result => result.response.text());
  }

  // 🎯 Main RAG Processing Method
  async processQuery(message, messagehistory ,options = {}) {
    const {
      lang = "en",
      translate = true,
      fallbackToTraining = true,
    } = options;

    let processedMessage = message;

    // Translate if needed and enabled
    if (lang !== "en" && translate) {
      processedMessage = await this.translateViaGemini(message, "en");
      console.log(
        `[Lang] Input translated from ${lang} to EN: "${processedMessage}"`
      );
    }

    // Try document-based response first, passing message history
    let botResponse = await this.getDocumentResponse(
      message,
      processedMessage,
      lang,
      messagehistory
    );

    // Fallback to training data if no document matches found
    if (
      fallbackToTraining &&
      botResponse.includes(this.HUMAN_ASSISTANCE_FLAG)
    ) {
      console.log("➡️ Fallback to Training Q&A due to no doc match");
      botResponse = await this.getTrainingResponse(message, processedMessage, messagehistory);
    }

    let finalResponse = botResponse;

    return {
      response: finalResponse,
      needsHumanAssistance: finalResponse.includes(this.HUMAN_ASSISTANCE_FLAG),
      processedQuery: processedMessage,
      originalQuery: message,
    };
  }
}

module.exports = RAGPipeline;
