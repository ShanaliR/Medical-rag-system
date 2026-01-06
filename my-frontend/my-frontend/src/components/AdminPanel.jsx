import React, { useState } from 'react';
import API from '../api';
import { MedicalTheme as theme } from '../theme';

const AdminPanel = () => {
    const [form, setForm] = useState({
        diseaseName: '',
        initialSymptoms: '',
        clinicalDetails: '',
        diagnosticSteps: '',
        recommendedTests: '',
        correctDiagnosis: '',
        medication: '',
        dosage: '',
        instructions: ''
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const saveCase = async () => {
        setLoading(true);
        try {
            const payload = {
                diseaseName: form.diseaseName,
                initialSymptoms: form.initialSymptoms.split(',').map(s => s.trim()),
                clinicalDetails: form.clinicalDetails,
                diagnosticSteps: form.diagnosticSteps.split(',').map(s => s.trim()),
                recommendedTests: form.recommendedTests.split(',').map(s => s.trim()),
                correctDiagnosis: form.correctDiagnosis,
                correctPrescription: {
                    medication: form.medication,
                    dosage: form.dosage,
                    instructions: form.instructions
                }
            };

            await API.post('/admin/disease', payload);
            alert("✅ Case successfully integrated into RAG Knowledge Base.");
            // Optional: Reset form here
        } catch (err) {
            alert("❌ Error saving case: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const sectionStyle = { marginBottom: '25px', padding: '20px', border: `1px solid ${theme.border}`, borderRadius: '12px', background: '#fcfcfc' };
    const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '8px' };
    const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: `1px solid ${theme.border}`, fontSize: '15px', outline: 'none', transition: 'border 0.2s' };

    return (
        <div style={{ backgroundColor: '#f4f7f9', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                <header style={{ borderBottom: `2px solid ${theme.primary}`, marginBottom: '30px', paddingBottom: '10px' }}>
                    <h2 style={{ color: theme.textMain, margin: 0, fontSize: '28px' }}>Clinical Knowledge Ingestion</h2>
                    <p style={{ color: theme.textSecondary, marginTop: '5px' }}>Add verified medical cases for AI student training</p>
                </header>

                {/* Section 1: Basic Case Info */}
                <div style={sectionStyle}>
                    <h3 style={{ color: theme.primary, fontSize: '18px', marginBottom: '15px' }}>1. Primary Identification</h3>
                    <label style={labelStyle}>Disease Name</label>
                    <input name="diseaseName" style={inputStyle} placeholder="e.g. Chronic Hypertension" onChange={handleInputChange} />
                    
                    <label style={labelStyle}>Initial Symptoms (Comma separated)</label>
                    <input name="initialSymptoms" style={inputStyle} placeholder="e.g. Dizziness, Headaches, Blurred vision" onChange={handleInputChange} />
                </div>

                {/* Section 2: Clinical Data (RAG Context) */}
                <div style={sectionStyle}>
                    <h3 style={{ color: theme.primary, fontSize: '18px', marginBottom: '15px' }}>2. Clinical Logic (RAG Context)</h3>
                    <label style={labelStyle}>Detailed Clinical Knowledge Base</label>
                    <textarea name="clinicalDetails" style={{ ...inputStyle, height: '120px', resize: 'vertical' }} placeholder="Full clinical description for AI reasoning..." onChange={handleInputChange} />
                    
                    <label style={labelStyle}>Correct Diagnostic Steps (Comma separated)</label>
                    <input name="diagnosticSteps" style={inputStyle} placeholder="History, BP Check, Fundoscopy..." onChange={handleInputChange} />

                    <label style={labelStyle}>Recommended Investigations</label>
                    <input name="recommendedTests" style={inputStyle} placeholder="EKG, Renal Function, Urinalysis..." onChange={handleInputChange} />
                </div>

                {/* Section 3: Final Answer Key */}
                <div style={sectionStyle}>
                    <h3 style={{ color: theme.primary, fontSize: '18px', marginBottom: '15px' }}>3. Treatment & Verification</h3>
                    <label style={labelStyle}>Confirmed Diagnosis</label>
                    <input name="correctDiagnosis" style={inputStyle} placeholder="Final Answer" onChange={handleInputChange} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={labelStyle}>Medication</label>
                            <input name="medication" style={inputStyle} placeholder="Lisinopril" onChange={handleInputChange} />
                        </div>
                        <div>
                            <label style={labelStyle}>Dosage</label>
                            <input name="dosage" style={inputStyle} placeholder="10mg once daily" onChange={handleInputChange} />
                        </div>
                    </div>
                    <label style={labelStyle}>Instructions</label>
                    <input name="instructions" style={inputStyle} placeholder="Take in the morning with water" onChange={handleInputChange} />
                </div>

                <button 
                    onClick={saveCase} 
                    disabled={loading}
                    style={{ 
                        width: '100%', padding: '18px', backgroundColor: loading ? '#ccc' : theme.primary, 
                        color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', 
                        fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'transform 0.1s'
                    }}
                >
                    {loading ? 'Processing...' : '🚀 Securely Store Knowledge Base'}
                </button>
            </div>
        </div>
    );
};

export default AdminPanel;