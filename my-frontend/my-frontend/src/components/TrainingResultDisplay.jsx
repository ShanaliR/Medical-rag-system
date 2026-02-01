// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { MedicalTheme as theme } from '../theme';
// import Card from './Card';
// import Button from './Button';

// const TrainingResultDisplay = () => {
//     const { state } = useLocation();
//     const navigate = useNavigate();
    
//     const { evaluation, progress } = state;

//     const formatFeedback = (feedback) => {
//         return feedback.split('\n').map((line, index) => {
//             if (line.startsWith('✅') || line.startsWith('🎉')) {
//                 return <div key={index} style={{
//                     color: '#10b981',
//                     fontWeight: '600',
//                     marginBottom: '10px',
//                     fontSize: '16px'
//                 }}>{line}</div>;
//             }
//             if (line.startsWith('❌') || line.startsWith('📚')) {
//                 return <div key={index} style={{
//                     color: '#ef4444',
//                     fontWeight: '600',
//                     marginBottom: '10px',
//                     fontSize: '16px'
//                 }}>{line}</div>;
//             }
//             if (line.startsWith('•') || line.startsWith('✓')) {
//                 return <div key={index} style={{
//                     paddingLeft: '20px',
//                     marginBottom: '8px',
//                     color: theme.textSecondary
//                 }}>{line}</div>;
//             }
//             if (line.startsWith('**') && line.endsWith('**')) {
//                 return <div key={index} style={{
//                     fontWeight: '600',
//                     color: theme.textMain,
//                     marginTop: '15px',
//                     marginBottom: '5px'
//                 }}>{line.replace(/\*\*/g, '')}</div>;
//             }
//             return <div key={index} style={{ marginBottom: '10px' }}>{line}</div>;
//         });
//     };

//     return (
//         <div style={{
//             minHeight: '100vh',
//             backgroundColor: theme.bg,
//             padding: '40px 20px',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center'
//         }}>
//             <Card 
//                 title="Training Session Results"
//                 subtitle="Review your diagnostic performance and learning outcomes"
//                 className="max-w-4xl w-full"
//             >
//                 {/* Result Header */}
//                 <div style={{
//                     padding: '20px',
//                     backgroundColor: evaluation.isCorrect ? '#d1fae5' : '#fee2e2',
//                     borderRadius: '12px',
//                     marginBottom: '30px',
//                     textAlign: 'center'
//                 }}>
//                     <div style={{
//                         fontSize: '24px',
//                         fontWeight: '700',
//                         color: evaluation.isCorrect ? '#065f46' : '#991b1b',
//                         marginBottom: '10px'
//                     }}>
//                         {evaluation.isCorrect ? 'Excellent Performance!' : 'Learning Opportunity'}
//                     </div>
//                     <div style={{
//                         fontSize: '16px',
//                         color: evaluation.isCorrect ? '#047857' : '#dc2626'
//                     }}>
//                         {evaluation.isCorrect 
//                             ? 'You successfully diagnosed and treated the patient.' 
//                             : 'Review the feedback to improve your diagnostic skills.'}
//                     </div>
//                 </div>

//                 {/* Two Column Layout */}
//                 <div style={{
//                     display: 'grid',
//                     gridTemplateColumns: '1fr 1fr',
//                     gap: '30px',
//                     marginBottom: '30px'
//                 }}>
//                     {/* Left Column: Performance Metrics */}
//                     <div>
//                         <h3 style={{
//                             color: theme.textMain,
//                             fontSize: '18px',
//                             marginBottom: '20px',
//                             paddingBottom: '10px',
//                             borderBottom: `2px solid ${theme.border}`
//                         }}>
//                             Performance Metrics
//                         </h3>
                        
//                         <div style={{
//                             backgroundColor: '#f8fafc',
//                             padding: '20px',
//                             borderRadius: '12px'
//                         }}>
//                             <div style={{
//                                 display: 'flex',
//                                 justifyContent: 'space-between',
//                                 alignItems: 'center',
//                                 marginBottom: '15px'
//                             }}>
//                                 <div>
//                                     <div style={{
//                                         fontSize: '14px',
//                                         color: theme.textSecondary
//                                     }}>
//                                         Diagnostic Accuracy
//                                     </div>
//                                     <div style={{
//                                         fontSize: '32px',
//                                         fontWeight: '700',
//                                         color: evaluation.isCorrect ? '#10b981' : '#ef4444'
//                                     }}>
//                                         {evaluation.diagnosticProgress?.accuracy || 0}%
//                                     </div>
//                                 </div>
//                                 <div style={{
//                                     width: '80px',
//                                     height: '80px',
//                                     borderRadius: '50%',
//                                     border: `8px solid ${evaluation.isCorrect ? '#d1fae5' : '#fee2e2'}`,
//                                     borderTopColor: evaluation.isCorrect ? '#10b981' : '#ef4444',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'center'
//                                 }}>
//                                     <span style={{
//                                         fontSize: '16px',
//                                         fontWeight: '600',
//                                         color: theme.textMain
//                                     }}>
//                                         {evaluation.diagnosticProgress?.accuracy || 0}%
//                                     </span>
//                                 </div>
//                             </div>
                            
//                             <div style={{
//                                 display: 'grid',
//                                 gridTemplateColumns: '1fr 1fr',
//                                 gap: '15px',
//                                 marginTop: '20px'
//                             }}>
//                                 <div style={{
//                                     textAlign: 'center',
//                                     padding: '15px',
//                                     backgroundColor: 'white',
//                                     borderRadius: '8px',
//                                     border: `1px solid ${theme.border}`
//                                 }}>
//                                     <div style={{
//                                         fontSize: '24px',
//                                         fontWeight: '700',
//                                         color: theme.primary
//                                     }}>
//                                         {evaluation.diagnosticProgress?.completed || 0}
//                                     </div>
//                                     <div style={{
//                                         fontSize: '12px',
//                                         color: theme.textSecondary,
//                                         marginTop: '5px'
//                                     }}>
//                                         Steps Completed
//                                     </div>
//                                 </div>
                                
//                                 <div style={{
//                                     textAlign: 'center',
//                                     padding: '15px',
//                                     backgroundColor: 'white',
//                                     borderRadius: '8px',
//                                     border: `1px solid ${theme.border}`
//                                 }}>
//                                     <div style={{
//                                         fontSize: '24px',
//                                         fontWeight: '700',
//                                         color: theme.textMain
//                                     }}>
//                                         {evaluation.diagnosticProgress?.total || 0}
//                                     </div>
//                                     <div style={{
//                                         fontSize: '12px',
//                                         color: theme.textSecondary,
//                                         marginTop: '5px'
//                                     }}>
//                                         Total Steps
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
                        
//                         {!evaluation.isCorrect && evaluation.correctAnswer && (
//                             <div style={{
//                                 marginTop: '20px',
//                                 backgroundColor: '#fef3c7',
//                                 padding: '15px',
//                                 borderRadius: '8px',
//                                 border: `1px solid #f59e0b`
//                             }}>
//                                 <div style={{
//                                     fontSize: '14px',
//                                     fontWeight: '600',
//                                     color: '#92400e',
//                                     marginBottom: '10px'
//                                 }}>
//                                     Correct Answer
//                                 </div>
//                                 <div style={{ fontSize: '13px', color: '#92400e' }}>
//                                     <div><strong>Diagnosis:</strong> {evaluation.correctAnswer.diagnosis}</div>
//                                     <div style={{ marginTop: '5px' }}>
//                                         <strong>Prescription:</strong> {evaluation.correctAnswer.prescription.medication} ({evaluation.correctAnswer.prescription.dosage})
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Right Column: Detailed Feedback */}
//                     <div>
//                         <h3 style={{
//                             color: theme.textMain,
//                             fontSize: '18px',
//                             marginBottom: '20px',
//                             paddingBottom: '10px',
//                             borderBottom: `2px solid ${theme.border}`
//                         }}>
//                             Detailed Feedback
//                         </h3>
                        
//                         <div style={{
//                             backgroundColor: 'white',
//                             padding: '20px',
//                             borderRadius: '12px',
//                             border: `1px solid ${theme.border}`,
//                             maxHeight: '400px',
//                             overflowY: 'auto',
//                             lineHeight: '1.6'
//                         }}>
//                             {formatFeedback(evaluation.feedback)}
//                         </div>
                        
//                         <div style={{
//                             marginTop: '20px',
//                             backgroundColor: '#e0f2fe',
//                             padding: '15px',
//                             borderRadius: '8px',
//                             border: `1px solid ${theme.primary}40`
//                         }}>
//                             <div style={{
//                                 fontSize: '14px',
//                                 fontWeight: '600',
//                                 color: theme.primary,
//                                 marginBottom: '8px'
//                             }}>
//                                 💡 Learning Recommendations
//                             </div>
//                             <ul style={{
//                                 fontSize: '13px',
//                                 color: theme.textSecondary,
//                                 paddingLeft: '20px',
//                                 margin: 0,
//                                 lineHeight: '1.5'
//                             }}>
//                                 <li>Review the diagnostic steps you missed</li>
//                                 <li>Practice asking more specific questions</li>
//                                 <li>Consider differential diagnoses</li>
//                                 <li>Try the quiz mode to test your skills</li>
//                             </ul>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div style={{
//                     display: 'flex',
//                     gap: '15px',
//                     marginTop: '30px',
//                     paddingTop: '20px',
//                     borderTop: `1px solid ${theme.border}`
//                 }}>
//                     <Button
//                         onClick={() => navigate('/')}
//                         variant="outline"
//                         style={{ flex: 1 }}
//                     >
//                         Return to Dashboard
//                     </Button>
                    
//                     <Button
//                         onClick={() => navigate('/setup-training')}
//                         variant="primary"
//                         style={{ flex: 1 }}
//                     >
//                         Try Another Training Case
//                     </Button>
                    
//                     <Button
//                         onClick={() => navigate('/setup', { state: { mode: 'quiz' } })}
//                         variant="secondary"
//                         style={{ flex: 1 }}
//                     >
//                         Test in Quiz Mode
//                     </Button>
//                 </div>
//             </Card>
//         </div>
//     );
// };

// export default TrainingResultDisplay;