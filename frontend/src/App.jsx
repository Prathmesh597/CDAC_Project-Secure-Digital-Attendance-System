import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddStudent from './pages/admin/AddStudent';
import AddFaculty from './pages/admin/AddFaculty';
import AdminHome from './pages/admin/AdminHome';
import ScheduleLecture from './pages/admin/ScheduleLecture';
import FacultyLectures from './pages/admin/FacultyLectures';
import AttendanceReport from './pages/admin/AttendanceReport';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyHome from './pages/faculty/FacultyHome';
import FacultyWelcome from './pages/faculty/FacultyWelcome';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentWelcome from './pages/student/StudentWelcome';
import MarkAttendance from './pages/student/MarkAttendance'; 
import StudentHistory from './pages/student/StudentHistory';
import FacultyHistory from './pages/faculty/FacultyHistory';
import StudentList from './pages/faculty/StudentList';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* ADMIN NESTED ROUTES */}
      <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} />
          <Route path="add-student" element={<AddStudent />} />
          <Route path="add-faculty" element={<AddFaculty />} />
          <Route path="schedule" element={<ScheduleLecture />} />
          <Route path="attendance-report" element={<AttendanceReport />} />
          <Route path="faculty-lectures" element={<FacultyLectures />} />
      </Route>

      {/* FACULTY ROUTE (Cleaned up) */}
      <Route path="/faculty" element={<FacultyDashboard />}>
          <Route index element={<FacultyWelcome />} />
          <Route path="conduct" element={<FacultyHome />} />
          <Route path="history" element={<FacultyHistory />} /> 
          <Route path="students" element={<StudentList />} />
      </Route>

          <Route path="/student" element={<StudentDashboard />}>
              <Route index element={<StudentWelcome />} />
              <Route path="mark-attendance" element={<MarkAttendance />} />
              <Route path="history" element={<StudentHistory />} />
          </Route>


    </Routes>
  )
}

export default App;