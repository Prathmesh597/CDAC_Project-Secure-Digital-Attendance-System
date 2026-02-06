import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import OtpCard from './OtpCard';
import LectureTable from './LectureTable';

const FacultyHome = () => {
    const [lectures, setLectures] = useState([]);
    const [otp, setOtp] = useState(null);
    const [activeLectureId, setActiveLectureId] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    const userId = localStorage.getItem('userId');

    // 1. Initial Load: Restore Session OR Fetch from Backend
    useEffect(() => {
        const savedOtp = localStorage.getItem('sessionOtp');
        const savedExpiry = localStorage.getItem('sessionExpiry');
        let sessionRestored = false;

        // A. Try to restore active timer from LocalStorage
        if (savedOtp && savedExpiry) {
            const now = Date.now();
            const secondsLeft = Math.floor((parseInt(savedExpiry) - now) / 1000);

            if (secondsLeft > 0) {
                setOtp(savedOtp);
                setTimeLeft(secondsLeft);
                sessionRestored = true;
            } else {
                // Session expired while we were away
                localStorage.removeItem('sessionOtp');
                localStorage.removeItem('sessionExpiry');
            }
        }

        // B. Fetch lecture list
        fetchMyLectures(!sessionRestored);
    }, []);

    // 2. Timer Logic (Countdown)
    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft((prev) => {
                    const newValue = prev - 1;
                    if (newValue <= 0) {
                        // Cleanup when timer hits 0
                        localStorage.removeItem('sessionOtp');
                        localStorage.removeItem('sessionExpiry');
                    }
                    return newValue;
                });
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [timeLeft]);

    // 3. Fetch Lectures
    const fetchMyLectures = async (autoSetActive = false) => {
        try {
            const response = await api.get(`/faculty/lectures/${userId}`);
            
            // Sort: Newest First
            const sortedData = response.data.sort((a, b) => 
                new Date(b.startTime) - new Date(a.startTime)
            );

            setLectures(sortedData);
            
            // Only auto-set state from backend if we didn't just restore a local session
            if (autoSetActive) {
                const active = sortedData.find(l => l.activeOtp);
                if (active) {
                    setOtp(active.activeOtp);
                    setActiveLectureId(active.id);
                    // Note: We don't start the timer here because the backend 
                    // doesn't track "seconds remaining", only the active OTP.
                }
            }
        } catch (error) {
            console.error("Error loading lectures");
        }
    };

    // 4. Start Class
    const handleStartClass = (lectureId) => {
        if (!navigator.geolocation) {
            setMessage({ text: "Geolocation is not supported.", type: "danger" });
            return;
        }

        setLoading(true);
        setMessage({ text: "Acquiring GPS Location...", type: "info" });

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const payload = { lat: latitude, lon: longitude };
                    const response = await api.post(`/faculty/lectures/${lectureId}/start`, payload);
                    
                    const extractedOtp = response.data.split(": ")[1].trim(); 

                    // --- STATE PERSISTENCE FIX ---
                    // Save the "End Time" (Now + 5 mins) to LocalStorage
                    const expiryTime = Date.now() + 300 * 1000; 
                    localStorage.setItem('sessionOtp', extractedOtp);
                    localStorage.setItem('sessionExpiry', expiryTime.toString());
                    // -----------------------------

                    setOtp(null); 
                    setTimeout(() => {
                        setOtp(extractedOtp); 
                        setActiveLectureId(lectureId);
                        setTimeLeft(300); // Start visual timer
                    }, 50);

                    setMessage({ text: "Class Started Successfully.", type: "success" });
                    fetchMyLectures(false); 
                } catch (error) {
                    setMessage({ text: "Failed to start class.", type: "danger" });
                }
                setLoading(false);
            },
            (error) => {
                setMessage({ text: "Location Access Denied.", type: "danger" });
                setLoading(false);
            }
        );
    };

    return (
        <div className="row">
            <OtpCard otp={otp} timeLeft={timeLeft} />

            {message.text && !otp && (
                <div className="col-12 mb-3">
                    <div className={`alert alert-${message.type}`}>{message.text}</div>
                </div>
            )}

            <LectureTable 
                lectures={lectures} 
                loading={loading} 
                onStartClass={handleStartClass} 
            />
        </div>
    );
};

export default FacultyHome;