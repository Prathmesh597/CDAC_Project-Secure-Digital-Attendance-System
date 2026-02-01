package com.cdac.attendance.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StudentRegisterDTO {
    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String prn; // Specific to Student

    // Note: We might generate a default password in the backend, 
    // but allowing Admin to set one is fine too.
    private String password; 
}