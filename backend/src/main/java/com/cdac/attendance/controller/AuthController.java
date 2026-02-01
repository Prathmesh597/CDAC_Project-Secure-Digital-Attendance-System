package com.cdac.attendance.controller;

import com.cdac.attendance.dto.AuthResponse;
import com.cdac.attendance.dto.LoginRequest;
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
        // Delegates the logic to AuthService
        return ResponseEntity.ok(authService.login(request));
    }
}