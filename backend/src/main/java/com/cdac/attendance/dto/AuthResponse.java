package com.cdac.attendance.dto;

public class AuthResponse {
    private String token;
    private String name;
    private String role;
        private Long userId; 

    public AuthResponse(String token, String name, String role, Long userId) {
        this.token = token;
        this.name = name;
        this.role = role;
        this.userId = userId;
    }

    // 3. Add Getter and Setter
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    // (Keep existing getters/setters for token, name, role...)
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}