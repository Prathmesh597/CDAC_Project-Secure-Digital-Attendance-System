import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  Alert,
  CircularProgress
} from "@mui/material";
import axios from "axios";

const Scanner = () => {
  const [pin, setPin] = useState("");
  const [studentPrn, setStudentPrn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 1. Get the current User's PRN from the Token
  useEffect(() => {
    const fetchPrn = async () => {
      const token = localStorage.getItem("studentToken");
      if (!token) {
        setMessage({ type: "error", text: "You are not logged in." });
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8081/api/students/get-prn-through-token", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudentPrn(response.data);
      } catch (error) {
        console.error("Error fetching PRN:", error);
        setMessage({ type: "error", text: "Could not identify student. Please re-login." });
      } finally {
        setLoading(false);
      }
    };

    fetchPrn();
  }, []);

  // 2. Handle the PIN Submit
  const handleMarkAttendance = async () => {
    if (!pin) {
      setMessage({ type: "warning", text: "Please enter the PIN." });
      return;
    }

    try {
      // Hardcoded Lecture ID = 1 (For testing)
      const lectureId = 1; 

      const payload = {
        lectureId: lectureId,
        studentPrn: studentPrn,
        pin: pin
      };

      const response = await axios.post(
        "http://localhost:8081/api/attendance/mark-attendance",
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("studentToken")}` }
        }
      );

      setMessage({ type: "success", text: response.data.message || "Attendance Marked!" });
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Attendance Failed.";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, mt: 4 }}>
      
      <Typography variant="h5" color="primary">
        Mark Attendance
      </Typography>

      <Card sx={{ minWidth: 320, boxShadow: 3 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          <Typography variant="body2" color="text.secondary">
            Student PRN: <strong>{studentPrn || "Unknown"}</strong>
          </Typography>

          <TextField 
            label="Enter Session PIN" 
            variant="outlined" 
            fullWidth
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            type="number"
            placeholder="e.g. 1234"
          />

          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={handleMarkAttendance}
          >
            Submit PIN
          </Button>

          {message.text && (
            <Alert severity={message.type} sx={{ mt: 2 }}>
              {message.text}
            </Alert>
          )}

        </CardContent>
      </Card>
    </Box>
  );
};

export default Scanner;