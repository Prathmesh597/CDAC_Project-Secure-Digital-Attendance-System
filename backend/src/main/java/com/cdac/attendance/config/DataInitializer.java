package com.cdac.attendance.config;

import com.cdac.attendance.entity.Role;
import com.cdac.attendance.entity.User;
import com.cdac.attendance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if Admin exists, if not, create one
        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = new User();
            admin.setName("Master Admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("1234")); // Hash the "1234"
            admin.setRole(Role.ADMIN);
            
            userRepository.save(admin);
            System.out.println(">>> DEFAULT ADMIN CREATED: admin@example.com / 1234");
        }
    }
}