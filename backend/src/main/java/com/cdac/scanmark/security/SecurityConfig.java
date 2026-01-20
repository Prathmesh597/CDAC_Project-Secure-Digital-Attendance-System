package com.cdac.scanmark.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(authz -> authz
                // --- 1. CRITICAL CORS FIX ---
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // --- 2. PUBLIC ENDPOINTS (NO LOGIN REQUIRED) ---
                .requestMatchers(
                    "/api/auth/**",
                    "/api/students/signin",
                    "/api/faculty/signin",
                    "/api/coordinators/signin",
                    
                    // --- FIX: ADD THESE MISSING ENDPOINTS ---
                    "/api/students/verify-otp",      // <--- REQUIRED FOR ALICE
                    "/api/students/forgot-password", // <--- Good to have
                    "/api/students/reset-password",  // <--- Good to have
                    
                    "/api/attendance/mark-attendance",
                    "/api/qr/sign"
                ).permitAll()

                // --- 3. SECURED ENDPOINTS ---
                .requestMatchers("/api/students/**").authenticated() 
                .requestMatchers("/api/faculty/**").authenticated()
                .requestMatchers("/api/attendance/**").authenticated()
                .requestMatchers("/api/lectures/**").authenticated()
                .requestMatchers("/api/coordinators/**").hasRole("COORDINATOR")

                // --- 4. CATCH ALL ---
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}