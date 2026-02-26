import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import authAxios from "../utils/authAxios";

const ConsultationChat = ({
  selectedPatient,
  sessionId,
  isLoading,
  setIsLoading,
}) => {
  const [messages, setMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [consultationDetails, setConsultationDetails] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (sessionId) {
      fetchConsultationDetails();
    } else {
      setMessages([]);
      setConsultationDetails(null);
    }
  }, [sessionId]);

  useEffect(() => {
    if (selectedPatient?.patientId) {
      console.log("Selected patient changed:", selectedPatient.patientId);
      fetchPatientDocuments(selectedPatient.patientId);
    } else {
      setDocuments([]);
      setSelectedDocuments([]);
    }
  }, [selectedPatient]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConsultationDetails = async () => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      // const response = await axios.get(
      //   `http://localhost:8000/api/consultations/${sessionId}`
      // );
      const response = await authAxios.get(
 `/consultations/${sessionId}`
);
      setConsultationDetails(response.data);
      // Convert conversation log to messages format
      const formattedMessages =
        response.data.conversationLog?.map((entry) => ({
          id: entry._id || Date.now() + Math.random(),
          text: entry.content,
          role: entry.role,
          timestamp: entry.timestamp,
          relevanceScore: entry.relevanceScore,
        })) || [];
      setMessages(formattedMessages.slice(1));
    } catch (error) {
      console.error("Error fetching consultation details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPatientDocuments = async (patientId) => {
    console.log("Fetching consultation details for session:", patientId);
    setDocumentsLoading(true);
    try {
      // const response = await axios.get(
      //   `http://localhost:8000/api/documents/patient/${patientId}`
      // );
      const response = await authAxios.get(
 `/documents/patient/${patientId}`
);

      setDocuments(response.data.documents || []);
      setSelectedDocuments([]);
    } catch (error) {
      console.error("Error fetching patient documents:", error);
      setDocuments([]);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendQuestion = async (e) => {
    e.preventDefault();
    if (!inputQuestion.trim() || !sessionId || isSending) return;

    const newMessage = {
      id: Date.now(),
      text: inputQuestion,
      role: "doctor",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputQuestion("");
    setIsSending(true);

    try {
      const payload = {
        sessionId: sessionId,
        question: inputQuestion,
        selectedDoc: selectedDocuments.map((doc) => doc._id),
      };

      // const response = await axios.post(
      //   "http://localhost:8000/api/consultations/ask",
      //   payload
      // );
      const response = await authAxios.post(
  "/consultations/ask",
  payload
);

      const aiResponse = {
        id: Date.now() + 1,
        text: response.data.response,
        role: response.data.role,
        timestamp: new Date().toISOString(),
        relevanceScore: response.data.relevanceScore,
        questionCount: response.data.questionCount,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error sending question:", error);

      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, there was an error processing your question. Please try again.",
        role: "system",
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleDocumentToggle = (document) => {
    setSelectedDocuments((prev) => {
      const isSelected = prev.some((doc) => doc._id === document._id);
      if (isSelected) {
        return prev.filter((doc) => doc._id !== document._id);
      } else {
        return [...prev, document];
      }
    });
  };

  if (!selectedPatient) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No patient selected
          </h3>
          <p className="mt-1 text-gray-500">
            Select a patient from the sidebar to start a consultation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-screen">
      {/* Consultation Header */}
      <div className="border-b px-6 py-4 bg-gradient-to-r from-blue-50 to-gray-50 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Consultation Session
            </h2>
            {sessionId && (
              <p className="text-sm text-gray-600 mt-1">
                Session ID:{" "}
                <span className="font-mono bg-blue-100 px-2 py-1 rounded">
                  {sessionId}
                </span>
              </p>
            )}
          </div>
          {/* {consultationDetails && (
            <div className="text-right">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Questions Asked: </span>
                {consultationDetails.conversationLog?.filter(
                  (entry) => entry.role === "doctor"
                ).length || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Started:{" "}
                {new Date(consultationDetails.createdAt).toLocaleDateString()}
              </div>
            </div>
          )} */}



          {consultationDetails && (
          <div className="text-right">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Questions Asked: </span>
              {messages.filter((msg) => msg.role === "doctor").length}
            </div>

            {/* <div className="text-xs text-gray-500 mt-1">
              Started:{" "}
              {consultationDetails.createdAt
                ? new Date(consultationDetails.createdAt).toLocaleDateString()
                : "N/A"}
            </div> */}
            <div className="text-xs text-gray-500 mt-1">
            Started:{" "}
            {consultationDetails.createdAt
              ? new Date(consultationDetails.createdAt).toLocaleString("en-LK", {
                  timeZone: "Asia/Colombo",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : new Date().toLocaleString("en-LK", {
                  timeZone: "Asia/Colombo",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
          </div>
          </div>
        )}


        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 min-h-0">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading consultation...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700">
              Consultation Started
            </h3>
            <p className="text-gray-500 mt-2 max-w-md">
              Ask your first question to the senior doctor AI assistant. The AI
              will analyze patient data and provide expert recommendations.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "doctor" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-2xl rounded-2xl px-4 py-3 ${
                    message.isError
                      ? "bg-red-50 border border-red-200"
                      : message.role === "doctor"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : message.role === "senior_doctor"
                      ? "bg-green-50 border border-green-200 rounded-bl-none"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-medium ${
                        message.role === "doctor"
                          ? "text-blue-100"
                          : message.role === "senior_doctor"
                          ? "text-green-700"
                          : "text-gray-500"
                      }`}
                    >
                      {message.role === "doctor"
                        ? "You"
                        : message.role === "senior_doctor"
                        ? "Senior Doctor AI"
                        : "System"}
                    </span>
                    <span
                      className={`text-xs ${
                        message.role === "doctor"
                          ? "text-blue-200"
                          : "text-gray-400"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className="text-base" style={{ fontFamily: "inherit" }}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 whitespace-pre-wrap">{children}</p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic">{children}</em>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside mb-2">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside mb-2">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="mb-1">{children}</li>
                        ),
                        code: ({ children }) => (
                          <code className="px-1 py-0.5 rounded bg-gray-200 text-sm font-mono">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-6 flex-shrink-0 overflow-y-auto max-h-96">
        <form onSubmit={handleSendQuestion} className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask a question to the senior doctor..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              disabled={!sessionId || isSending}
            />
            {!sessionId && (
              <div className="absolute inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center rounded-lg">
                <span className="text-gray-500 text-sm">
                  Start a consultation first
                </span>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!inputQuestion.trim() || !sessionId || isSending}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSending ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Sending...
              </span>
            ) : (
              "Send"
            )}
          </button>
        </form>
        <div className="mt-3 text-sm text-gray-500 flex justify-between">
          <span>Press Enter to send</span>
          <span>Characters: {inputQuestion.length}</span>
        </div>

        {/* Documents Section */}
        {documents.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-700">
                Patient Documents ({documents.length})
              </h3>
              {selectedDocuments.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {selectedDocuments.length} selected
                </span>
              )}
            </div>
            {documentsLoading ? (
              <div className="text-center py-2">
                <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                <p className="text-xs text-gray-500 mt-1">
                  Loading documents...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 max-h-24 overflow-y-auto">
                {documents.map((doc) => (
                  <label
                    key={doc._id}
                    className="flex items-center p-2 border border-gray-200 rounded hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDocuments.some((d) => d._id === doc._id)}
                      onChange={() => handleDocumentToggle(doc)}
                      className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="ml-2 flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">
                        {doc.documentName || doc.name || "Unnamed Document"}
                      </p>

                      <p className="text-xs text-gray-500 hidden">
                        {new Date(doc.date).toLocaleDateString()}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationChat;
