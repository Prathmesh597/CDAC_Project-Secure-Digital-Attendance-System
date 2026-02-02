package com.cdac.attendance.controller;

import com.cdac.attendance.dto.AuthResponse;
import com.cdac.attendance.dto.LoginRequest;
import com.cdac.attendance.dto.ForgotPasswordRequest; // <--- NEW IMPORT
import com.cdac.attendance.dto.ResetPasswordRequest;  // <--- NEW IMPORT
import com.cdac.attendance.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // 1. Forgot Password
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        System.out.println("Forgot Password Requested for: " + request.getEmail()); 
        return ResponseEntity.ok(authService.sendPasswordResetOtp(request.getEmail()));
    }

    // 2. Reset Password
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        System.out.println("Reset Password Requested for: " + request.getEmail()); 
        return ResponseEntity.ok(authService.resetPassword(
            request.getEmail(), 
            request.getOtp(), 
            request.getNewPassword()
        ));
    }
}