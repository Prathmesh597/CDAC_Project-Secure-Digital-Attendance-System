import React, { useState, useEffect } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";

const AttendanceView = ({ studentPrn }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (studentPrn) {
      fetchSubjectAttendance();
    }
  }, [studentPrn]);

  const fetchSubjectAttendance = async () => {
    const token = localStorage.getItem("studentToken");
    
    try {
      const response = await fetch(
        `http://localhost:8081/api/students/${studentPrn}/attendance-percentage/subject-wise`, 
        {
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      console.log("DEBUG API DATA:", data);

      // --- LOGIC FIX: Handle both Array and Object/Map ---
      if (Array.isArray(data)) {
        // If it's already a list, use it
        setAttendanceData(data);
      } else if (typeof data === 'object' && data !== null) {
        // If it's a Map like { "Spring Boot": 100 }, convert it to a List
        const formattedList = Object.entries(data).map(([subject, percent]) => ({
          subjectName: subject,
          percentage: percent,
          attendedLectures: "?", // This endpoint doesn't give counts, only %
          totalLectures: "?"
        }));
        setAttendanceData(formattedList);
      } else {
        setAttendanceData([]); 
      }
      
    } catch (err) {
      console.error(err);
      setError("Could not load details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4"><Spinner animation="border" /></div>;
  
  if (!attendanceData || attendanceData.length === 0) {
    return <Alert variant="info">No subject details available yet.</Alert>;
  }

  return (
    <div className="table-responsive">
      <Table hover className="align-middle">
        <thead className="bg-light">
          <tr>
            <th>Subject</th>
            <th className="text-center">Attended / Total</th>
            <th className="text-center">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((subject, index) => (
            <tr key={index}>
              <td className="fw-bold">{subject.subjectName}</td>
              <td className="text-center">
                {/* Since counts are missing in this endpoint, we show a placeholder or just the status */}
                <small className="text-muted">Calculated by System</small>
              </td>
              <td className="text-center">
                <span className={`badge ${subject.percentage >= 75 ? 'bg-success' : 'bg-warning text-dark'}`}>
                  {parseFloat(subject.percentage).toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AttendanceView;