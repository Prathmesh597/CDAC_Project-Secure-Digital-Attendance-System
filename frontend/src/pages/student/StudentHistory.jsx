import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StudentHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/student/history');
                setHistory(response.data);
            } catch (error) {
                console.error("Error fetching history");
            }
            setLoading(false);
        };
        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="container-fluid px-0">
            <div className="card shadow-sm border-0 rounded-0">
                <div className="card-header bg-dark text-white p-3">
                    <h5 className="mb-0">My Attendance History</h5>
                </div>
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center p-5">Loading...</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover mb-0">
                                <thead className="table-secondary">
                                    <tr>
                                        <th className="px-4">#</th>
                                        <th>Date & Time</th>
                                        <th>Subject</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.length > 0 ? (
                                        history.map((record, index) => (
                                            <tr key={record.id}>
                                                <td className="px-4">{index + 1}</td>
                                                <td>{formatDate(record.lecture.startTime)}</td>
                                                <td className="fw-bold">{record.lecture.subjectName}</td>
                                                <td>
                                                    <span className="badge bg-success">PRESENT</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5 text-muted">
                                                No attendance records found.
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

export default StudentHistory;