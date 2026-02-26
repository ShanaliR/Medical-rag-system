// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import API from '../api';
// import { MedicalTheme as theme } from '../theme';

// const TrainingChatInterface = () => {
//     const { state } = useLocation();
//     const navigate = useNavigate();
//     const messagesEndRef = useRef(null);
    
//     const [messages, setMessages] = useState([
//         { role: 'ai_patient', text: state.initialScenario }
//     ]);
//     const [input, setInput] = useState('');
//     const [diagnosis, setDiagnosis] = useState('');
//     const [prescription, setPrescription] = useState('');
//     const [instructions, setInstructions] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [hints, setHints] = useState([]);
//     const [currentHint, setCurrentHint] = useState(state.initialHint || 'Ask questions to begin diagnosis...');
//     const [progress, setProgress] = useState({
//         currentStep: 1,
//         totalSteps: state.totalSteps || 5,
//         completedSteps: 0,
//         percentage: 0
//     });

//     // Auto-scroll to bottom of messages
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);

//     // Fetch initial hint and set it
//     useEffect(() => {
//         if (state.initialHint) {
//             setCurrentHint(state.initialHint);
//             setHints([state.initialHint]);
//         }
//         fetchHint();
//     }, [state.sessionId, state.initialHint]);

//     const fetchHint = useCallback(async () => {
//         try {
//             const response = await API.get(`/training/hint/${state.sessionId}`);
//             const data = response.data;
            
//             setProgress({
//                 currentStep: data.currentStep.number,
//                 totalSteps: data.progress.total,
//                 completedSteps: data.progress.completed,
//                 percentage: data.progress.percentage
//             });
            
//             if (data.currentHint) {
//                 setCurrentHint(data.currentHint);
//             }
            
//             if (data.recentHints && data.recentHints.length > 0) {
//                 const hintTexts = data.recentHints.map(h => h.hint);
//                 setHints(hintTexts);
//             }
//         } catch (err) {
//             console.error('Failed to fetch hint:', err);
//         }
//     }, [state.sessionId]);

//     const handleSend = async () => {
//         if (!input.trim() || loading) return;

//         const userMessage = { role: 'student', text: input };
//         setMessages(prev => [...prev, userMessage]);
//         setInput('');
//         setLoading(true);

//         try {
//             const response = await API.post('/training/ask', {
//                 sessionId: state.sessionId,
//                 studentQuestion: input
//             });

//             const aiMessage = {
//                 role: response.data.response.role,
//                 text: response.data.response.text
//             };
            
//             setMessages(prev => [...prev, aiMessage]);

//             // Update hints if provided
//             if (response.data.hint) {
//                 setHints(prev => [...prev, response.data.hint]);
//                 setCurrentHint(response.data.hint);
//             }

//             // Update progress
//             if (response.data.diagnosticProgress) {
//                 setProgress({
//                     currentStep: response.data.diagnosticProgress.currentStep,
//                     totalSteps: response.data.diagnosticProgress.totalSteps,
//                     completedSteps: response.data.diagnosticProgress.completedSteps,
//                     percentage: Math.round(
//                         (response.data.diagnosticProgress.completedSteps / 
//                          response.data.diagnosticProgress.totalSteps) * 100
//                     )
//                 });
//             }

//             // Fetch updated hints
//             setTimeout(fetchHint, 500);

//         } catch (err) {
//             console.error('Failed to send message:', err);
//             alert('Failed to send message. Please try again.');
//             // Remove the user message on error
//             setMessages(prev => prev.slice(0, -1));
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubmit = async () => {
//         if (!diagnosis.trim() || !prescription.trim()) {
//             alert('Please provide both diagnosis and prescription.');
//             return;
//         }

//         try {
//             const response = await API.post('/training/submit', {
//                 sessionId: state.sessionId,
//                 finalDiagnosis: diagnosis,
//                 finalPrescription: prescription
//             });

//             navigate('/training-results', {
//                 state: {
//                     evaluation: response.data,
//                     sessionId: state.sessionId,
//                     progress: progress
//                 }
//             });
//         } catch (err) {
//             console.error('Submission error:', err);
//             alert(`Submission failed: ${err.response?.data?.message || err.message}`);
//         }
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSend();
//         }
//     };

//     const getRoleColor = (role) => {
//         switch (role) {
//             case 'student': return theme.primary;
//             case 'ai_patient': return theme.textMain;
//             case 'system_hint': return '#f59e0b';
//             default: return theme.textSecondary;
//         }
//     };

//     const getRoleLabel = (role) => {
//         switch (role) {
//             case 'student': return 'You';
//             case 'ai_patient': return 'Patient';
//             case 'system_hint': return 'Hint';
//             default: return role;
//         }
//     };

//     const getHintType = (hint) => {
//         if (hint.includes('Good!') || hint.includes('Excellent') || hint.includes('Great job')) {
//             return 'success';
//         }
//         if (hint.includes('Try') || hint.includes('Focus') || hint.includes('Consider')) {
//             return 'guidance';
//         }
//         if (hint.includes('Start') || hint.includes('Begin')) {
//             return 'initial';
//         }
//         return 'info';
//     };

//     const getHintIcon = (hint) => {
//         const type = getHintType(hint);
//         switch (type) {
//             case 'success': return '✅';
//             case 'guidance': return '💡';
//             case 'initial': return '🚀';
//             default: return '📝';
//         }
//     };

//     return (
//         <div style={{
//             height: '100vh',
//             display: 'flex',
//             backgroundColor: theme.bg,
//             fontFamily: 'Inter, sans-serif'
//         }}>
//             {/* Left Column: Diagnostic Progress & Hints */}
//             <div style={{
//                 width: '320px',
//                 backgroundColor: 'white',
//                 borderRight: `1px solid ${theme.border}`,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 overflow: 'hidden'
//             }}>
//                 {/* Progress Header */}
//                 <div style={{
//                     padding: '20px',
//                     backgroundColor: '#f8fafc',
//                     borderBottom: `1px solid ${theme.border}`
//                 }}>
//                     <h3 style={{ 
//                         color: theme.textMain, 
//                         marginBottom: '15px',
//                         fontSize: '18px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '10px'
//                     }}>
//                         <span style={{
//                             backgroundColor: theme.primary,
//                             color: 'white',
//                             width: '30px',
//                             height: '30px',
//                             borderRadius: '50%',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             fontSize: '14px'
//                         }}>
//                             {progress.currentStep}
//                         </span>
//                         Diagnostic Progress
//                     </h3>
                    
//                     {/* Progress Bar */}
//                     <div style={{
//                         height: '10px',
//                         backgroundColor: '#e2e8f0',
//                         borderRadius: '5px',
//                         marginBottom: '15px',
//                         overflow: 'hidden'
//                     }}>
//                         <div style={{
//                             height: '100%',
//                             width: `${progress.percentage}%`,
//                             backgroundColor: theme.primary,
//                             transition: 'width 0.3s ease',
//                             borderRadius: '5px'
//                         }}></div>
//                     </div>
                    
//                     <div style={{
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         fontSize: '14px',
//                         color: theme.textSecondary
//                     }}>
//                         <div>
//                             <div style={{ fontWeight: '600' }}>Step {progress.currentStep} of {progress.totalSteps}</div>
//                             <div style={{ fontSize: '12px', marginTop: '5px' }}>
//                                 {progress.completedSteps} steps completed
//                             </div>
//                         </div>
//                         <div style={{
//                             fontSize: '18px',
//                             fontWeight: '700',
//                             color: theme.primary
//                         }}>
//                             {progress.percentage}%
//                         </div>
//                     </div>
//                 </div>

//                 {/* Current Hint - Enhanced */}
//                 <div style={{
//                     padding: '20px',
//                     borderBottom: `1px solid ${theme.border}`,
//                     backgroundColor: getHintType(currentHint) === 'success' ? '#d1fae5' : 
//                                   getHintType(currentHint) === 'guidance' ? '#fffbeb' : 
//                                   getHintType(currentHint) === 'initial' ? '#e0f2fe' : '#f8fafc',
//                     minHeight: '120px',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     justifyContent: 'center'
//                 }}>
//                     <div style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '10px',
//                         marginBottom: '12px'
//                     }}>
//                         <div style={{
//                             fontSize: '20px'
//                         }}>
//                             {getHintIcon(currentHint)}
//                         </div>
//                         <div style={{
//                             fontSize: '12px',
//                             fontWeight: '600',
//                             color: getHintType(currentHint) === 'success' ? '#065f46' : 
//                                   getHintType(currentHint) === 'guidance' ? '#92400e' : 
//                                   getHintType(currentHint) === 'initial' ? '#0369a1' : '#64748b',
//                             textTransform: 'uppercase'
//                         }}>
//                             {getHintType(currentHint) === 'success' ? 'Progress Update' :
//                              getHintType(currentHint) === 'guidance' ? 'Guidance' :
//                              getHintType(currentHint) === 'initial' ? 'Starting Point' : 'Current Guidance'}
//                         </div>
//                     </div>
//                     <div style={{
//                         fontSize: '15px',
//                         color: getHintType(currentHint) === 'success' ? '#065f46' : 
//                               getHintType(currentHint) === 'guidance' ? '#92400e' : 
//                               getHintType(currentHint) === 'initial' ? '#0369a1' : '#1e293b',
//                         lineHeight: '1.6',
//                         fontWeight: getHintType(currentHint) === 'initial' ? '500' : '400'
//                     }}>
//                         {currentHint}
//                     </div>
//                 </div>

//                 {/* Recent Hints - Enhanced */}
//                 <div style={{
//                     flex: 1,
//                     padding: '20px',
//                     overflowY: 'auto',
//                     backgroundColor: '#fafafa'
//                 }}>
//                     <div style={{
//                         fontSize: '13px',
//                         fontWeight: '600',
//                         color: theme.textSecondary,
//                         marginBottom: '15px',
//                         textTransform: 'uppercase',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '8px'
//                     }}>
//                         <span>📋</span>
//                         <span>Recent Guidance History</span>
//                     </div>
                    
//                     {hints.length > 0 ? (
//                         <div style={{
//                             display: 'flex',
//                             flexDirection: 'column',
//                             gap: '12px'
//                         }}>
//                             {hints.slice().reverse().map((hint, index) => (
//                                 <div
//                                     key={index}
//                                     style={{
//                                         padding: '15px',
//                                         backgroundColor: 'white',
//                                         borderRadius: '10px',
//                                         border: `1px solid ${theme.border}`,
//                                         fontSize: '13px',
//                                         color: theme.textSecondary,
//                                         lineHeight: '1.5',
//                                         boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
//                                         borderLeft: `4px solid ${getHintType(hint) === 'success' ? '#10b981' : 
//                                                     getHintType(hint) === 'guidance' ? '#f59e0b' : 
//                                                     getHintType(hint) === 'initial' ? '#3b82f6' : '#94a3b8'}`
//                                     }}
//                                 >
//                                     <div style={{
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         gap: '8px',
//                                         marginBottom: '8px'
//                                     }}>
//                                         <span style={{ fontSize: '14px' }}>{getHintIcon(hint)}</span>
//                                         <span style={{
//                                             fontSize: '11px',
//                                             fontWeight: '600',
//                                             color: theme.textLight,
//                                             textTransform: 'uppercase'
//                                         }}>
//                                             Hint {hints.length - index}
//                                         </span>
//                                     </div>
//                                     {hint}
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <div style={{
//                             textAlign: 'center',
//                             padding: '30px 20px',
//                             color: theme.textLight,
//                             fontSize: '14px',
//                             backgroundColor: 'white',
//                             borderRadius: '10px',
//                             border: `1px dashed ${theme.border}`
//                         }}>
//                             <div style={{ fontSize: '32px', marginBottom: '10px' }}>💭</div>
//                             <div>Guidance will appear here</div>
//                             <div style={{ fontSize: '12px', marginTop: '8px' }}>as you interact with the patient</div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Quick Tips - Enhanced */}
//                 <div style={{
//                     padding: '18px',
//                     borderTop: `1px solid ${theme.border}`,
//                     backgroundColor: '#f0f9ff'
//                 }}>
//                     <div style={{
//                         fontSize: '13px',
//                         fontWeight: '600',
//                         color: theme.primary,
//                         marginBottom: '12px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '8px'
//                     }}>
//                         <span>🎯</span>
//                         <span>Training Strategy</span>
//                     </div>
//                     <ul style={{
//                         fontSize: '12px',
//                         color: theme.textSecondary,
//                         paddingLeft: '20px',
//                         margin: 0,
//                         lineHeight: '1.6'
//                     }}>
//                         <li><strong>Follow steps:</strong> Complete each diagnostic step in order</li>
//                         <li><strong>Ask specifically:</strong> Target questions to current step</li>
//                         <li><strong>Review hints:</strong> Guidance updates based on your questions</li>
//                         <li><strong>Take notes:</strong> Keep track of important findings</li>
//                         <li><strong>Think critically:</strong> Consider differential diagnoses</li>
//                     </ul>
//                 </div>
//             </div>

//             {/* Middle Column: Chat Interface */}
//             <div style={{
//                 flex: 1,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 backgroundColor: 'white'
//             }}>
//                 {/* Chat Header */}
//                 <div style={{
//                     padding: '20px',
//                     background: `linear-gradient(135deg, ${theme.primary} 0%, #1d4ed8 100%)`,
//                     color: 'white',
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)'
//                 }}>
//                     <div>
//                         <h2 style={{ 
//                             margin: 0, 
//                             fontSize: '20px',
//                             fontWeight: '600',
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '10px'
//                         }}>
//                             <span>🎓</span>
//                             Training Session - Patient Interview
//                         </h2>
//                         <div style={{ 
//                             fontSize: '14px',
//                             opacity: 0.9,
//                             marginTop: '8px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '15px'
//                         }}>
//                             <span>Follow the diagnostic steps to reach a conclusion</span>
//                             <span style={{
//                                 backgroundColor: 'rgba(255,255,255,0.2)',
//                                 padding: '4px 12px',
//                                 borderRadius: '20px',
//                                 fontSize: '12px',
//                                 fontWeight: '500'
//                             }}>
//                                 Step {progress.currentStep}/{progress.totalSteps}
//                             </span>
//                         </div>
//                     </div>
//                     <button
//                         onClick={() => {
//                             if (window.confirm('Are you sure you want to exit? Your progress will be saved.')) {
//                                 navigate('/');
//                             }
//                         }}
//                         style={{
//                             padding: '10px 20px',
//                             backgroundColor: 'rgba(255,255,255,0.15)',
//                             color: 'white',
//                             border: '1px solid rgba(255,255,255,0.3)',
//                             borderRadius: '8px',
//                             fontSize: '14px',
//                             fontWeight: '500',
//                             cursor: 'pointer',
//                             transition: 'background-color 0.2s',
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '8px'
//                         }}
//                         onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.25)'}
//                         onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.15)'}
//                     >
//                         <span>←</span>
//                         Exit Training
//                     </button>
//                 </div>

//                 {/* Messages Area */}
//                 <div style={{
//                     flex: 1,
//                     overflowY: 'auto',
//                     padding: '25px',
//                     backgroundColor: '#fafafa',
//                     backgroundImage: 'linear-gradient(to bottom, transparent 95%, rgba(37, 99, 235, 0.05) 100%)'
//                 }}>
//                     {messages.map((message, index) => (
//                         <div
//                             key={index}
//                             style={{
//                                 maxWidth: '75%',
//                                 marginBottom: '20px',
//                                 marginLeft: message.role === 'student' ? 'auto' : '0',
//                                 animation: 'fadeIn 0.3s ease'
//                             }}
//                         >
//                             <div style={{
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 gap: '8px',
//                                 marginBottom: '6px',
//                                 marginLeft: message.role === 'student' ? 'auto' : '0',
//                                 justifyContent: message.role === 'student' ? 'flex-end' : 'flex-start'
//                             }}>
//                                 <div style={{
//                                     width: '8px',
//                                     height: '8px',
//                                     borderRadius: '50%',
//                                     backgroundColor: getRoleColor(message.role),
//                                     opacity: 0.7
//                                 }}></div>
//                                 <div style={{
//                                     fontSize: '11px',
//                                     fontWeight: '600',
//                                     color: getRoleColor(message.role),
//                                     textTransform: 'uppercase',
//                                     letterSpacing: '0.5px'
//                                 }}>
//                                     {getRoleLabel(message.role)}
//                                 </div>
//                             </div>
//                             <div style={{
//                                 padding: '14px 18px',
//                                 backgroundColor: message.role === 'student' 
//                                     ? theme.primary 
//                                     : 'white',
//                                 color: message.role === 'student' 
//                                     ? 'white' 
//                                     : theme.textMain,
//                                 borderRadius: message.role === 'student'
//                                     ? '18px 4px 18px 18px'
//                                     : '4px 18px 18px 18px',
//                                 boxShadow: '0 3px 6px rgba(0,0,0,0.08)',
//                                 lineHeight: '1.6',
//                                 wordWrap: 'break-word',
//                                 border: message.role === 'student' ? 'none' : `1px solid ${theme.border}`,
//                                 position: 'relative'
//                             }}>
//                                 {message.text}
//                                 {message.role === 'student' && (
//                                     <div style={{
//                                         position: 'absolute',
//                                         bottom: '-10px',
//                                         right: '10px',
//                                         fontSize: '10px',
//                                         color: 'rgba(255,255,255,0.7)'
//                                     }}>
//                                         {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
                    
//                     {loading && (
//                         <div style={{ marginBottom: '20px', animation: 'fadeIn 0.3s ease' }}>
//                             <div style={{
//                                 fontSize: '11px',
//                                 fontWeight: '600',
//                                 color: theme.textSecondary,
//                                 marginBottom: '6px',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 gap: '8px'
//                             }}>
//                                 <div style={{
//                                     width: '8px',
//                                     height: '8px',
//                                     borderRadius: '50%',
//                                     backgroundColor: theme.textSecondary,
//                                     opacity: 0.7
//                                 }}></div>
//                                 Patient is thinking...
//                             </div>
//                             <div style={{
//                                 padding: '14px 18px',
//                                 backgroundColor: 'white',
//                                 borderRadius: '4px 18px 18px 18px',
//                                 width: '80px',
//                                 display: 'flex',
//                                 gap: '6px',
//                                 border: `1px solid ${theme.border}`,
//                                 boxShadow: '0 3px 6px rgba(0,0,0,0.08)'
//                             }}>
//                                 {[0, 1, 2].map(i => (
//                                     <div
//                                         key={i}
//                                         style={{
//                                             width: '10px',
//                                             height: '10px',
//                                             backgroundColor: theme.primary,
//                                             borderRadius: '50%',
//                                             animation: `bounce 1.4s infinite ${i * 0.2}s`,
//                                             opacity: 0.7
//                                         }}
//                                     ></div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
                    
//                     <div ref={messagesEndRef} />
                    
//                     <style>{`
//                         @keyframes fadeIn {
//                             from { opacity: 0; transform: translateY(10px); }
//                             to { opacity: 1; transform: translateY(0); }
//                         }
//                         @keyframes bounce {
//                             0%, 60%, 100% { transform: translateY(0); }
//                             30% { transform: translateY(-8px); }
//                         }
//                     `}</style>
//                 </div>

//                 {/* Input Area */}
//                 <div style={{
//                     padding: '20px',
//                     borderTop: `1px solid ${theme.border}`,
//                     backgroundColor: 'white',
//                     boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
//                 }}>
//                     <div style={{
//                         display: 'flex',
//                         gap: '12px',
//                         alignItems: 'flex-end'
//                     }}>
//                         <div style={{ flex: 1, position: 'relative' }}>
//                             <textarea
//                                 value={input}
//                                 onChange={(e) => setInput(e.target.value)}
//                                 onKeyPress={handleKeyPress}
//                                 placeholder={`Ask a clinical question for step ${progress.currentStep}...`}
//                                 style={{
//                                     width: '100%',
//                                     padding: '16px 20px',
//                                     border: `2px solid ${theme.border}`,
//                                     borderRadius: '14px',
//                                     fontSize: '15px',
//                                     resize: 'none',
//                                     minHeight: '70px',
//                                     maxHeight: '140px',
//                                     fontFamily: 'Inter, sans-serif',
//                                     outline: 'none',
//                                     transition: 'all 0.2s',
//                                     backgroundColor: '#fafafa'
//                                 }}
//                                 disabled={loading}
//                                 onFocus={(e) => e.target.style.borderColor = theme.primary}
//                                 onBlur={(e) => e.target.style.borderColor = theme.border}
//                             />
//                             <div style={{
//                                 position: 'absolute',
//                                 right: '15px',
//                                 bottom: '15px',
//                                 fontSize: '11px',
//                                 color: theme.textLight,
//                                 backgroundColor: 'rgba(255,255,255,0.9)',
//                                 padding: '2px 6px',
//                                 borderRadius: '4px',
//                                 fontWeight: '500'
//                             }}>
//                                 Enter to send
//                             </div>
//                         </div>
//                         <button
//                             onClick={handleSend}
//                             disabled={!input.trim() || loading}
//                             style={{
//                                 padding: '16px 28px',
//                                 background: input.trim() && !loading 
//                                     ? `linear-gradient(135deg, ${theme.primary} 0%, #1d4ed8 100%)`
//                                     : theme.border,
//                                 color: 'white',
//                                 border: 'none',
//                                 borderRadius: '14px',
//                                 fontSize: '15px',
//                                 fontWeight: '600',
//                                 cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
//                                 transition: 'all 0.2s',
//                                 whiteSpace: 'nowrap',
//                                 boxShadow: input.trim() && !loading ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 gap: '10px'
//                             }}
//                             onMouseOver={(e) => {
//                                 if (input.trim() && !loading) {
//                                     e.target.style.transform = 'translateY(-2px)';
//                                     e.target.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
//                                 }
//                             }}
//                             onMouseOut={(e) => {
//                                 if (input.trim() && !loading) {
//                                     e.target.style.transform = 'translateY(0)';
//                                     e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
//                                 }
//                             }}
//                         >
//                             {loading ? (
//                                 <>
//                                     <div style={{
//                                         width: '16px',
//                                         height: '16px',
//                                         border: '2px solid rgba(255,255,255,0.3)',
//                                         borderTopColor: 'white',
//                                         borderRadius: '50%',
//                                         animation: 'spin 0.8s linear infinite'
//                                     }}></div>
//                                     Sending...
//                                 </>
//                             ) : (
//                                 <>
//                                     <span>📤</span>
//                                     Send Question
//                                 </>
//                             )}
//                         </button>
//                     </div>
//                     <div style={{
//                         fontSize: '12px',
//                         color: theme.textLight,
//                         marginTop: '12px',
//                         textAlign: 'center',
//                         display: 'flex',
//                         justifyContent: 'center',
//                         gap: '20px'
//                     }}>
//                         <span>Tip: Ask specific questions related to current diagnostic step</span>
//                         <span>•</span>
//                         <span>Press Shift+Enter for new line</span>
//                     </div>
//                 </div>
//             </div>

//             {/* Right Column: Final Assessment */}
//             <div style={{
//                 width: '380px',
//                 backgroundColor: 'white',
//                 borderLeft: `1px solid ${theme.border}`,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 boxShadow: '-2px 0 10px rgba(0,0,0,0.05)'
//             }}>
//                 {/* Assessment Header */}
//                 <div style={{
//                     padding: '25px',
//                     background: `linear-gradient(135deg, #10b981 0%, #059669 100%)`,
//                     color: 'white',
//                     textAlign: 'center'
//                 }}>
//                     <h3 style={{ 
//                         margin: 0,
//                         fontSize: '20px',
//                         fontWeight: '600',
//                         marginBottom: '8px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         gap: '10px'
//                     }}>
//                         <span>🏁</span>
//                         Final Assessment
//                     </h3>
//                     <div style={{
//                         fontSize: '14px',
//                         opacity: 0.9
//                     }}>
//                         Submit your diagnosis and treatment plan
//                     </div>
//                 </div>

//                 {/* Assessment Form */}
//                 <div style={{
//                     flex: 1,
//                     padding: '25px',
//                     overflowY: 'auto',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     gap: '20px',
//                     backgroundColor: '#fafafa'
//                 }}>
//                     <div>
//                         <label style={{
//                             display: 'block',
//                             fontSize: '15px',
//                             fontWeight: '600',
//                             color: theme.textMain,
//                             marginBottom: '12px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '8px'
//                         }}>
//                             <span style={{
//                                 backgroundColor: theme.primary,
//                                 color: 'white',
//                                 width: '24px',
//                                 height: '24px',
//                                 borderRadius: '50%',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 fontSize: '12px'
//                             }}>1</span>
//                             Your Diagnosis
//                         </label>
//                         <textarea
//                             value={diagnosis}
//                             onChange={(e) => setDiagnosis(e.target.value)}
//                             placeholder="Based on the patient interview, what is your final diagnosis?"
//                             style={{
//                                 width: '100%',
//                                 padding: '16px',
//                                 border: `2px solid ${theme.border}`,
//                                 borderRadius: '10px',
//                                 fontSize: '14px',
//                                 minHeight: '100px',
//                                 resize: 'vertical',
//                                 fontFamily: 'Inter, sans-serif',
//                                 outline: 'none',
//                                 transition: 'border-color 0.2s',
//                                 backgroundColor: 'white'
//                             }}
//                             onFocus={(e) => e.target.style.borderColor = theme.primary}
//                             onBlur={(e) => e.target.style.borderColor = theme.border}
//                         />
//                         <div style={{
//                             fontSize: '12px',
//                             color: theme.textLight,
//                             marginTop: '8px',
//                             paddingLeft: '32px'
//                         }}>
//                             Be specific and include the primary condition
//                         </div>
//                     </div>

//                     <div>
//                         <label style={{
//                             display: 'block',
//                             fontSize: '15px',
//                             fontWeight: '600',
//                             color: theme.textMain,
//                             marginBottom: '12px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '8px'
//                         }}>
//                             <span style={{
//                                 backgroundColor: '#10b981',
//                                 color: 'white',
//                                 width: '24px',
//                                 height: '24px',
//                                 borderRadius: '50%',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 fontSize: '12px'
//                             }}>2</span>
//                             Prescription & Dosage
//                         </label>
//                         <textarea
//                             value={prescription}
//                             onChange={(e) => setPrescription(e.target.value)}
//                             placeholder="Medication name, dosage, frequency, and duration"
//                             style={{
//                                 width: '100%',
//                                 padding: '16px',
//                                 border: `2px solid ${theme.border}`,
//                                 borderRadius: '10px',
//                                 fontSize: '14px',
//                                 minHeight: '80px',
//                                 resize: 'vertical',
//                                 fontFamily: 'Inter, sans-serif',
//                                 outline: 'none',
//                                 transition: 'border-color 0.2s',
//                                 backgroundColor: 'white'
//                             }}
//                             onFocus={(e) => e.target.style.borderColor = '#10b981'}
//                             onBlur={(e) => e.target.style.borderColor = theme.border}
//                         />
//                         <div style={{
//                             fontSize: '12px',
//                             color: theme.textLight,
//                             marginTop: '8px',
//                             paddingLeft: '32px'
//                         }}>
//                             Example: "Amoxicillin 500mg three times daily for 7 days"
//                         </div>
//                     </div>

//                     <div>
//                         <label style={{
//                             display: 'block',
//                             fontSize: '15px',
//                             fontWeight: '600',
//                             color: theme.textMain,
//                             marginBottom: '12px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '8px'
//                         }}>
//                             <span style={{
//                                 backgroundColor: '#8b5cf6',
//                                 color: 'white',
//                                 width: '24px',
//                                 height: '24px',
//                                 borderRadius: '50%',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 fontSize: '12px'
//                             }}>3</span>
//                             Additional Instructions (Optional)
//                         </label>
//                         <textarea
//                             value={instructions}
//                             onChange={(e) => setInstructions(e.target.value)}
//                             placeholder="Follow-up instructions, lifestyle modifications, precautions..."
//                             style={{
//                                 width: '100%',
//                                 padding: '16px',
//                                 border: `2px solid ${theme.border}`,
//                                 borderRadius: '10px',
//                                 fontSize: '14px',
//                                 minHeight: '70px',
//                                 resize: 'vertical',
//                                 fontFamily: 'Inter, sans-serif',
//                                 outline: 'none',
//                                 transition: 'border-color 0.2s',
//                                 backgroundColor: 'white'
//                             }}
//                             onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
//                             onBlur={(e) => e.target.style.borderColor = theme.border}
//                         />
//                     </div>

//                     {/* Progress Summary */}
//                     <div style={{
//                         backgroundColor: 'white',
//                         padding: '20px',
//                         borderRadius: '12px',
//                         border: `2px solid ${theme.border}`,
//                         marginTop: '10px'
//                     }}>
//                         <div style={{
//                             fontSize: '14px',
//                             fontWeight: '600',
//                             color: theme.textMain,
//                             marginBottom: '15px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '10px'
//                         }}>
//                             <span>📊</span>
//                             Current Progress Summary
//                         </div>
//                         <div style={{
//                             display: 'grid',
//                             gridTemplateColumns: '1fr 1fr',
//                             gap: '15px',
//                             marginBottom: '15px'
//                         }}>
//                             <div style={{
//                                 textAlign: 'center',
//                                 padding: '12px',
//                                 backgroundColor: '#f0f9ff',
//                                 borderRadius: '8px'
//                             }}>
//                                 <div style={{
//                                     fontSize: '20px',
//                                     fontWeight: '700',
//                                     color: theme.primary
//                                 }}>
//                                     {progress.completedSteps}
//                                 </div>
//                                 <div style={{
//                                     fontSize: '11px',
//                                     color: theme.textSecondary,
//                                     marginTop: '4px',
//                                     fontWeight: '600'
//                                 }}>
//                                     Steps Completed
//                                 </div>
//                             </div>
//                             <div style={{
//                                 textAlign: 'center',
//                                 padding: '12px',
//                                 backgroundColor: '#f0fdf4',
//                                 borderRadius: '8px'
//                             }}>
//                                 <div style={{
//                                     fontSize: '20px',
//                                     fontWeight: '700',
//                                     color: '#10b981'
//                                 }}>
//                                     {progress.totalSteps - progress.completedSteps}
//                                 </div>
//                                 <div style={{
//                                     fontSize: '11px',
//                                     color: theme.textSecondary,
//                                     marginTop: '4px',
//                                     fontWeight: '600'
//                                 }}>
//                                     Steps Remaining
//                                 </div>
//                             </div>
//                         </div>
//                         <div style={{
//                             fontSize: '12px',
//                             color: theme.textSecondary,
//                             textAlign: 'center',
//                             lineHeight: '1.5'
//                         }}>
//                             Complete all diagnostic steps before submitting for best results
//                         </div>
//                     </div>
//                 </div>

//                 {/* Submit Button */}
//                 <div style={{
//                     padding: '25px',
//                     borderTop: `1px solid ${theme.border}`,
//                     backgroundColor: 'white',
//                     boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
//                 }}>
//                     <button
//                         onClick={handleSubmit}
//                         disabled={!diagnosis.trim() || !prescription.trim()}
//                         style={{
//                             width: '100%',
//                             padding: '18px',
//                             background: !diagnosis.trim() || !prescription.trim()
//                                 ? theme.border
//                                 : `linear-gradient(135deg, #10b981 0%, #059669 100%)`,
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '12px',
//                             fontSize: '16px',
//                             fontWeight: '600',
//                             cursor: !diagnosis.trim() || !prescription.trim()
//                                 ? 'not-allowed'
//                                 : 'pointer',
//                             transition: 'all 0.2s',
//                             boxShadow: !diagnosis.trim() || !prescription.trim()
//                                 ? 'none'
//                                 : '0 4px 15px rgba(16, 185, 129, 0.3)',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             gap: '12px'
//                         }}
//                         onMouseOver={(e) => {
//                             if (diagnosis.trim() && prescription.trim()) {
//                                 e.target.style.transform = 'translateY(-2px)';
//                                 e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
//                             }
//                         }}
//                         onMouseOut={(e) => {
//                             if (diagnosis.trim() && prescription.trim()) {
//                                 e.target.style.transform = 'translateY(0)';
//                                 e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
//                             }
//                         }}
//                     >
//                         <span>📝</span>
//                         Submit Final Assessment
//                     </button>
//                     <div style={{
//                         fontSize: '12px',
//                         color: theme.textLight,
//                         marginTop: '15px',
//                         textAlign: 'center',
//                         lineHeight: '1.6'
//                     }}>
//                         You'll receive detailed feedback on your diagnosis,<br/>
//                         prescription, and diagnostic reasoning process
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TrainingChatInterface;