import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/auth.service';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    return (
        <div className="d-flex vh-100">
            {/* --- LEFT SIDEBAR --- */}
            <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '250px' }}>
                <h4 className="fs-4 mb-4 text-center border-bottom pb-3">Admin Panel</h4>
                
                <ul className="nav nav-pills flex-column mb-auto gap-2">
                    <li className="nav-item">
                        <Link to="/admin/add-student" className="nav-link text-white btn btn-outline-secondary text-start">
                            Add Student
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/add-faculty" className="nav-link text-white btn btn-outline-secondary text-start">
                            Add Faculty
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/schedule" className="nav-link text-white btn btn-outline-secondary text-start">
                            Schedule Lecture
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/attendance-report" className="nav-link text-white btn btn-outline-secondary text-start">
                            Attendance Report
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/faculty-lectures" className="nav-link text-white btn btn-outline-secondary text-start">
                            Scheduled Lectures
                        </Link>
                    </li>
                </ul>

                <hr />
                <button className="btn btn-danger w-100" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* --- RIGHT CONTENT AREA --- */}
            {/* FIX: Added Light Grey Background so the White Form stands out */}
            <div className="flex-grow-1 p-5 overflow-auto" style={{ backgroundColor: '#f4f6f9' }}>
                <div className="container">
                    {/* The Form loads here */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;