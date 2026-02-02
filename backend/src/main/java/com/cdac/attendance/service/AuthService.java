package com.cdac.attendance.service;

import com.cdac.attendance.dto.AuthResponse;
import com.cdac.attendance.dto.LoginRequest;
import com.cdac.attendance.entity.User;
import com.cdac.attendance.repository.UserRepository;
import com.cdac.attendance.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder; // Import this
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private EmailService emailService; // 1. Inject Email Service

    @Autowired
    private PasswordEncoder passwordEncoder; // 2. Inject Password Encoder

    // Temporary storage for OTPs (In real app, use Redis or Database)
    private Map<String, String> otpStorage = new HashMap<>();

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtUtils.generateToken(request.getEmail());
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        return new AuthResponse(token, user.getName(), user.getRole().name(), user.getId());
    }

    // --- NEW METHODS ---

    public String sendPasswordResetOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with this email."));

        // Generate 4-digit OTP
        String otp = String.format("%04d", new Random().nextInt(10000));
        
        // Save OTP in memory
        otpStorage.put(email, otp);

        // Send Email
        emailService.sendOtpEmail(email, otp);

        return "OTP sent to your email.";
    }

    public String resetPassword(String email, String otp, String newPassword) {
        // 1. Validate OTP
        if (!otpStorage.containsKey(email) || !otpStorage.get(email).equals(otp)) {
            throw new RuntimeException("Invalid or Expired OTP");
        }

        // 2. Find User
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Update Password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // 4. Clear OTP
        otpStorage.remove(email);

        return "Password reset successfully! You can login now.";
    }
}