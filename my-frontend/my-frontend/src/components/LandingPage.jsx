// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { MedicalTheme as theme } from '../theme';
// import Card from './Card';
// import Button from './Button';

// const LandingPage = () => {
//     const navigate = useNavigate();

//     return (
//         <div style={{
//             minHeight: '100vh',
//             backgroundColor: theme.bg,
//             padding: '40px 20px',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontFamily: 'Inter, sans-serif'
//         }}>
//             {/* Admin Button */}
//             <Button
//                 onClick={() => navigate('/admin')}
//                 variant="admin"
//                 style={{
//                     position: 'absolute',
//                     top: '20px',
//                     right: '20px'
//                 }}
//             >
//                 Admin Portal
//             </Button>

//             <Card 
//                 title="MED-SIM: Clinical Reasoning AI Simulator"
//                 subtitle="Advanced AI-powered medical diagnosis training system"
//                 className="max-w-2xl text-center"
//             >
//                 <div style={{
//                     fontSize: '16px',
//                     color: theme.textSecondary,
//                     lineHeight: '1.6',
//                     marginBottom: '40px'
//                 }}>
//                     <p>
//                         An AI simulator using fine-tuned clinical models with pin point precision, 
//                         scenario-based training that evaluates the entire diagnostic process.
//                     </p>
//                     <p style={{ marginTop: '10px' }}>
//                         Eliminates physical work load and teaches proper clinical reasoning through 
//                         interactive patient role-play.
//                     </p>
//                 </div>

//                 <div style={{
//                     display: 'grid',
//                     gridTemplateColumns: '1fr 1fr',
//                     gap: '20px',
//                     marginBottom: '30px'
//                 }}>
//                     {/* Training Mode Card */}
//                     <div style={{
//                         padding: '25px',
//                         backgroundColor: '#f0f9ff',
//                         borderRadius: '12px',
//                         border: `2px solid ${theme.primary}`,
//                         textAlign: 'center',
//                         transition: 'transform 0.2s',
//                         cursor: 'pointer',
//                         ':hover': {
//                             transform: 'translateY(-5px)'
//                         }
//                     }}
//                     onClick={() => navigate('/setup-training')}
//                     >
//                         <div style={{
//                             fontSize: '48px',
//                             marginBottom: '15px'
//                         }}>
//                             🎓
//                         </div>
//                         <h3 style={{
//                             color: theme.primary,
//                             fontSize: '18px',
//                             fontWeight: '600',
//                             marginBottom: '10px'
//                         }}>
//                             Training Mode
//                         </h3>
//                         <ul style={{
//                             fontSize: '13px',
//                             color: theme.textSecondary,
//                             textAlign: 'left',
//                             paddingLeft: '20px',
//                             margin: 0,
//                             lineHeight: '1.5'
//                         }}>
//                             <li>Step-by-step guidance</li>
//                             <li>Real-time hints and tips</li>
//                             <li>Progress tracking</li>
//                             <li>Detailed feedback</li>
//                         </ul>
//                         <Button
//                             onClick={() => navigate('/setup-training')}
//                             variant="primary"
//                             style={{ marginTop: '20px', width: '100%' }}
//                         >
//                             Start Training
//                         </Button>
//                     </div>

//                     {/* Quiz Mode Card */}
//                     <div style={{
//                         padding: '25px',
//                         backgroundColor: '#f0fdf4',
//                         borderRadius: '12px',
//                         border: `2px solid ${theme.success}`,
//                         textAlign: 'center',
//                         transition: 'transform 0.2s',
//                         cursor: 'pointer',
//                         ':hover': {
//                             transform: 'translateY(-5px)'
//                         }
//                     }}
//                     onClick={() => navigate('/setup', { state: { mode: 'quiz' } })}
//                     >
//                         <div style={{
//                             fontSize: '48px',
//                             marginBottom: '15px'
//                         }}>
//                             📝
//                         </div>
//                         <h3 style={{
//                             color: theme.success,
//                             fontSize: '18px',
//                             fontWeight: '600',
//                             marginBottom: '10px'
//                         }}>
//                             Quiz Mode
//                         </h3>
//                         <ul style={{
//                             fontSize: '13px',
//                             color: theme.textSecondary,
//                             textAlign: 'left',
//                             paddingLeft: '20px',
//                             margin: 0,
//                             lineHeight: '1.5'
//                         }}>
//                             <li>No hints or guidance</li>
//                             <li>Assessment of skills</li>
//                             <li>Performance evaluation</li>
//                             <li>Final score</li>
//                         </ul>
//                         <Button
//                             onClick={() => navigate('/setup', { state: { mode: 'quiz' } })}
//                             variant="secondary"
//                             style={{ marginTop: '20px', width: '100%' }}
//                         >
//                             Start Quiz
//                         </Button>
//                     </div>
//                 </div>

//                 <div style={{
//                     backgroundColor: '#f8fafc',
//                     padding: '20px',
//                     borderRadius: '12px',
//                     marginTop: '30px',
//                     border: `1px solid ${theme.border}`
//                 }}>
//                     <div style={{
//                         fontSize: '14px',
//                         fontWeight: '600',
//                         color: theme.textMain,
//                         marginBottom: '10px',
//                         textAlign: 'center'
//                     }}>
//                         System Features
//                     </div>
//                     <div style={{
//                         display: 'grid',
//                         gridTemplateColumns: 'repeat(3, 1fr)',
//                         gap: '15px',
//                         fontSize: '12px',
//                         color: theme.textSecondary
//                     }}>
//                         <div style={{ textAlign: 'center' }}>
//                             <div style={{ fontSize: '20px' }}>🤖</div>
//                             <div>AI Patient Simulation</div>
//                         </div>
//                         <div style={{ textAlign: 'center' }}>
//                             <div style={{ fontSize: '20px' }}>🔍</div>
//                             <div>Pin point Accuracy</div>
//                         </div>
//                         <div style={{ textAlign: 'center' }}>
//                             <div style={{ fontSize: '20px' }}>📊</div>
//                             <div>Progress Tracking</div>
//                         </div>
//                         <div style={{ textAlign: 'center' }}>
//                             <div style={{ fontSize: '20px' }}>💊</div>
//                             <div>Treatment Planning</div>
//                         </div>
//                         <div style={{ textAlign: 'center' }}>
//                             <div style={{ fontSize: '20px' }}>🎯</div>
//                             <div>Step-by-Step Guidance</div>
//                         </div>
//                         <div style={{ textAlign: 'center' }}>
//                             <div style={{ fontSize: '20px' }}>📈</div>
//                             <div>Performance Analytics</div>
//                         </div>
//                     </div>
//                 </div>
//             </Card>
//         </div>
//     );
// };

// export default LandingPage;