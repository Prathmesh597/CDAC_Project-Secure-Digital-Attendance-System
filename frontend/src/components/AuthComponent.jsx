import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Container, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import Navigation

const AuthComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook for redirection

  const handleLogin = async () => {
    setError(""); // Clear previous errors
    try {
      // Ensure we hit the correct Backend Port (8081)
      const response = await axios.post("http://localhost:8081/api/students/signin", { email, password });
      
      console.log("Login Response:", response.data);

      if (response.data.message && response.data.message.includes("not verified")) {
        setIsOtpSent(true);
      } else if (response.data.token) {
        // FIX 1: Save as "studentToken" (This matches your Attendance.js)
        localStorage.setItem("studentToken", response.data.token);
        
        // FIX 2: Redirect to the working Attendance Page
        navigate("/attendance"); 
      } else {
        setError("Login failed. No token received.");
      }
    } catch (error) {
      console.error("Login Error", error);
      setError("Invalid Credentials or Server Error");
    }
  };

  const handleOtpVerify = async () => {
    try {
      const response = await axios.post("http://localhost:8081/api/students/verify-otp", { email, otp });
      if(response.data.token) {
          localStorage.setItem("studentToken", response.data.token);
          navigate("/attendance");
      }
    } catch (error) {
      console.error("OTP Verification Error", error);
      setError("Invalid OTP");
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: 50 }}>
      <Typography variant="h5" gutterBottom>Student Login</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {isOtpSent ? (
        <>
          <TextField
            label="Enter OTP"
            fullWidth
            margin="normal"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleOtpVerify}>
            Verify OTP
          </Button>
        </>
      ) : (
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Login
        </Button>
      )}
    </Container>
  );
};

export default AuthComponent;