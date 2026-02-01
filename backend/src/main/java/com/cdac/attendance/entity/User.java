package com.cdac.attendance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users") 
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    @Email(message = "Invalid email format")
    private String email;

    @Column(nullable = false)
    private String password;

    // We store the Role as a String (e.g., "STUDENT") in the DB for readability
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // --- Role Specific Fields (Sparse Columns) ---

    // Only for Students (Unique, but nullable for Faculty/Admin)
    @Column(unique = true) 
    private String prn;

    // Only for Faculty (Unique, but nullable for Student/Admin)
    @Column(unique = true)
    private String facultyCode;
}