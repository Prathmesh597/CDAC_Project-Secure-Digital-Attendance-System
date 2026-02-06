package com.cdac.attendance.dto;

public class ForgotPasswordRequest {
    private String email;

    // Default Constructor
    public ForgotPasswordRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}