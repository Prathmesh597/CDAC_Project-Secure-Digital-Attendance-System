import React from 'react';

const OtpCard = ({ otp, timeLeft }) => {
    // Helper to format Seconds into MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (!otp) return null;

    return (
        <div className="col-12 mb-4">
            <div className="card shadow-lg border-0 bg-success text-white">
                <div className="card-body text-center p-5">
                    <h2 className="display-6 fw-bold">Session Active</h2>
                    <p className="lead">Share this OTP with students to mark attendance.</p>
                    
                    <div className="bg-white text-success d-inline-block px-5 py-2 rounded-pill mt-3 mb-3">
                        <h1 className="display-1 fw-bold mb-0" style={{ letterSpacing: '10px' }}>{otp}</h1>
                    </div>
                    
                    {/* Timer Display */}
                    <div className="mt-2">
                        {timeLeft > 0 ? (
                            <h4 className="fw-bold border d-inline-block px-3 py-1 rounded">
                                Time Remaining: {formatTime(timeLeft)}
                            </h4>
                        ) : (
                            <h4 className="fw-bold text-warning">
                                Time Expired
                            </h4>
                        )}
                    </div>

                    <p className="mb-0 mt-3 opacity-75">
                        Geofence is active at your current location.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OtpCard;