import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ScheduleLecture = () => {
    const navigate = useNavigate();
    
    // --- Hardcoded Curriculum Data ---
    const COURSES = [
        { id: 'DAC', name: 'DAC/PGD-AC' },
        { id: 'DBDA', name: 'DBDA/PGCP-BDA' },
        { id: 'DTISS', name: 'DTISS/PGCP-ITISS' }
    ];

    const SUBJECT_MAP = {
        'DAC': [
            "OS & SDM", "C++ Programming", "Database Tech", "Core Java (OOP)", 
            "Algorithms (Java)", "Web Tech", "Web-based Java", ".Net Tech", 
            "Aptitude", "Communication", "Project"
        ],
        'DBDA': [
            "Linux & Cloud", "Data Coll. & DBMS", "Python & R", "Java Programming", 
            "Big Data Tech", "Adv Analytics", "Machine Learning", "Data Visualization"
        ],
        'DTISS': [
            "Comp Networks", "Prog Concepts", "OS & Admin", "Net Defense (NDC)", 
            "Compliance Audit", "Security Concepts", "Cyber Forensics", "PKI"
        ]
    };

    // --- State ---
    const [facultyList, setFacultyList] = useState([]);
    const [subjects, setSubjects] = useState([]);

    // Form Selection
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState('');
    
    // FIX: Split Date and Time for better UI
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const facultyRes = await api.get('/admin/faculty');
                setFacultyList(facultyRes.data);
            } catch (error) {
                console.error("Error loading faculty", error);
            }
        };
        fetchFaculty();
    }, []);

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);
        setSelectedSubject('');

        if (courseId && SUBJECT_MAP[courseId]) {
            setSubjects(SUBJECT_MAP[courseId]);
        } else {
            setSubjects([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // FIX: Combine Date and Time into ISO format (YYYY-MM-DDTHH:MM)
        const combinedStartTime = `${date}T${time}`;

        const payload = {
            subjectName: selectedSubject,
            facultyId: selectedFaculty,
            startTime: combinedStartTime
        };

        try {
            await api.post('/admin/lecture', payload);
            setMessage({ text: "Lecture Scheduled Successfully!", type: "success" });
            
            // Reset Form
            setDate('');
            setTime('');
            setSelectedFaculty('');
        } catch (error) {
            setMessage({ text: "Scheduling Failed. Check inputs.", type: "danger" });
        }
    };

    return (
        <div className="container-fluid px-0">
            <div className="card shadow-lg border-0 mb-4 rounded-0">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center p-3">
                    <h5 className="mb-0">Schedule New Lecture</h5>
                    <button className="btn btn-outline-light btn-sm px-3" onClick={() => navigate('/admin')}>
                        Back
                    </button>
                </div>
                
                <div className="card-body p-4 bg-white">
                    {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Faculty Dropdown */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Select Faculty</label>
                                <select 
                                    className="form-select" 
                                    value={selectedFaculty} 
                                    onChange={(e) => setSelectedFaculty(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose Professor --</option>
                                    {facultyList.map(fac => (
                                        <option key={fac.id} value={fac.id}>{fac.name} ({fac.facultyCode})</option>
                                    ))}
                                </select>
                            </div>

                            {/* FIX: Split Inputs for Date and Time */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Date & Time</label>
                                <div className="d-flex gap-2">
                                    <input 
                                        type="date" 
                                        className="form-control"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required 
                                    />
                                    <input 
                                        type="time" 
                                        className="form-control"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>

                            {/* Course Dropdown */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Course</label>
                                <select 
                                    className="form-select" 
                                    value={selectedCourse} 
                                    onChange={handleCourseChange}
                                    required
                                >
                                    <option value="">-- Select Course --</option>
                                    {COURSES.map(course => (
                                        <option key={course.id} value={course.id}>{course.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Subject Dropdown */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Subject</label>
                                <select 
                                    className="form-select" 
                                    value={selectedSubject} 
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    required
                                    disabled={!selectedCourse} 
                                >
                                    <option value="">-- Select Subject --</option>
                                    {subjects.map((sub, index) => (
                                        <option key={index} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="d-flex gap-2 pt-3">
                            <button type="submit" className="btn btn-dark px-4">Schedule Class</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ScheduleLecture;