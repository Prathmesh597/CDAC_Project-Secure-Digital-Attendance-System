import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/auth.service';
import loginImg from '../assets/images/Login.png';
// Import the new component (We will create this next)
import ForgotPasswordModal from '../components/ForgotPasswordModal';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // State for Modal
    const [showForgotModal, setShowForgotModal] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); 
        setLoading(true);
        try {
            const data = await loginUser(email, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userName', data.name);
            localStorage.setItem('userId', data.userId); 

            if (data.role === 'ADMIN') navigate('/admin');
            else if (data.role === 'FACULTY') navigate('/faculty');
            else if (data.role === 'STUDENT') navigate('/student');
            else setError("Unknown Role");

        } catch (err) {
            setError("Invalid Credentials. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                
                {/* LEFT SIDE */}
                <div className="col-lg-5 col-md-6 bg-dark text-white d-flex flex-column justify-content-center align-items-center p-5">
                    <div className="text-center">
                        <img src={loginImg} alt="Login Illustration" className="img-fluid mb-4" style={{ maxWidth: '350px', objectFit: 'contain' }} />
                        <h1 className="display-5 fw-bold mb-3">Secure Digital<br />Attendance System</h1>
                        <p className="lead opacity-75">Secure, Geofenced, and Real-time tracking.</p>
                    </div>
                    <div className="mt-5 text-white-50 small">&copy; 2026 Attendance System</div>
                </div>

                {/* RIGHT SIDE */}
                <div className="col-lg-7 col-md-6 d-flex align-items-center justify-content-center bg-light">
                    <div className="card shadow-lg border-0 p-4" style={{ maxWidth: '450px', width: '100%' }}>
                        <div className="card-body">
                            <h3 className="fw-bold text-dark mb-4">Welcome Back</h3>
                            <p className="text-muted mb-4">Please enter your details to sign in.</p>
                            
                            {error && <div className="alert alert-danger"><small>{error}</small></div>}
                            
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-uppercase text-muted">Email Address</label>
                                    <input type="email" className="form-control form-control-lg bg-light fs-6" 
                                           placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label fw-bold small text-uppercase text-muted">Password</label>
                                    <input type="password" className="form-control form-control-lg bg-light fs-6" 
                                           placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                                
                                {/* Forgot Password Link */}
                                <div className="d-flex justify-content-end mb-4">
                                    <button type="button" className="btn btn-link text-decoration-none p-0" 
                                            onClick={() => setShowForgotModal(true)}>
                                        Forgot Password?
                                    </button>
                                </div>
                                
                                <button type="submit" className="btn btn-dark btn-lg w-100" disabled={loading}>
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Component */}
            {showForgotModal && (
                <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
            )}
        </div>
    );
};

export default Login;