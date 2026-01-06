import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MedicalTheme as theme } from '../theme';
import Card from './Card';
import Button from './Button';

const ResultDisplay = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { evaluation, timeSpent } = state;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const calculateScore = () => {
        // Simple scoring logic - can be enhanced
        const baseScore = evaluation.isCorrect ? 100 : 60;
        const timeBonus = timeSpent < 300 ? 20 : timeSpent < 600 ? 10 : 0; // Bonus for speed
        const questionPenalty = evaluation.questions ? Math.max(0, 100 - evaluation.questions * 2) : 0;
        
        return Math.min(100, Math.max(0, baseScore + timeBonus - questionPenalty));
    };

    const score = calculateScore();
    const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';

    const formatFeedback = (feedback) => {
        return feedback.split('\n').map((line, index) => {
            if (line.startsWith('✅') || line.includes('Correct!')) {
                return <div key={index} style={{
                    color: '#059669',
                    fontWeight: '600',
                    marginBottom: '12px',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '20px' }}>✅</span>
                    {line.replace('✅', '')}
                </div>;
            }
            if (line.startsWith('❌') || line.includes('Incorrect')) {
                return <div key={index} style={{
                    color: '#dc2626',
                    fontWeight: '600',
                    marginBottom: '12px',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '20px' }}>❌</span>
                    {line.replace('❌', '')}
                </div>;
            }
            if (line.startsWith('###')) {
                return <div key={index} style={{
                    fontWeight: '700',
                    color: theme.textMain,
                    marginTop: '20px',
                    marginBottom: '10px',
                    fontSize: '15px',
                    paddingBottom: '8px',
                    borderBottom: `2px solid ${theme.border}`
                }}>{line.replace('###', '')}</div>;
            }
            if (line.startsWith('**') && line.endsWith('**')) {
                return <div key={index} style={{
                    fontWeight: '600',
                    color: theme.textMain,
                    marginTop: '15px',
                    marginBottom: '8px',
                    fontSize: '14px'
                }}>{line.replace(/\*\*/g, '')}</div>;
            }
            if (line.startsWith('* ') || line.startsWith('•')) {
                return <div key={index} style={{
                    paddingLeft: '24px',
                    marginBottom: '8px',
                    color: theme.textSecondary,
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        left: '8px',
                        top: '8px',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: theme.primary
                    }}></div>
                    {line.replace('* ', '').replace('•', '')}
                </div>;
            }
            return <div key={index} style={{ marginBottom: '12px', lineHeight: '1.6' }}>{line}</div>;
        });
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: theme.bg,
            padding: '40px 20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: evaluation.isCorrect 
                ? 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 50%, #f0fdf4 100%)'
                : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 50%, #fef2f2 100%)'
        }}>
            <Card 
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: evaluation.isCorrect 
                                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            fontWeight: '700',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                        }}>
                            {grade}
                        </div>
                        <div>
                            <div style={{ fontSize: '28px', fontWeight: '800', color: theme.textMain }}>
                                Quiz Assessment Results
                            </div>
                            <div style={{ fontSize: '16px', color: theme.textSecondary, marginTop: '6px' }}>
                                {evaluation.isCorrect ? 'Excellent performance!' : 'Learning opportunity identified'}
                            </div>
                        </div>
                    </div>
                }
                className="max-w-5xl w-full"
                style={{
                    border: `3px solid ${evaluation.isCorrect ? '#10b981' : '#dc2626'}`,
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
                }}
            >
                {/* Result Summary Banner */}
                <div style={{
                    padding: '30px',
                    backgroundColor: evaluation.isCorrect ? '#d1fae5' : '#fee2e2',
                    borderRadius: '15px',
                    marginBottom: '30px',
                    textAlign: 'center',
                    border: `2px solid ${evaluation.isCorrect ? '#10b981' : '#dc2626'}`,
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {evaluation.isCorrect && (
                        <div style={{
                            position: 'absolute',
                            top: '-50px',
                            right: '-50px',
                            fontSize: '150px',
                            color: 'rgba(16, 185, 129, 0.1)',
                            transform: 'rotate(15deg)'
                        }}>🏆</div>
                    )}
                    <div style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        color: evaluation.isCorrect ? '#065f46' : '#991b1b',
                        marginBottom: '15px',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {evaluation.isCorrect ? 'Congratulations! 🎉' : 'Review Required 📚'}
                    </div>
                    <div style={{
                        fontSize: '18px',
                        color: evaluation.isCorrect ? '#047857' : '#dc2626',
                        lineHeight: '1.6',
                        maxWidth: '600px',
                        margin: '0 auto',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {evaluation.isCorrect 
                            ? 'You successfully diagnosed the patient with accurate treatment.' 
                            : 'Your diagnosis needs improvement. Review the feedback below.'}
                    </div>
                </div>

                {/* Three Column Layout */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '25px',
                    marginBottom: '35px'
                }}>
                    {/* Column 1: Performance Metrics */}
                    <div>
                        <h3 style={{
                            color: theme.textMain,
                            fontSize: '18px',
                            fontWeight: '700',
                            marginBottom: '20px',
                            paddingBottom: '15px',
                            borderBottom: `3px solid ${theme.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <span style={{
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px'
                            }}>📊</span>
                            Performance Metrics
                        </h3>
                        
                        <div style={{
                            backgroundColor: '#f8fafc',
                            padding: '25px',
                            borderRadius: '15px',
                            border: `2px solid ${theme.border}`
                        }}>
                            {/* Score Circle */}
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                background: evaluation.isCorrect 
                                    ? 'conic-gradient(#10b981 0% ' + score + '%, #e2e8f0 ' + score + '% 100%)'
                                    : 'conic-gradient(#dc2626 0% ' + score + '%, #e2e8f0 ' + score + '% 100%)',
                                margin: '0 auto 25px auto',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    width: '90px',
                                    height: '90px',
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{
                                        fontSize: '28px',
                                        fontWeight: '800',
                                        color: evaluation.isCorrect ? '#10b981' : '#dc2626'
                                    }}>
                                        {score}
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: theme.textLight,
                                        fontWeight: '600'
                                    }}>
                                        SCORE
                                    </div>
                                </div>
                            </div>
                            
                            {/* Stats Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '15px'
                            }}>
                                <div style={{
                                    textAlign: 'center',
                                    padding: '15px',
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    border: `1px solid ${theme.border}`,
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{
                                        fontSize: '22px',
                                        fontWeight: '800',
                                        color: '#059669'
                                    }}>
                                        {formatTime(timeSpent || 0)}
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: theme.textSecondary,
                                        marginTop: '6px',
                                        fontWeight: '600'
                                    }}>
                                        Time Spent
                                    </div>
                                </div>
                                
                                <div style={{
                                    textAlign: 'center',
                                    padding: '15px',
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    border: `1px solid ${theme.border}`,
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{
                                        fontSize: '22px',
                                        fontWeight: '800',
                                        color: '#8b5cf6'
                                    }}>
                                        {grade}
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: theme.textSecondary,
                                        marginTop: '6px',
                                        fontWeight: '600'
                                    }}>
                                        Grade
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Detailed Feedback */}
                    <div>
                        <h3 style={{
                            color: theme.textMain,
                            fontSize: '18px',
                            fontWeight: '700',
                            marginBottom: '20px',
                            paddingBottom: '15px',
                            borderBottom: `3px solid ${theme.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <span style={{
                                backgroundColor: '#8b5cf6',
                                color: 'white',
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px'
                            }}>📋</span>
                            Assessment Feedback
                        </h3>
                        
                        <div style={{
                            backgroundColor: 'white',
                            padding: '25px',
                            borderRadius: '15px',
                            border: `2px solid ${theme.border}`,
                            height: '400px',
                            overflowY: 'auto',
                            lineHeight: '1.6'
                        }}>
                            {formatFeedback(evaluation.feedback)}
                        </div>
                    </div>

                    {/* Column 3: Correct Answers (if incorrect) */}
                    <div>
                        <h3 style={{
                            color: theme.textMain,
                            fontSize: '18px',
                            fontWeight: '700',
                            marginBottom: '20px',
                            paddingBottom: '15px',
                            borderBottom: `3px solid ${theme.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <span style={{
                                backgroundColor: evaluation.isCorrect ? '#10b981' : '#f59e0b',
                                color: 'white',
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px'
                            }}>
                                {evaluation.isCorrect ? '✅' : '📚'}
                            </span>
                            {evaluation.isCorrect ? 'Key Takeaways' : 'Correct Answers'}
                        </h3>
                        
                        <div style={{
                            backgroundColor: evaluation.isCorrect ? '#f0fdf4' : '#fffbeb',
                            padding: '25px',
                            borderRadius: '15px',
                            border: `2px solid ${evaluation.isCorrect ? '#d1fae5' : '#fde68a'}`,
                            height: '400px',
                            overflowY: 'auto'
                        }}>
                            {evaluation.isCorrect ? (
                                <div>
                                    <div style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#065f46',
                                        marginBottom: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <span>🎯</span>
                                        <span>What You Did Well</span>
                                    </div>
                                    <ul style={{
                                        fontSize: '14px',
                                        color: '#065f46',
                                        paddingLeft: '24px',
                                        margin: 0,
                                        lineHeight: '1.8'
                                    }}>
                                        <li>Accurate diagnosis based on presented symptoms</li>
                                        <li>Appropriate medication selection and dosage</li>
                                        <li>Efficient information gathering</li>
                                        <li>Logical diagnostic reasoning</li>
                                        <li>Timely assessment completion</li>
                                    </ul>
                                    
                                    <div style={{
                                        marginTop: '25px',
                                        paddingTop: '20px',
                                        borderTop: `2px solid #d1fae5`
                                    }}>
                                        <div style={{
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: '#0369a1',
                                            marginBottom: '15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}>
                                            <span>🚀</span>
                                            <span>Next Challenge</span>
                                        </div>
                                        <div style={{
                                            fontSize: '14px',
                                            color: '#0369a1',
                                            lineHeight: '1.6'
                                        }}>
                                            Try a more complex case or attempt to complete the assessment faster for a higher score.
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#92400e',
                                        marginBottom: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <span>🎯</span>
                                        <span>Correct Diagnosis</span>
                                    </div>
                                    <div style={{
                                        backgroundColor: 'white',
                                        padding: '20px',
                                        borderRadius: '12px',
                                        marginBottom: '20px',
                                        border: `1px solid #fde68a`
                                    }}>
                                        <div style={{
                                            fontSize: '14px',
                                            color: '#92400e',
                                            lineHeight: '1.6'
                                        }}>
                                            <div style={{ marginBottom: '10px' }}>
                                                <strong>Diagnosis:</strong> {evaluation.correctAnswer?.diagnosis}
                                            </div>
                                            <div>
                                                <strong>Prescription:</strong> {evaluation.correctAnswer?.prescription?.medication} ({evaluation.correctAnswer?.prescription?.dosage})
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#92400e',
                                        marginBottom: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <span>📈</span>
                                        <span>Improvement Areas</span>
                                    </div>
                                    <ul style={{
                                        fontSize: '14px',
                                        color: '#92400e',
                                        paddingLeft: '24px',
                                        margin: 0,
                                        lineHeight: '1.8'
                                    }}>
                                        <li>Review diagnostic criteria for this condition</li>
                                        <li>Practice asking more specific questions</li>
                                        <li>Study common treatments and dosages</li>
                                        <li>Consider differential diagnoses</li>
                                        <li>Use training mode for guided practice</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '15px',
                    marginTop: '30px',
                    paddingTop: '25px',
                    borderTop: `3px solid ${theme.border}`
                }}>
                    <Button
                        onClick={() => navigate('/')}
                        variant="outline"
                        style={{ 
                            flex: 1, 
                            padding: '18px',
                            fontSize: '16px',
                            fontWeight: '600',
                            border: `2px solid ${theme.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px'
                        }}
                    >
                        <span>🏠</span>
                        Return to Dashboard
                    </Button>
                    
                    <Button
                        onClick={() => navigate('/setup', { state: { mode: 'quiz' } })}
                        variant={evaluation.isCorrect ? 'secondary' : 'primary'}
                        style={{ 
                            flex: 1, 
                            padding: '18px',
                            fontSize: '16px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px'
                        }}
                    >
                        <span>🔄</span>
                        Try Another Quiz
                    </Button>
                    
                    {!evaluation.isCorrect && (
                        <Button
                            onClick={() => navigate('/setup-training')}
                            variant="admin"
                            style={{ 
                                flex: 1, 
                                padding: '18px',
                                fontSize: '16px',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px'
                            }}
                        >
                            <span>🎓</span>
                            Practice in Training Mode
                        </Button>
                    )}
                </div>

                {/* Performance Summary */}
                <div style={{
                    marginTop: '25px',
                    padding: '20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: `2px solid ${theme.border}`,
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: theme.textMain,
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}>
                        <span>📈</span>
                        <span>Performance Summary</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '30px',
                        fontSize: '13px',
                        color: theme.textSecondary
                    }}>
                        <span>Score: <strong style={{ color: evaluation.isCorrect ? '#10b981' : '#dc2626' }}>{score}/100</strong></span>
                        <span>•</span>
                        <span>Time: <strong>{formatTime(timeSpent || 0)}</strong></span>
                        <span>•</span>
                        <span>Grade: <strong>{grade}</strong></span>
                        <span>•</span>
                        <span>Result: <strong style={{ color: evaluation.isCorrect ? '#10b981' : '#dc2626' }}>
                            {evaluation.isCorrect ? 'PASSED' : 'REVIEW REQUIRED'}
                        </strong></span>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ResultDisplay;