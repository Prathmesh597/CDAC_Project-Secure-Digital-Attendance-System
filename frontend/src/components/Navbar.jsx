import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/auth.service';

const Navbar = ({ title }) => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'User';

    const handleLogout = () => {
        logoutUser();
        navigate('/'); 
    };

    return (
        <nav className="navbar navbar-dark bg-primary px-3 mb-4">
            <span className="navbar-brand mb-0 h1">{title}</span>
            
            <div className="d-flex align-items-center">
                <span className="text-light me-3">Welcome, {userName}</span>
                <button 
                    className="btn btn-outline-light btn-sm" 
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;