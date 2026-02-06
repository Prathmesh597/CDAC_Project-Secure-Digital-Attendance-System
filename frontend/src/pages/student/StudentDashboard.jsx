import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/auth.service';

const StudentDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    return (
        <div className="d-flex vh-100">
            {/* --- LEFT SIDEBAR --- */}
            <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '250px' }}>
                <h4 className="fs-4 mb-4 text-center border-bottom pb-3">Student Portal</h4>
                
                <ul className="nav nav-pills flex-column mb-auto gap-2">
                    <li className="nav-item">
                        <Link to="/student" className="nav-link text-white btn btn-outline-secondary text-start">
                            Home
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/student/mark-attendance" className="nav-link text-white btn btn-outline-secondary text-start">
                            Mark Attendance
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/student/history" className="nav-link text-white btn btn-outline-secondary text-start">
                            My History
                        </Link>
                    </li>
                </ul>

                <hr />
                <button className="btn btn-danger w-100" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* --- RIGHT CONTENT AREA --- */}
            <div className="flex-grow-1 p-5 overflow-auto" style={{ backgroundColor: '#f4f6f9' }}>
                <div className="container-fluid">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;