import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api';
import { MedicalTheme as theme } from '../theme';
import Card from './Card';
import Button from './Button';

const SetupQuiz = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [diseases, setDiseases] = useState([]);
    const [selectedDisease, setSelectedDisease] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMode] = useState(state?.mode || 'quiz');

    useEffect(() => {
        fetchDiseases();
    }, []);

    const fetchDiseases = async () => {
        try {
            setLoading(true);
            const response = await API.get('/admin/diseases');
            setDiseases(response.data);
            setError('');
        } catch (err) {
            console.error('Failed to fetch diseases:', err);
            setError('Failed to load quiz cases. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const startQuiz = async () => {
        if (!selectedDisease) {
            alert('Please select a clinical case to begin the quiz.');
            return;
        }

        try {
            const response = await API.post('/quiz/start', {
                diseaseName: selectedDisease
            });
            
            navigate('/chat', {
                state: {
                    sessionId: response.data.sessionId,
                    initialScenario: response.data.initialScenario,
                    mode: selectedMode
                }
            });
        } catch (err) {
            console.error('Failed to start quiz:', err);
            alert(`Error: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleDiseaseSelect = (diseaseName) => {
        setSelectedDisease(diseaseName);
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: theme.bg,
            padding: '40px 20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)'
        }}>
            <Card 
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            backgroundColor: selectedMode === 'quiz' ? '#059669' : '#2563eb',
                            color: 'white',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            fontWeight: '600'
                        }}>
                            {selectedMode === 'quiz' ? '📝' : '⚕️'}
                        </div>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: theme.textMain }}>
                                {selectedMode === 'quiz' ? 'Quiz Mode Setup' : 'Assessment Setup'}
                            </div>
                            <div style={{ fontSize: '14px', color: theme.textSecondary, marginTop: '4px' }}>
                                {selectedMode === 'quiz' 
                                    ? 'Test your diagnostic skills without guidance' 
                                    : 'Challenge your clinical reasoning abilities'}
                            </div>
                        </div>
                    </div>
                }
                className="max-w-lg w-full"
                style={{
                    border: `2px solid ${selectedMode === 'quiz' ? '#059669' : '#2563eb'}`,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                }}
            >
                {error && (
                    <div style={{
                        backgroundColor: '#fee',
                        color: '#dc2626',
                        padding: '16px',
                        borderRadius: '10px',
                        marginBottom: '25px',
                        border: '2px solid #fca5a5',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '14px'
                    }}>
                        <div style={{ fontSize: '20px' }}>⚠️</div>
                        <div>{error}</div>
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px 20px' }}>
                        <div style={{
                            display: 'inline-block',
                            width: '60px',
                            height: '60px',
                            border: `4px solid ${theme.border}`,
                            borderTopColor: selectedMode === 'quiz' ? '#059669' : '#2563eb',
                            borderRadius: '50%',
                            animation: 'spin 1.2s linear infinite',
                            marginBottom: '20px'
                        }}></div>
                        <div style={{ 
                            fontSize: '16px', 
                            fontWeight: '600', 
                            color: theme.textMain,
                            marginBottom: '8px'
                        }}>
                            Loading Clinical Cases
                        </div>
                        <div style={{ 
                            fontSize: '14px', 
                            color: theme.textSecondary,
                            maxWidth: '300px',
                            margin: '0 auto',
                            lineHeight: '1.5'
                        }}>
                            Fetching verified medical cases from the knowledge base...
                        </div>
                        <style>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                ) : diseases.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <div style={{ 
                            fontSize: '64px',
                            marginBottom: '20px',
                            opacity: 0.2
                        }}>
                            📚
                        </div>
                        <div style={{ 
                            fontSize: '18px', 
                            fontWeight: '600', 
                            color: theme.textMain,
                            marginBottom: '12px'
                        }}>
                            No Quiz Cases Available
                        </div>
                        <div style={{ 
                            fontSize: '14px', 
                            color: theme.textSecondary,
                            marginBottom: '25px',
                            lineHeight: '1.6',
                            maxWidth: '300px',
                            margin: '0 auto'
                        }}>
                            Clinical cases need to be added through the admin panel before starting quizzes.
                        </div>
                        <Button 
                            onClick={() => navigate('/admin')}
                            variant="admin"
                            style={{ padding: '14px 28px', fontSize: '15px' }}
                        >
                            <span style={{ marginRight: '8px' }}>⚙️</span>
                            Go to Admin Panel
                        </Button>
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: '30px' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '15px'
                            }}>
                                <label style={{
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    color: theme.textMain,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <span style={{
                                        backgroundColor: selectedMode === 'quiz' ? '#05966920' : '#2563eb20',
                                        color: selectedMode === 'quiz' ? '#059669' : '#2563eb',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px'
                                    }}>
                                        1
                                    </span>
                                    Select Clinical Case
                                </label>
                                <div style={{
                                    fontSize: '12px',
                                    color: theme.textLight,
                                    backgroundColor: '#f8fafc',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontWeight: '500'
                                }}>
                                    {diseases.length} cases available
                                </div>
                            </div>
                            
                            <div style={{
                                maxHeight: '350px',
                                overflowY: 'auto',
                                border: `2px solid ${theme.border}`,
                                borderRadius: '12px',
                                backgroundColor: '#fafafa'
                            }}>
                                {diseases.map((disease) => (
                                    <div
                                        key={disease._id}
                                        onClick={() => handleDiseaseSelect(disease.diseaseName)}
                                        style={{
                                            padding: '20px',
                                            borderBottom: `1px solid ${theme.border}`,
                                            cursor: 'pointer',
                                            backgroundColor: selectedDisease === disease.diseaseName 
                                                ? selectedMode === 'quiz' ? '#d1fae5' : '#e0f2fe'
                                                : 'white',
                                            transition: 'all 0.2s ease',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                        onMouseOver={(e) => {
                                            if (selectedDisease !== disease.diseaseName) {
                                                e.currentTarget.style.backgroundColor = '#f8fafc';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (selectedDisease !== disease.diseaseName) {
                                                e.currentTarget.style.backgroundColor = 'white';
                                            }
                                        }}
                                    >
                                        {selectedDisease === disease.diseaseName && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '6px',
                                                height: '100%',
                                                backgroundColor: selectedMode === 'quiz' ? '#059669' : '#2563eb'
                                            }}></div>
                                        )}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginLeft: selectedDisease === disease.diseaseName ? '10px' : '0'
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ 
                                                    fontWeight: '700', 
                                                    color: theme.textMain,
                                                    fontSize: '16px',
                                                    marginBottom: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px'
                                                }}>
                                                    {selectedDisease === disease.diseaseName && (
                                                        <div style={{
                                                            color: selectedMode === 'quiz' ? '#059669' : '#2563eb',
                                                            fontSize: '20px',
                                                            animation: 'pulse 1.5s infinite'
                                                        }}>✓</div>
                                                    )}
                                                    {disease.diseaseName}
                                                </div>
                                                <div style={{ 
                                                    fontSize: '13px', 
                                                    color: theme.textSecondary,
                                                    marginBottom: '10px',
                                                    lineHeight: '1.5'
                                                }}>
                                                    <span style={{ fontWeight: '600' }}>Presenting Symptoms:</span> {disease.initialSymptoms.join(', ')}
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    gap: '15px',
                                                    fontSize: '12px',
                                                    color: theme.textLight
                                                }}>
                                                    <div style={{
                                                        backgroundColor: '#f1f5f9',
                                                        padding: '4px 10px',
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px'
                                                    }}>
                                                        <span>📋</span>
                                                        <span>{disease.diagnosticSteps.length} diagnostic steps</span>
                                                    </div>
                                                    <div style={{
                                                        backgroundColor: '#f1f5f9',
                                                        padding: '4px 10px',
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px'
                                                    }}>
                                                        <span>🔬</span>
                                                        <span>{disease.recommendedTests.length} tests</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {selectedDisease === disease.diseaseName && (
                                                <div style={{
                                                    backgroundColor: selectedMode === 'quiz' ? '#059669' : '#2563eb',
                                                    color: 'white',
                                                    padding: '8px 16px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}>
                                                    <span>SELECTED</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: selectedMode === 'quiz' ? '#f0fdf4' : '#f0f9ff',
                            padding: '20px',
                            borderRadius: '12px',
                            marginBottom: '25px',
                            border: `2px solid ${selectedMode === 'quiz' ? '#d1fae5' : '#e0f2fe'}`
                        }}>
                            <div style={{ 
                                fontSize: '15px', 
                                fontWeight: '700', 
                                color: theme.textMain,
                                marginBottom: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <span style={{
                                    backgroundColor: selectedMode === 'quiz' ? '#05966920' : '#2563eb20',
                                    color: selectedMode === 'quiz' ? '#059669' : '#2563eb',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '16px'
                                }}>
                                    2
                                </span>
                                Quiz Mode Rules
                            </div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '15px',
                                fontSize: '13px',
                                color: theme.textSecondary
                            }}>
                                <div style={{
                                    backgroundColor: 'white',
                                    padding: '15px',
                                    borderRadius: '10px',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>🚫</div>
                                    <div style={{ fontWeight: '600', marginBottom: '6px' }}>No Hints</div>
                                    <div>No guidance or suggestions provided</div>
                                </div>
                                <div style={{
                                    backgroundColor: 'white',
                                    padding: '15px',
                                    borderRadius: '10px',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏱️</div>
                                    <div style={{ fontWeight: '600', marginBottom: '6px' }}>Timed Assessment</div>
                                    <div>Test your diagnostic speed</div>
                                </div>
                                <div style={{
                                    backgroundColor: 'white',
                                    padding: '15px',
                                    borderRadius: '10px',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>📊</div>
                                    <div style={{ fontWeight: '600', marginBottom: '6px' }}>Performance Score</div>
                                    <div>Receive detailed evaluation</div>
                                </div>
                                <div style={{
                                    backgroundColor: 'white',
                                    padding: '15px',
                                    borderRadius: '10px',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>🎯</div>
                                    <div style={{ fontWeight: '600', marginBottom: '6px' }}>Real Challenge</div>
                                    <div>Simulate actual clinical scenarios</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <Button 
                                onClick={() => navigate('/')}
                                variant="outline"
                                style={{ 
                                    flex: 1, 
                                    padding: '16px',
                                    fontSize: '15px',
                                    border: `2px solid ${theme.border}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px'
                                }}
                            >
                                <span>←</span>
                                Back to Dashboard
                            </Button>
                            <Button 
                                onClick={startQuiz}
                                variant={selectedMode === 'quiz' ? 'secondary' : 'primary'}
                                disabled={!selectedDisease}
                                style={{ 
                                    flex: 1, 
                                    padding: '16px',
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px'
                                }}
                            >
                                <span>🚀</span>
                                {selectedMode === 'quiz' ? 'Start Quiz Assessment' : 'Begin Assessment'}
                            </Button>
                        </div>

                        <div style={{
                            marginTop: '20px',
                            paddingTop: '20px',
                            borderTop: `1px solid ${theme.border}`,
                            fontSize: '12px',
                            color: theme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                                <span>⏰ Estimated time: 10-15 minutes</span>
                                <span>•</span>
                                <span>📈 Performance tracking enabled</span>
                            </div>
                        </div>
                    </>
                )}
                <style>{`
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.1); opacity: 0.8; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                `}</style>
            </Card>
        </div>
    );
};

export default SetupQuiz;