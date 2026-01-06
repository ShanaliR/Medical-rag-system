import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { MedicalTheme as theme } from '../theme';
import Card from './Card';
import Button from './Button';

const SetupTraining = () => {
    const navigate = useNavigate();
    const [diseases, setDiseases] = useState([]);
    const [selectedDisease, setSelectedDisease] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
            setError('Failed to load training cases. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const startTraining = async () => {
        if (!selectedDisease) {
            alert('Please select a clinical case to begin training.');
            return;
        }

        try {
            const response = await API.post('/training/start', {
                diseaseName: selectedDisease
            });
            
            navigate('/training-chat', {
                state: {
                    sessionId: response.data.sessionId,
                    initialScenario: response.data.initialScenario,
                    totalSteps: response.data.totalSteps,
                    initialHint: response.data.initialHint, // ADDED
                    mode: 'training'
                }
            });
        } catch (err) {
            console.error('Failed to start training:', err);
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
            alignItems: 'center'
        }}>
            <Card 
                title="Training Mode Setup"
                subtitle="Select a clinical case to begin your diagnostic training"
                className="max-w-md w-full"
            >
                {error && (
                    <div style={{
                        backgroundColor: '#fee',
                        color: '#c00',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        border: '1px solid #fcc'
                    }}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{
                            display: 'inline-block',
                            width: '40px',
                            height: '40px',
                            border: `3px solid ${theme.border}`,
                            borderTopColor: theme.primary,
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                        <p style={{ marginTop: '15px', color: theme.textSecondary }}>
                            Loading clinical cases...
                        </p>
                        <style>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                ) : diseases.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p style={{ color: theme.textSecondary, marginBottom: '20px' }}>
                            No clinical cases available. Please add cases in the admin panel.
                        </p>
                        <Button 
                            onClick={() => navigate('/admin')}
                            variant="admin"
                        >
                            Go to Admin Panel
                        </Button>
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: theme.textSecondary,
                                marginBottom: '10px'
                            }}>
                                Select Clinical Case
                            </label>
                            
                            <div style={{
                                maxHeight: '300px',
                                overflowY: 'auto',
                                border: `1px solid ${theme.border}`,
                                borderRadius: '8px'
                            }}>
                                {diseases.map((disease) => (
                                    <div
                                        key={disease._id}
                                        onClick={() => handleDiseaseSelect(disease.diseaseName)}
                                        style={{
                                            padding: '15px',
                                            borderBottom: `1px solid ${theme.border}`,
                                            cursor: 'pointer',
                                            backgroundColor: selectedDisease === disease.diseaseName 
                                                ? '#e6f7ff' 
                                                : 'white',
                                            transition: 'background-color 0.2s',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div>
                                            <div style={{ 
                                                fontWeight: '600', 
                                                color: theme.textMain 
                                            }}>
                                                {disease.diseaseName}
                                            </div>
                                            <div style={{ 
                                                fontSize: '13px', 
                                                color: theme.textSecondary,
                                                marginTop: '5px' 
                                            }}>
                                                Symptoms: {disease.initialSymptoms.join(', ')}
                                            </div>
                                            <div style={{ 
                                                fontSize: '12px', 
                                                color: theme.textLight,
                                                marginTop: '3px' 
                                            }}>
                                                Steps: {disease.diagnosticSteps.length} diagnostic steps
                                            </div>
                                        </div>
                                        {selectedDisease === disease.diseaseName && (
                                            <div style={{
                                                color: theme.primary,
                                                fontSize: '20px'
                                            }}>✓</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: '#f8fafc',
                            padding: '15px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            border: `1px solid ${theme.border}`
                        }}>
                            <div style={{ 
                                fontSize: '14px', 
                                fontWeight: '600', 
                                color: theme.textSecondary,
                                marginBottom: '8px' 
                            }}>
                                Training Mode Features:
                            </div>
                            <ul style={{ 
                                fontSize: '13px', 
                                color: theme.textSecondary,
                                paddingLeft: '20px',
                                margin: 0 
                            }}>
                                <li>Step-by-step diagnostic guidance with hints</li>
                                <li>Real-time progress tracking</li>
                                <li>Continuous hints throughout the process</li>
                                <li>Comprehensive feedback on submission</li>
                            </ul>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button 
                                onClick={() => navigate('/')}
                                variant="outline"
                                style={{ flex: 1 }}
                            >
                                Back to Dashboard
                            </Button>
                            <Button 
                                onClick={startTraining}
                                variant="secondary"
                                disabled={!selectedDisease}
                                style={{ flex: 1 }}
                            >
                                Start Training Session
                            </Button>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default SetupTraining;