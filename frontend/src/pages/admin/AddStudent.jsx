import React, { useState, useEffect } from 'react'; // Import useEffect
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const AddStudent = () => {
    const navigate = useNavigate();
    const [student, setStudent] = useState({ name: '', email: '', prn: '' });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [studentList, setStudentList] = useState([]);

    // FIX: Fetch existing students from DB when page loads
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await api.get('/admin/students');
            setStudentList(response.data);
        } catch (error) {
            console.error("Failed to fetch students");
        }
    };

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (student.prn.length < 4) {
            setMessage({ text: "PRN must be at least 4 digits", type: "danger" });
            return;
        }
        const generatedPassword = student.prn.slice(-4);
        const payload = { ...student, password: generatedPassword };

        try {
            const response = await api.post('/admin/student', payload);
            setMessage({ text: "Student Registered Successfully!", type: "success" });
            
            // FIX: Refresh the list from DB to ensure sync (or append locally)
            fetchStudents(); 
            
            setStudent({ name: '', email: '', prn: '' });
        } catch (error) {
            setMessage({ text: "Registration Failed! Email might exist.", type: "danger" });
        }
    };

    return (
        <div className="container-fluid px-0">
            {/* --- FORM SECTION (Same as before) --- */}
            <div className="card shadow-lg border-0 mb-4 rounded-0">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center p-3">
                    <h5 className="mb-0">Add New Student</h5>
                    <button className="btn btn-outline-light btn-sm px-3" onClick={() => navigate('/admin')}>
                        Back
                    </button>
                </div>
                
                <div className="card-body p-4 bg-white">
                    {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-bold">PRN Number</label>
                                <input type="text" className="form-control" name="prn" value={student.prn} onChange={handleChange} placeholder="25084122101" required />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-bold">Full Name</label>
                                <input type="text" className="form-control" name="name" value={student.name} onChange={handleChange} required />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-bold">Email Address</label>
                                <input type="email" className="form-control" name="email" value={student.email} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-dark px-4">Submit</button>
                            <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setStudent({name:'', email:'', prn:''})}>Reset</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* --- TABLE SECTION (Now shows DB Data) --- */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-secondary text-white">
                    <h6 className="mb-0">All Registered Students</h6>
                </div>
                <div className="card-body p-0">
                    <table className="table table-hover table-striped mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>PRN</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentList.length > 0 ? (
                                studentList.map((stu, index) => (
                                    <tr key={stu.id || index}> {/* Use ID from DB as key */}
                                        <td>{index + 1}</td>
                                        <td>{stu.prn || "N/A"}</td>
                                        <td>{stu.name}</td>
                                        <td>{stu.email}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-3 text-muted">
                                        No students found in database.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AddStudent;