import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";
import { MedicalTheme as theme } from "../theme";

const ChatInterface = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { role: "ai_patient", text: state.initialScenario },
  ]);
  const [input, setInput] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch patient documents
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!state?.patientId) return;

      setLoadingDocuments(true);
      try {
        const response = await API.get(`/documents/patient/${state.patientId}`);
        setDocuments(response.data.documents || []);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      } finally {
        setLoadingDocuments(false);
      }
    };

    fetchDocuments();
  }, [state?.patientId]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "student", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await API.post("/quiz/ask", {
        sessionId: state.sessionId,
        studentQuestion: input,
        selectedDoc: selectedDocuments.map((doc) => doc._id),
      });

      const aiMessage = {
        role: response.data.role,
        text: response.data.response,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message. Please try again.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!diagnosis.trim() || !prescription.trim()) {
      alert("Please provide both diagnosis and prescription.");
      return;
    }

    setIsTimerRunning(false);

    try {
      const response = await API.post("/quiz/submit", {
        sessionId: state.sessionId,
        finalDiagnosis: diagnosis,
        finalPrescription: prescription,
      });

      navigate("/results", {
        state: {
          evaluation: response.data,
          sessionId: state.sessionId,
          timeSpent: timer,
        },
      });
    } catch (err) {
      console.error("Submission error:", err);
      alert(`Submission failed: ${err.response?.data?.message || err.message}`);
      setIsTimerRunning(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "student":
        return "#059669";
      case "ai_patient":
        return theme.textMain;
      default:
        return theme.textSecondary;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "student":
        return "You";
      case "ai_patient":
        return "Patient";
      default:
        return role;
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        backgroundColor: theme.bg,
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Left Column: Quiz Info & Timer */}
      <div
        style={{
          width: "300px",
          backgroundColor: "white",
          borderRight: `1px solid ${theme.border}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
        }}
      >
        {/* Quiz Header */}
        <div
          style={{
            padding: "25px",
            background: `linear-gradient(135deg, #059669 0%, #047857 100%)`,
            color: "white",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "700",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <span>📝</span>
            Quiz Assessment
          </h3>
          <div
            style={{
              fontSize: "14px",
              opacity: 0.9,
              marginBottom: "15px",
            }}
          >
            Test your diagnostic skills
          </div>
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              padding: "10px 15px",
              borderRadius: "30px",
              fontSize: "13px",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>🎯</span>
            <span>No Hints Mode</span>
          </div>
        </div>

        {/* Timer */}
        <div
          style={{
            padding: "25px",
            borderBottom: `1px solid ${theme.border}`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: theme.textSecondary,
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: isTimerRunning ? "#059669" : "#dc2626",
                animation: isTimerRunning ? "pulse 1.5s infinite" : "none",
              }}
            ></span>
            Assessment Timer
          </div>
          <div
            style={{
              fontSize: "42px",
              fontWeight: "800",
              color: "#059669",
              fontFamily: "monospace",
              marginBottom: "5px",
            }}
          >
            {formatTime(timer)}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: theme.textLight,
              display: "flex",
              justifyContent: "center",
              gap: "15px",
            }}
          >
            <span>⏱️ Time Elapsed</span>
          </div>
        </div>

        {/* Quiz Stats */}
        <div
          style={{
            padding: "25px",
            borderBottom: `1px solid ${theme.border}`,
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: theme.textMain,
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span>📊</span>
            <span>Quiz Statistics</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <div
              style={{
                backgroundColor: "#f0fdf4",
                padding: "15px",
                borderRadius: "10px",
                border: `1px solid #d1fae5`,
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#059669",
                  fontWeight: "600",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>💬</span>
                <span>Questions Asked</span>
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#059669",
                }}
              >
                {messages.filter((m) => m.role === "student").length}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#f8fafc",
                padding: "15px",
                borderRadius: "10px",
                border: `1px solid #e2e8f0`,
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  fontWeight: "600",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>🎯</span>
                <span>Assessment Goal</span>
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: theme.textMain,
                  lineHeight: "1.5",
                }}
              >
                Gather sufficient information to make an accurate diagnosis and
                treatment plan.
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "25px",
              backgroundColor: "#fffbeb",
              padding: "15px",
              borderRadius: "10px",
              border: `1px solid #fde68a`,
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#92400e",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>⚠️</span>
              <span>Quiz Rules</span>
            </div>
            <ul
              style={{
                fontSize: "12px",
                color: "#92400e",
                paddingLeft: "20px",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              <li>No hints or guidance provided</li>
              <li>Focus on efficient questioning</li>
              <li>Time is being tracked</li>
              <li>Accuracy is evaluated</li>
            </ul>
          </div>
        </div>

        {/* Quick Tips */}
        <div
          style={{
            padding: "20px",
            borderTop: `1px solid ${theme.border}`,
            backgroundColor: "#f0f9ff",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#0369a1",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>💡</span>
            <span>Efficient Diagnosis Tips</span>
          </div>
          <ul
            style={{
              fontSize: "12px",
              color: "#0369a1",
              paddingLeft: "20px",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            <li>Ask specific, targeted questions</li>
            <li>Follow a logical diagnostic sequence</li>
            <li>Consider differential diagnoses</li>
            <li>Be thorough but efficient</li>
          </ul>
        </div>
      </div>

      {/* Middle Column: Chat Interface */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
        }}
      >
        {/* Chat Header */}
        <div
          style={{
            padding: "20px 25px",
            background: `linear-gradient(135deg, #1e293b 0%, #0f172a 100%)`,
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span>⚕️</span>
              Clinical Assessment - Patient Interview
            </h2>
            <div
              style={{
                fontSize: "14px",
                opacity: 0.9,
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <span>Diagnose based on patient responses only</span>
              <span
                style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>🎯</span>
                <span>Quiz Mode</span>
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to exit the quiz? Your progress will be lost."
                )
              ) {
                navigate("/");
              }
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "rgba(255,255,255,0.2)")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
          >
            <span>←</span>
            Exit Quiz
          </button>
        </div>

        {/* Messages Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "25px",
            backgroundColor: "#fafafa",
            backgroundImage:
              "linear-gradient(to bottom, transparent 95%, rgba(5, 150, 105, 0.05) 100%)",
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                maxWidth: "75%",
                marginBottom: "20px",
                marginLeft: message.role === "student" ? "auto" : "0",
                animation: "fadeIn 0.3s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                  marginLeft: message.role === "student" ? "auto" : "0",
                  justifyContent:
                    message.role === "student" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: getRoleColor(message.role),
                    opacity: 0.7,
                  }}
                ></div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: getRoleColor(message.role),
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {getRoleLabel(message.role)}
                </div>
                {message.role === "student" && (
                  <div
                    style={{
                      fontSize: "10px",
                      color: theme.textLight,
                      opacity: 0.7,
                    }}
                  >
                    {formatTime(timer)}
                  </div>
                )}
              </div>
              <div
                style={{
                  padding: "16px 20px",
                  backgroundColor:
                    message.role === "student" ? "#059669" : "white",
                  color: message.role === "student" ? "white" : theme.textMain,
                  borderRadius:
                    message.role === "student"
                      ? "18px 4px 18px 18px"
                      : "4px 18px 18px 18px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
                  lineHeight: "1.6",
                  wordWrap: "break-word",
                  border:
                    message.role === "student"
                      ? "none"
                      : `1px solid ${theme.border}`,
                  position: "relative",
                }}
              >
                {message.text}
                {message.role === "student" && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-8px",
                      right: "12px",
                      fontSize: "20px",
                      color: "#059669",
                      transform: "rotate(45deg)",
                    }}
                  >
                    ◢
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div
              style={{ marginBottom: "20px", animation: "fadeIn 0.3s ease" }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: theme.textSecondary,
                  marginBottom: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: theme.textSecondary,
                    opacity: 0.7,
                  }}
                ></div>
                Patient is responding...
              </div>
              <div
                style={{
                  padding: "16px 20px",
                  backgroundColor: "white",
                  borderRadius: "4px 18px 18px 18px",
                  width: "100px",
                  display: "flex",
                  gap: "8px",
                  border: `1px solid ${theme.border}`,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: "#059669",
                      borderRadius: "50%",
                      animation: `bounce 1.4s infinite ${i * 0.2}s`,
                      opacity: 0.7,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />

          <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        @keyframes bounce {
                            0%, 60%, 100% { transform: translateY(0); }
                            30% { transform: translateY(-8px); }
                        }
                        @keyframes pulse {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.5; }
                        }
                    `}</style>
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: "20px",
            borderTop: `1px solid ${theme.border}`,
            backgroundColor: "white",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-end",
            }}
          >
            <div style={{ flex: 1, position: "relative" }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your next clinical question..."
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  border: `2px solid ${theme.border}`,
                  borderRadius: "14px",
                  fontSize: "15px",
                  resize: "none",
                  minHeight: "70px",
                  maxHeight: "140px",
                  fontFamily: "Inter, sans-serif",
                  outline: "none",
                  transition: "all 0.2s",
                  backgroundColor: "#fafafa",
                }}
                disabled={loading}
                onFocus={(e) => (e.target.style.borderColor = "#059669")}
                onBlur={(e) => (e.target.style.borderColor = theme.border)}
              />
              <div
                style={{
                  position: "absolute",
                  right: "15px",
                  bottom: "15px",
                  fontSize: "11px",
                  color: theme.textLight,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>⏎</span>
                <span>Enter to send</span>
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              style={{
                padding: "16px 28px",
                background:
                  input.trim() && !loading
                    ? `linear-gradient(135deg, #059669 0%, #047857 100%)`
                    : theme.border,
                color: "white",
                border: "none",
                borderRadius: "14px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                boxShadow:
                  input.trim() && !loading
                    ? "0 4px 12px rgba(5, 150, 105, 0.3)"
                    : "none",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              onMouseOver={(e) => {
                if (input.trim() && !loading) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 6px 16px rgba(5, 150, 105, 0.4)";
                }
              }}
              onMouseOut={(e) => {
                if (input.trim() && !loading) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(5, 150, 105, 0.3)";
                }
              }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  ></div>
                  Sending...
                </>
              ) : (
                <>
                  <span>📤</span>
                  Send Question
                </>
              )}
            </button>
          </div>
          <div
            style={{
              fontSize: "12px",
              color: theme.textLight,
              marginTop: "12px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <span>⚡ Be efficient - ask targeted questions</span>
            <span>•</span>
            <span>Press Shift+Enter for new line</span>
          </div>

          {/* Documents Section */}
          {documents.length > 0 && (
            <div
              style={{
                marginTop: "20px",
                paddingTop: "20px",
                borderTop: `2px solid ${theme.border}`,
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: theme.textMain,
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>📄</span>
                Available Medical Documents ({documents.length})
              </div>

              <div
                style={{
                  backgroundColor: "#f0fdf4",
                  border: `1px solid #d1fae5`,
                  borderRadius: "10px",
                  padding: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    maxHeight: "120px",
                    overflowY: "auto",
                  }}
                >
                  {documents.map((doc) => (
                    <label
                      key={doc._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 12px",
                        backgroundColor: "white",
                        border: `2px solid ${
                          selectedDocuments.some((d) => d._id === doc._id)
                            ? "#059669"
                            : "#d1fae5"
                        }`,
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontSize: "13px",
                        fontWeight: "500",
                        color: theme.textMain,
                      }}
                      onMouseOver={(e) => {
                        if (!selectedDocuments.some((d) => d._id === doc._id)) {
                          e.currentTarget.style.borderColor = "#059669";
                          e.currentTarget.style.backgroundColor = "#f0fdf4";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!selectedDocuments.some((d) => d._id === doc._id)) {
                          e.currentTarget.style.borderColor = "#d1fae5";
                          e.currentTarget.style.backgroundColor = "white";
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDocuments.some(
                          (d) => d._id === doc._id
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDocuments([...selectedDocuments, doc]);
                          } else {
                            setSelectedDocuments(
                              selectedDocuments.filter((d) => d._id !== doc._id)
                            );
                          }
                        }}
                        style={{
                          cursor: "pointer",
                          width: "16px",
                          height: "16px",
                        }}
                      />
                      <span>{doc.fileName || doc.name || "Document"}</span>
                    </label>
                  ))}
                </div>
                {selectedDocuments.length > 0 && (
                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "12px",
                      color: "#059669",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>✓</span>
                    <span>{selectedDocuments.length} document(s) selected</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Final Assessment */}
      <div
        style={{
          width: "380px",
          backgroundColor: "white",
          borderLeft: `1px solid ${theme.border}`,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-2px 0 10px rgba(0,0,0,0.05)",
        }}
      >
        {/* Assessment Header */}
        <div
          style={{
            padding: "25px",
            background: `linear-gradient(135deg, #1e293b 0%, #0f172a 100%)`,
            color: "white",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "700",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <span>🏁</span>
            Final Diagnosis
          </h3>
          <div
            style={{
              fontSize: "14px",
              opacity: 0.9,
            }}
          >
            Submit when ready for evaluation
          </div>
        </div>

        {/* Assessment Form */}
        <div
          style={{
            flex: 1,
            padding: "25px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            backgroundColor: "#fafafa",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "15px",
                fontWeight: "700",
                color: theme.textMain,
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  backgroundColor: "#059669",
                  color: "white",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                1
              </span>
              Your Diagnosis
            </label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Based on your assessment, enter the final diagnosis..."
              style={{
                width: "100%",
                padding: "16px",
                border: `2px solid ${theme.border}`,
                borderRadius: "12px",
                fontSize: "14px",
                minHeight: "100px",
                resize: "vertical",
                fontFamily: "Inter, sans-serif",
                outline: "none",
                transition: "border-color 0.2s",
                backgroundColor: "white",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#059669")}
              onBlur={(e) => (e.target.style.borderColor = theme.border)}
            />
            <div
              style={{
                fontSize: "12px",
                color: theme.textLight,
                marginTop: "8px",
                paddingLeft: "36px",
              }}
            >
              Be specific and confident in your diagnosis
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "15px",
                fontWeight: "700",
                color: theme.textMain,
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                2
              </span>
              Prescription & Dosage
            </label>
            <textarea
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="Medication, dosage, frequency, duration..."
              style={{
                width: "100%",
                padding: "16px",
                border: `2px solid ${theme.border}`,
                borderRadius: "12px",
                fontSize: "14px",
                minHeight: "80px",
                resize: "vertical",
                fontFamily: "Inter, sans-serif",
                outline: "none",
                transition: "border-color 0.2s",
                backgroundColor: "white",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#dc2626")}
              onBlur={(e) => (e.target.style.borderColor = theme.border)}
            />
            <div
              style={{
                fontSize: "12px",
                color: theme.textLight,
                marginTop: "8px",
                paddingLeft: "36px",
              }}
            >
              Include exact medication details
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "15px",
                fontWeight: "700",
                color: theme.textMain,
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  backgroundColor: "#8b5cf6",
                  color: "white",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                3
              </span>
              Instructions (Optional)
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Follow-up, lifestyle advice, warnings..."
              style={{
                width: "100%",
                padding: "16px",
                border: `2px solid ${theme.border}`,
                borderRadius: "12px",
                fontSize: "14px",
                minHeight: "70px",
                resize: "vertical",
                fontFamily: "Inter, sans-serif",
                outline: "none",
                transition: "border-color 0.2s",
                backgroundColor: "white",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
              onBlur={(e) => (e.target.style.borderColor = theme.border)}
            />
          </div>

          {/* Performance Summary */}
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              border: `2px solid ${theme.border}`,
              marginTop: "10px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: theme.textMain,
                marginBottom: "15px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>📈</span>
              Performance Summary
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "15px",
                  backgroundColor: "#f0fdf4",
                  borderRadius: "10px",
                  border: `1px solid #d1fae5`,
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "800",
                    color: "#059669",
                  }}
                >
                  {messages.filter((m) => m.role === "student").length}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#059669",
                    marginTop: "6px",
                    fontWeight: "600",
                  }}
                >
                  Questions Asked
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "15px",
                  backgroundColor: "#f0f9ff",
                  borderRadius: "10px",
                  border: `1px solid #e0f2fe`,
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "800",
                    color: "#0369a1",
                  }}
                >
                  {formatTime(timer)}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#0369a1",
                    marginTop: "6px",
                    fontWeight: "600",
                  }}
                >
                  Time Elapsed
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: "12px",
                color: theme.textSecondary,
                textAlign: "center",
                lineHeight: "1.5",
                padding: "10px",
                backgroundColor: "#fffbeb",
                borderRadius: "8px",
                border: `1px solid #fde68a`,
              }}
            >
              <span style={{ fontWeight: "600", color: "#92400e" }}>Note:</span>{" "}
              Submit only when you're confident in your diagnosis
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div
          style={{
            padding: "25px",
            borderTop: `1px solid ${theme.border}`,
            backgroundColor: "white",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <button
            onClick={handleSubmit}
            disabled={!diagnosis.trim() || !prescription.trim()}
            style={{
              width: "100%",
              padding: "18px",
              background:
                !diagnosis.trim() || !prescription.trim()
                  ? theme.border
                  : `linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)`,
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "700",
              cursor:
                !diagnosis.trim() || !prescription.trim()
                  ? "not-allowed"
                  : "pointer",
              transition: "all 0.2s",
              boxShadow:
                !diagnosis.trim() || !prescription.trim()
                  ? "none"
                  : "0 4px 15px rgba(220, 38, 38, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseOver={(e) => {
              if (diagnosis.trim() && prescription.trim()) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(220, 38, 38, 0.4)";
              }
            }}
            onMouseOut={(e) => {
              if (diagnosis.trim() && prescription.trim()) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(220, 38, 38, 0.3)";
              }
            }}
          >
            {diagnosis.trim() && prescription.trim() && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  animation: "shimmer 2s infinite",
                }}
              ></div>
            )}
            <span style={{ position: "relative", zIndex: 1 }}>📋</span>
            <span style={{ position: "relative", zIndex: 1 }}>
              Submit Final Assessment
            </span>
          </button>
          <div
            style={{
              fontSize: "12px",
              color: theme.textLight,
              marginTop: "15px",
              textAlign: "center",
              lineHeight: "1.6",
            }}
          >
            <span style={{ fontWeight: "600" }}>⚠️ Final Submission:</span> You
            cannot change your answers after submission
          </div>
        </div>
      </div>
      <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
    </div>
  );
};

export default ChatInterface;
