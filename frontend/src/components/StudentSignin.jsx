
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Card, CardContent, Alert } from '@mui/material';

const StudentSignin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // FIX: Changed port from 8081 to 8081
      const response = await axios.post("http://localhost:8081/api/students/signin", formData);

      console.log("Login response:", response.data);

      if (response.data.message && response.data.message.includes("not verified")) {
        alert("OTP sent. Please verify.");
        navigate("/verify-otp");
      } else if (response.data.token) {
        // SUCCESS: Store the token
        localStorage.setItem("studentToken", response.data.token); 
        navigate("/attendance"); // Direct them to Attendance page after login
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.response?.data?.message || "Login failed. Check your email/password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f5f5f5' }}>
      <Card sx={{ minWidth: 350, padding: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Student Sign-In
          </Typography>
          
          {error && <Alert severity="error">{error}</Alert>}

          <TextField 
            label="Email" 
            name="email" 
            variant="outlined" 
            fullWidth 
            value={formData.email} 
            onChange={handleChange} 
          />
          <TextField 
            label="Password" 
            name="password" 
            type="password" 
            variant="outlined" 
            fullWidth 
            value={formData.password} 
            onChange={handleChange} 
          />
          
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={handleLogin} 
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentSignin;