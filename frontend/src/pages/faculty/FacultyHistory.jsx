import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const FacultyHistory = () => {
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get(`/faculty/lectures/${userId}`);
                const sorted = response.data.sort((a, b) => 
                    new Date(b.startTime) - new Date(a.startTime)
                );
                setLectures(sorted);
            } catch (error) {
                console.error("Error fetching history");
            }
            setLoading(false);
        };
        fetchHistory();
    }, [userId]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', 
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatus = (lec) => {
        if (lec.activeOtp) return 'LIVE';
        if (lec.otpExpiryTime) return 'COMPLETED';
        return 'SCHEDULED';
    };

    return (
        <div className="container-fluid px-0">
            <div className="card shadow-sm border-0 rounded-0">
                <div className="card-header bg-dark text-white p-3">
                    <h5 className="mb-0">My Lecture History</h5>
                </div>
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center p-5">Loading...</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover mb-0 align-middle">
                                <thead className="table-secondary">
                                    <tr>
                                        <th className="px-4">Date & Time</th>
                                        <th>Subject</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lectures.length > 0 ? (
                                        lectures.map((lec) => {
                                            const status = getStatus(lec);
                                            return (
                                                <tr key={lec.id}>
                                                    <td className="px-4 fw-bold">{formatDate(lec.startTime)}</td>
                                                    <td>
                                                        <span className="badge bg-info text-dark">{lec.subjectName}</span>
                                                    </td>
                                                    <td>
                                                        {status === 'LIVE' && <span className="badge bg-success">Live</span>}
                                                        {status === 'COMPLETED' && <span className="badge bg-secondary">Completed</span>}
                                                        {status === 'SCHEDULED' && <span className="badge bg-warning text-dark">Scheduled</span>}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center py-5 text-muted">
                                                No lecture history found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FacultyHistory;