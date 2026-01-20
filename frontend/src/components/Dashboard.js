import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AttendanceView from './AttendanceView';
import Scanner from './Scanner'; // <--- IMPORT OUR PIN SCANNER

const Dashboard = () => {
  const [selectedPage, setSelectedPage] = useState('home');
  const [studentPrn, setStudentPrn] = useState(null);
  const [studentName, setStudentName] = useState("Student");
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  
  // Dashboard Stats
  const [attendanceData, setAttendanceData] = useState({
    attendedLectures: 0,
    totalLectures: 0,
    attendancePercentage: 0
  });

  // 1. Fetch User Info on Load
  useEffect(() => {
    fetchStudentPrn();
  }, []);

  // 2. Fetch Stats once we have PRN
  useEffect(() => {
    if (studentPrn) {
      fetchAttendanceData();
      fetchStudentProfile();
    }
  }, [studentPrn]);

  const fetchStudentPrn = async () => {
    const token = localStorage.getItem("studentToken");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8081/api/students/get-prn-through-token", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (response.ok) {
        const prn = await response.json();
        setStudentPrn(prn);
      }
    } catch (error) {
      console.error("Error fetching PRN:", error);
    }
  };

  const fetchStudentProfile = async () => {
    const token = localStorage.getItem("studentToken");
    if (!token) return;

    try {
        // We use the PRN to get the name if the token endpoint doesn't return it
        // Or you can create a specific endpoint. For now, let's keep it simple.
        // If your backend has a specific /getName endpoint, ensure it works.
        // Otherwise, we default to "Student" or fetch via PRN if you have an endpoint.
    } catch (error) {
       console.error("Error fetching profile", error);
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/students/${studentPrn}/attendance-percentage`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("studentToken")}` },
      });
      
      if (response.ok) {
        const stats = await response.json();
        setAttendanceData({
          attendedLectures: stats.attendedLectures || 0,
          totalLectures: stats.totalLectures || 0,
          attendancePercentage: stats.attendancePercentage || 0
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    window.location.href = "/";
  };

  // --- RENDER FUNCTIONS ---

  const renderHome = () => (
    <div className="container-fluid py-4">
      <h2 className="mb-4 fw-bold">Welcome, {studentPrn || "Student"}</h2>
      
      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="card-body d-flex flex-column text-white">
              <h5 className="card-title mb-3">Attended Lectures</h5>
              <h3 className="card-text mb-0 fw-bold">{attendanceData.attendedLectures}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' }}>
            <div className="card-body d-flex flex-column text-dark">
              <h5 className="card-title mb-3">Total Lectures</h5>
              <h3 className="card-text mb-0 fw-bold">{attendanceData.totalLectures}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)' }}>
            <div className="card-body d-flex flex-column text-dark">
              <h5 className="card-title mb-3">Attendance %</h5>
              <h3 className="card-text mb-0 fw-bold">{attendanceData.attendancePercentage.toFixed(2)}%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card mt-4 shadow-sm border-0">
        <div className="card-body">
          <AttendanceView studentPrn={studentPrn} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="d-flex h-100">
      {/* Sidebar */}
      <div 
        className={`bg-dark text-white ${isMenuCollapsed ? 'collapsed' : ''}`}
        style={{ width: isMenuCollapsed ? '80px' : '240px', minHeight: '100vh', transition: 'width 0.3s' }}
      >
        <div className="p-3">
          <button 
            className="btn btn-link text-white w-100 text-decoration-none d-flex align-items-center"
            onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
            style={{ backgroundColor: '#143864' }}
          >
            <i className={`fas fa-${isMenuCollapsed ? 'bars' : 'times'} me-2`}></i>
            {!isMenuCollapsed && <span className="fw-bold">ScaNMark</span>}
          </button>
          
          <div className="nav flex-column mt-4">
            <button 
              className={`btn btn-link text-white text-start mb-2 text-decoration-none ${selectedPage === 'home' ? 'active' : ''}`}
              onClick={() => setSelectedPage('home')}
              style={{ backgroundColor: selectedPage === 'home' ? '#6c757d' : '#143864' }}
            >
              <i className="fas fa-home me-2"></i> {!isMenuCollapsed && 'Home'}
            </button>

            <button 
              className={`btn btn-link text-white text-start mb-2 text-decoration-none ${selectedPage === 'scanQRCode' ? 'active' : ''}`}
              onClick={() => setSelectedPage('scanQRCode')}
              style={{ backgroundColor: selectedPage === 'scanQRCode' ? '#6c757d' : '#143864' }}
            >
              <i className="fas fa-qrcode me-2"></i> {!isMenuCollapsed && 'Mark Attendance'}
            </button>

            <button 
              className="btn btn-link text-white text-start mb-2 text-decoration-none"
              onClick={handleLogout}
              style={{ backgroundColor: '#143864' }}
            >
              <i className="fas fa-sign-out-alt me-2"></i> {!isMenuCollapsed && 'Logout'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        {selectedPage === 'home' && renderHome()}
        
        {/* HERE IS THE MAGIC: We use the Scanner Component instead of hardcoded video */}
        {selectedPage === 'scanQRCode' && <Scanner />} 
        
      </div>
    </div>
  );
};

export default Dashboard;