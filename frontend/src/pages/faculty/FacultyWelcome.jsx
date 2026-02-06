import React from 'react';
// 1. Import Image
import facultyImg from '../../assets/images/Faculty.png';

const FacultyWelcome = () => {
    const userName = localStorage.getItem('userName') || 'Faculty';

    return (
        <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center">
            
            {/* 2. Display Image */}
            <img 
                src={facultyImg} 
                alt="Faculty Dashboard" 
                className="img-fluid mb-4" 
                style={{ maxWidth: '550px', maxHeight: '350px', objectFit: 'contain' }}
            />

            {/* 3. Bold Professional Font */}
            <h2 className="fw-bold text-dark mt-2">Welcome, {userName}</h2>
            
            <p className="text-secondary mt-2 fs-5">
                Select <b>"Conduct Lecture"</b> from the sidebar to start a class.
            </p>
        </div>
    );
};

export default FacultyWelcome;