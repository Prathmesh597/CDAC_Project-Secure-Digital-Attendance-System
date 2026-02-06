import React from 'react';
import adminImg from '../../assets/images/Admin.png';

const AdminHome = () => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center">
            
            <img 
                src={adminImg} 
                alt="Admin Dashboard" 
                className="img-fluid mb-4" 
                style={{ maxWidth: '550px', maxHeight: '350px', objectFit: 'contain' }}
            />

            {/* CHANGED: Removed 'display-4', added 'fw-bold' for a solid professional look */}
            <h2 className="fw-bold text-dark mt-2">Welcome to Admin Panel</h2>
            
            <p className="text-secondary mt-2 fs-5">
                Select an option from the sidebar to manage students, faculty, and schedules.
            </p>
        </div>
    );
};

export default AdminHome;