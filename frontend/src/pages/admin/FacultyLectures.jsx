import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const FacultyLectures = () => {
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all lectures on load
    useEffect(() => {
        const fetchLectures = async () => {
            try {
                const response = await api.get('/admin/lectures');
                setLectures(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error loading lectures", error);
                setLoading(false);
            }
        };
        fetchLectures();
    }, []);

    // Helper to format date nicely
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

    return (
        <div className="container-fluid px-0">
            {/* Header Section */}
            <div className="card shadow-lg border-0 mb-4 rounded-0">
                <div className="card-header bg-dark text-white p-3">
                    <h5 className="mb-0">All Scheduled Lectures</h5>
                </div>
                
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center p-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover mb-0 align-middle">
                                <thead className="table-secondary text-uppercase small fw-bold">
                                    <tr>
                                        <th scope="col" className="px-4">#</th>
                                        <th scope="col">Date & Time</th>
                                        <th scope="col">Subject / Course</th>
                                        <th scope="col">Faculty</th>
                                        <th scope="col">Status</th>
                                        <th scope="col" className="text-center">OTP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lectures.length > 0 ? (
                                        lectures.map((lecture, index) => (
                                            <tr key={lecture.id}>
                                                <td className="px-4 text-muted">{index + 1}</td>
                                                <td className="fw-bold text-dark">
                                                    {formatDate(lecture.startTime)}
                                                </td>
                                                <td>
                                                    <span className="badge bg-info text-dark me-2">
                                                        {lecture.subjectName || "Unknown Subject"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '35px', height: '35px'}}>
                                                            {lecture.faculty?.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold">{lecture.faculty?.name}</div>
                                                            <small className="text-muted">{lecture.faculty?.facultyCode}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {lecture.activeOtp ? (
                                                        <span className="badge bg-success">Active / Started</span>
                                                    ) : (
                                                        <span className="badge bg-warning text-dark">Scheduled</span>
                                                    )}
                                                </td>
                                                <td className="text-center font-monospace fs-5">
                                                    {lecture.activeOtp || "-"}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-muted">
                                                No lectures found. Go to "Schedule Lecture" to add one.
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

export default FacultyLectures;