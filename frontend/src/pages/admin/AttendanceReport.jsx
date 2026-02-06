import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import * as XLSX from 'xlsx'; // Import Excel Library

const AttendanceReport = () => {
    // UI State
    const [activeTab, setActiveTab] = useState('single'); // 'single' or 'consolidated'
    const [loading, setLoading] = useState(false);

    // --- SINGLE REPORT STATE ---
    const [lectures, setLectures] = useState([]);
    const [selectedLecture, setSelectedLecture] = useState('');
    const [singleReportData, setSingleReportData] = useState([]);

    // --- CONSOLIDATED REPORT STATE ---
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [consolidatedData, setConsolidatedData] = useState([]); // The Matrix
    const [subjectList, setSubjectList] = useState([]); // Columns

    // 1. Initial Fetch (Lectures & Students)
    useEffect(() => {
        fetchLectures();
    }, []);

    const fetchLectures = async () => {
        try {
            const response = await api.get('/admin/lectures');
            setLectures(response.data);
        } catch (error) {
            console.error("Error fetching lectures");
        }
    };

    // --- LOGIC: SINGLE LECTURE REPORT (Existing) ---
    const handleLectureChange = async (e) => {
        const lectureId = e.target.value;
        setSelectedLecture(lectureId);
        setSingleReportData([]);

        if (lectureId) {
            setLoading(true);
            try {
                const response = await api.get(`/admin/lectures/${lectureId}/report`);
                setSingleReportData(response.data);
            } catch (error) {
                console.error("Error fetching report");
            }
            setLoading(false);
        }
    };

    // --- LOGIC: CONSOLIDATED REPORT (New) ---
    const generateConsolidatedReport = async () => {
        if (!startDate || !endDate) {
            alert("Please select Start and End dates.");
            return;
        }
        setLoading(true);

        try {
            // 1. Fetch ALL required data in parallel
            const [allLecturesRes, allAttendanceRes, allStudentsRes] = await Promise.all([
                api.get('/admin/lectures'),
                api.get('/admin/attendance/all'),
                api.get('/admin/students')
            ]);

            const allLectures = allLecturesRes.data;
            const allAttendance = allAttendanceRes.data;
            const allStudents = allStudentsRes.data;

            // 2. Filter Lectures by Date Range
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59); // Include end date fully

            const filteredLectures = allLectures.filter(lec => {
                const lecDate = new Date(lec.startTime);
                return lecDate >= start && lecDate <= end;
            });

            // 3. Calculate "Total Conducted" per Subject (The Denominator)
            // Map: { "OOP-J": 10, "WPT": 5 }
            const subjectCounts = {};
            const subjectsFound = new Set();

            filteredLectures.forEach(lec => {
                const sub = lec.subjectName;
                subjectsFound.add(sub);
                subjectCounts[sub] = (subjectCounts[sub] || 0) + 1;
            });

            // 4. Build Student Matrix (The Numerator)
            // Structure: [ { name: "Prathmesh", prn: "101", "OOP-J": 8, "WPT": 5, totalPresent: 13, totalLectures: 15 } ]
            const matrix = allStudents.map(student => {
                const row = {
                    id: student.id,
                    name: student.name,
                    prn: student.prn,
                    stats: {},
                    grandTotalPresent: 0
                };

                // Initialize subject counters for this student
                subjectsFound.forEach(sub => row.stats[sub] = 0);

                // Count Attendance
                const studentAttendance = allAttendance.filter(att => 
                    att.student.id === student.id &&
                    filteredLectures.some(l => l.id === att.lecture.id) // Only count if lecture is in date range
                );

                studentAttendance.forEach(att => {
                    const subName = att.lecture.subjectName;
                    if (row.stats[subName] !== undefined) {
                        row.stats[subName]++;
                        row.grandTotalPresent++;
                    }
                });

                return row;
            });

            setSubjectList(Array.from(subjectsFound));
            setConsolidatedData({ matrix, subjectCounts, totalLecturesCount: filteredLectures.length });

        } catch (error) {
            console.error("Error generating report", error);
            alert("Failed to generate report.");
        }
        setLoading(false);
    };

    // --- LOGIC: DOWNLOAD EXCEL ---
    const downloadExcel = () => {
        if (!consolidatedData.matrix || consolidatedData.matrix.length === 0) return;

        // 1. Prepare Data for Excel
        const excelRows = consolidatedData.matrix.map(student => {
            const row = {
                "PRN": student.prn,
                "Student Name": student.name,
            };

            // Add Subject Columns (e.g., "OOP-J (80%)")
            subjectList.forEach(sub => {
                const attended = student.stats[sub];
                const total = consolidatedData.subjectCounts[sub];
                const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
                row[`${sub} (Total: ${total})`] = `${attended} (${percentage}%)`;
            });

            // Add Overall Column
            const totalConducted = consolidatedData.totalLecturesCount;
            const totalAttended = student.grandTotalPresent;
            const overallPercent = totalConducted > 0 ? Math.round((totalAttended / totalConducted) * 100) : 0;

            row["OVERALL %"] = `${overallPercent}%`;

            return row;
        });

        // 2. Create Sheet
        const worksheet = XLSX.utils.json_to_sheet(excelRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance_Report");

        // 3. Save File
        XLSX.writeFile(workbook, `Attendance_Report_${startDate}_to_${endDate}.xlsx`);
    };

    // Helpers
    const formatTime = (time) => new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return (
        <div className="container-fluid px-0">
            
            {/* --- TAB NAVIGATION --- */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'single' ? 'active fw-bold' : ''}`}
                        onClick={() => setActiveTab('single')}
                    >
                        Single Lecture View
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'consolidated' ? 'active fw-bold' : ''}`}
                        onClick={() => setActiveTab('consolidated')}
                    >
                        Monthly/Term Percentage Report
                    </button>
                </li>
            </ul>

            {/* --- TAB 1: SINGLE LECTURE (Existing) --- */}
            {activeTab === 'single' && (
                <div>
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body bg-white p-4">
                            <label className="form-label fw-bold">Select a Lecture:</label>
                            <select className="form-select" value={selectedLecture} onChange={handleLectureChange}>
                                <option value="">-- Choose a Class --</option>
                                {lectures.map(lec => (
                                    <option key={lec.id} value={lec.id}>
                                        {formatDate(lec.startTime)} - {lec.subjectName} ({lec.faculty?.name})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {selectedLecture && (
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-secondary text-white d-flex justify-content-between">
                                <h6 className="mb-0">Attendance List</h6>
                                <span className="badge bg-light text-dark">Total: {singleReportData.length}</span>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-striped table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>#</th><th>Name</th><th>PRN</th><th>Time</th><th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {singleReportData.map((rec, i) => (
                                            <tr key={rec.id}>
                                                <td>{i + 1}</td>
                                                <td>{rec.student?.name}</td>
                                                <td>{rec.student?.prn}</td>
                                                <td>{formatTime(rec.timestamp)}</td>
                                                <td><span className="badge bg-success">Present</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- TAB 2: CONSOLIDATED REPORT (New) --- */}
            {activeTab === 'consolidated' && (
                <div>
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Generate Percentage Matrix</h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3 align-items-end">
                                <div className="col-md-4">
                                    <label className="form-label">Start Date</label>
                                    <input type="date" className="form-control" 
                                        value={startDate} onChange={e => setStartDate(e.target.value)} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">End Date</label>
                                    <input type="date" className="form-control" 
                                        value={endDate} onChange={e => setEndDate(e.target.value)} />
                                </div>
                                <div className="col-md-4">
                                    <button className="btn btn-dark w-100" onClick={generateConsolidatedReport} disabled={loading}>
                                        {loading ? 'Calculating...' : 'Generate Report'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {consolidatedData.matrix && (
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                <h6 className="mb-0 fw-bold text-uppercase">Result Matrix</h6>
                                <button className="btn btn-success btn-sm" onClick={downloadExcel}>
                                    Download Excel (.xlsx)
                                </button>
                            </div>
                            <div className="table-responsive" style={{ maxHeight: '500px' }}>
                                <table className="table table-bordered table-hover mb-0 text-center">
                                    <thead className="table-light sticky-top">
                                        <tr>
                                            <th className="text-start">Student</th>
                                            {subjectList.map(sub => (
                                                <th key={sub} className="small">
                                                    {sub} <br/> 
                                                    <span className="text-muted">({consolidatedData.subjectCounts[sub]})</span>
                                                </th>
                                            ))}
                                            <th className="bg-light fw-bold">OVERALL %</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {consolidatedData.matrix.map(student => {
                                            const totalConducted = consolidatedData.totalLecturesCount;
                                            const overallPct = totalConducted > 0 ? Math.round((student.grandTotalPresent / totalConducted) * 100) : 0;
                                            
                                            // Highlight low attendance (Red if < 75%)
                                            const rowClass = overallPct < 75 ? 'table-danger' : '';

                                            return (
                                                <tr key={student.id}>
                                                    <td className="text-start fw-bold">{student.name}</td>
                                                    {subjectList.map(sub => {
                                                        const attended = student.stats[sub];
                                                        const total = consolidatedData.subjectCounts[sub];
                                                        const pct = total > 0 ? Math.round((attended/total)*100) : 0;
                                                        return <td key={sub}>{pct}%</td>
                                                    })}
                                                    <td className={`fw-bold ${overallPct < 75 ? 'text-danger' : 'text-success'}`}>
                                                        {overallPct}%
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AttendanceReport;