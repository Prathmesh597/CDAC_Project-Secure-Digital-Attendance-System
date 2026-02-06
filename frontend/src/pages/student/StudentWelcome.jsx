import React from 'react';
// 1. Import Image
import studentImg from '../../assets/images/Student.png';

const StudentWelcome = () => {
    const userName = localStorage.getItem('userName') || 'Student';

    return (
        <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center">
            
            {/* 2. Display Image */}
            <img 
                src={studentImg} 
                alt="Student Dashboard" 
                className="img-fluid mb-4" 
                style={{ maxWidth: '550px', maxHeight: '350px', objectFit: 'contain' }}
            />

            {/* 3. Bold Professional Font */}
            <h2 className="fw-bold text-dark mt-2">Welcome, {userName}</h2>
            
            <p className="text-secondary mt-2 fs-5">
                Select <b>"Mark Attendance"</b> when your professor shares the OTP.
            </p>
        </div>
    );
};

export default StudentWelcome;