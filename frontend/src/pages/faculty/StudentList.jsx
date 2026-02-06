import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // 🔴 FIX: Removed the extra '/api' here
                const response = await api.get('/faculty/students'); 
                setStudents(response.data);
            } catch (error) {
                console.error("Failed to load students", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Enrolled Students</h5>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-striped table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>PRN</th>
                                <th>Name</th>
                                <th>Email</th>
                                {/* Removed "Role" Column */}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center p-3">Loading...</td></tr>
                            ) : students.length > 0 ? (
                                students.map((student, index) => (
                                    <tr key={student.id}>
                                        <td>{index + 1}</td>
                                        <td className="fw-bold">{student.prn || "N/A"}</td>
                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        {/* Removed "Role" Cell */}
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="text-center p-3">No students found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentList;