package com.cdac.attendance.dto;

import lombok.Data;

@Data
public class MarkAttendanceRequest {
    private Long lectureId;
    private String otp;     // The 4-digit code
    private Double latitude;
    private Double longitude;
}