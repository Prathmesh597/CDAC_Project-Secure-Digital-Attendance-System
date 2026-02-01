package com.cdac.attendance.dto;

import lombok.Data;

@Data
public class AttendanceStatsDTO {
    private String subjectName;
    private long totalLectures;
    private long attendedLectures;
    private double percentage;
}