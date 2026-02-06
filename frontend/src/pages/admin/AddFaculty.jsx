import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const AddFaculty = () => {
    const navigate = useNavigate();
    const [faculty, setFaculty] = useState({ name: '', email: '', facultyCode: '' });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [facultyList, setFacultyList] = useState([]);

    // FIX: Load from DB on mount
    useEffect(() => {
        fetchFaculty();
    }, []);

    const fetchFaculty = async () => {
        try {
            const response = await api.get('/admin/faculty');
            setFacultyList(response.data);
        } catch (error) {
            console.error("Failed to fetch faculty");
        }
    };

    const handleChange = (e) => setFaculty({ ...faculty, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...faculty, password: faculty.facultyCode };

        try {
            await api.post('/admin/faculty', payload);
            setMessage({ text: "Faculty Registered Successfully!", type: "success" });
            fetchFaculty(); // Refresh list
            setFaculty({ name: '', email: '', facultyCode: '' });
        } catch (error) {
            setMessage({ text: "Registration Failed! Email might exist.", type: "danger" });
        }
    };

    return (
        <div className="container-fluid px-0">
            {/* Form Section (Same as before) */}
            <div className="card shadow-lg border-0 mb-4 rounded-0">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center p-3">
                    <h5 className="mb-0">Add New Faculty</h5>
                    <button className="btn btn-outline-light btn-sm px-3" onClick={() => navigate('/admin')}>
                        Back
                    </button>
                </div>
                <div className="card-body p-4 bg-white">
                    {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-bold">Faculty Code</label>
                                <input type="text" className="form-control" name="facultyCode" value={faculty.facultyCode} onChange={handleChange} required />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-bold">Name</label>
                                <input type="text" className="form-control" name="name" value={faculty.name} onChange={handleChange} required />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-bold">Email</label>
                                <input type="email" className="form-control" name="email" value={faculty.email} onChange={handleChange} required />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-dark px-4">Submit</button>
                    </form>
                </div>
            </div>

            {/* Table Section (Now shows DB Data) */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-secondary text-white">
                    <h6 className="mb-0">All Registered Faculty</h6>
                </div>
                <div className="card-body p-0">
                    <table className="table table-hover table-striped mb-0">
                        <thead className="table-light">
                            <tr><th>#</th><th>Code</th><th>Name</th><th>Email</th></tr>
                        </thead>
                        <tbody>
                            {facultyList.length > 0 ? (
                                facultyList.map((fac, index) => (
                                    <tr key={fac.id || index}>
                                        <td>{index + 1}</td><td>{fac.facultyCode}</td><td>{fac.name}</td><td>{fac.email}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="text-center py-3 text-muted">No faculty found in database.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AddFaculty;