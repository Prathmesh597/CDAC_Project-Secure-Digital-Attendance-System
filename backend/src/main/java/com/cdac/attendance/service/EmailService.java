package com.cdac.attendance.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("daclab2025@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Password Reset OTP - Attendance System");
        message.setText("Hello,\n\nYour OTP for password reset is: " + otp + "\n\nThis OTP is valid for 5 minutes.\n\nRegards,\nAdmin Team");

        mailSender.send(message);
        System.out.println("Mail sent to " + toEmail); // Backup log
    }
}