import React, { useState } from 'react';
import api from '../services/api';

const ForgotPasswordModal = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Helper to safely extract error message
    const getErrorMessage = (err) => {
        if (err.response && err.response.data) {
            // If backend returns a simple string, use it
            if (typeof err.response.data === 'string') {
                return err.response.data;
            }
            // If backend returns a JSON object (Spring Boot default error), stringify it or pick specific field
            if (err.response.data.message) {
                return err.response.data.message; 
            }
            return "Server Error: " + err.response.status;
        }
        return "Network Error or Server Unreachable";
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        
        try {
            await api.post('/auth/forgot-password', { email });
            setMessage('OTP sent to your email address.');
            setStep(2);
        } catch (err) {
            console.error("OTP Error:", err); 
            setError(getErrorMessage(err));   
        }
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await api.post('/auth/reset-password', { email, otp, newPassword });
            setMessage('Password Reset Successful! Closing...');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            console.error("Reset Error:", err);
            setError(getErrorMessage(err));   
        }
        setLoading(false);
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">Reset Password</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {error && <div className="alert alert-danger py-2" style={{ wordWrap: 'break-word' }}>{error}</div>}
                        {message && <div className="alert alert-success py-2">{message}</div>}

                        {step === 1 ? (
                            <form onSubmit={handleSendOtp}>
                                <div className="mb-3">
                                    <label className="form-label">Enter your registered email</label>
                                    <input type="email" className="form-control" required
                                           value={email} onChange={(e) => setEmail(e.target.value)} 
                                           placeholder="name@example.com" />
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? 'Sending OTP...' : 'Send OTP'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword}>
                                <div className="mb-3">
                                    <label className="form-label">Enter OTP from Email</label>
                                    <input type="text" className="form-control" required
                                           value={otp} onChange={(e) => setOtp(e.target.value)} 
                                           placeholder="1234" maxLength="4" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">New Password</label>
                                    <input type="password" className="form-control" required
                                           value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
                                           placeholder="New secure password" />
                                </div>
                                <button type="submit" className="btn btn-success w-100" disabled={loading}>
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal; 