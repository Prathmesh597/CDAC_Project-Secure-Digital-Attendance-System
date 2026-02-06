import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const MarkAttendance = () => {
    const [lectures, setLectures] = useState([]);
    const [selectedLecture, setSelectedLecture] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    // 1. Fetch Lectures for Dropdown
    useEffect(() => {
        const fetchLectures = async () => {
            try {
                const response = await api.get('/student/lectures');
                setLectures(response.data);
            } catch (error) {
                console.error("Error fetching lectures");
            }
        };
        fetchLectures();
    }, []);

    // 2. Handle Submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedLecture) {
            setMessage({ text: "Please select a lecture first.", type: "danger" });
            return;
        }

        if (!navigator.geolocation) {
            setMessage({ text: "Geolocation is not supported by this browser.", type: "danger" });
            return;
        }

        setLoading(true);
        setMessage({ text: "Acquiring GPS Location...", type: "info" });

        // 3. Get Location & Send Request
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                const payload = {
                    lectureId: selectedLecture,
                    otp: otp,
                    latitude: latitude,
                    longitude: longitude
                };

                try {
                    await api.post('/student/attendance', payload);
                    setMessage({ text: "Attendance Marked Successfully! ✅", type: "success" });
                    setOtp(''); // Clear OTP
                    setSelectedLecture(''); // Reset selection
                } catch (error) {
                    console.error("Attendance Error:", error);

                    // --- BUG FIX: Handle Object vs String Error ---
                    let errorMsg = "Attendance Failed.";

                    if (error.response) {
                        // 1. If Backend sends simple string: "Invalid OTP"
                        if (typeof error.response.data === 'string') {
                            errorMsg = error.response.data;
                        } 
                        // 2. If Backend sends JSON object: { message: "Attendance already marked!" }
                        else if (error.response.data && error.response.data.message) {
                            errorMsg = error.response.data.message;
                        }
                        // 3. Fallback for other structures
                        else if (error.response.data.error) {
                             errorMsg = error.response.data.error;
                        }
                    }

                    setMessage({ text: errorMsg, type: "danger" });
                }
                setLoading(false);
            },
            (error) => {
                setMessage({ text: "Location Access Denied. You must allow GPS.", type: "danger" });
                setLoading(false);
            }
        );
    };

    // Helper: Format Date
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
                <div className="card shadow-lg border-0 rounded-0">
                    <div className="card-header bg-dark text-white p-3">
                        <h5 className="mb-0">Mark Attendance</h5>
                    </div>
                    <div className="card-body p-4 bg-white">
                        
                        {message.text && (
                            <div className={`alert alert-${message.type} text-center`}>
                                {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* 1. Select Lecture */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">Select Active Lecture</label>
                                <select 
                                    className="form-select" 
                                    value={selectedLecture} 
                                    onChange={(e) => setSelectedLecture(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose a Class --</option>
                                    {lectures.map(lec => (
                                        <option key={lec.id} value={lec.id}>
                                            {lec.subjectName} ({formatDate(lec.startTime)})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 2. Enter OTP */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">Enter OTP</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-lg text-center letter-spacing-2"
                                    placeholder="X X X X"
                                    maxLength="4"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required 
                                    style={{ letterSpacing: '5px', fontSize: '1.5rem' }}
                                />
                                <div className="form-text text-center">
                                    Enter the 4-digit code shared by your professor.
                                </div>
                            </div>

                            {/* 3. Submit Button */}
                            <div className="d-grid">
                                <button 
                                    type="submit" 
                                    className="btn btn-dark btn-lg" 
                                    disabled={loading}
                                >
                                    {loading ? 'Verifying Location...' : 'Mark Present'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarkAttendance;