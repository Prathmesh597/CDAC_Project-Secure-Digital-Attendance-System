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
import org.springframework.stereotype.Service;


@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse login(LoginRequest request) {
        // 1. Authenticate (Checks email & password)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // 2. If successful, generate Token
        String token = jwtUtils.generateToken(request.getEmail());

        // 3. Get User details to send back
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        return new AuthResponse(token, user.getName(), user.getRole().name(), user.getId());
    }
}