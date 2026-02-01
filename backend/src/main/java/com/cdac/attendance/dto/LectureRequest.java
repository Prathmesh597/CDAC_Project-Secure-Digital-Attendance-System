package com.cdac.attendance.dto;
import java.time.LocalDateTime;

public class LectureRequest {
    private Long facultyId;
    private String subjectName; // CHANGED from Long subjectId
    private LocalDateTime startTime;

    // Getters and Setters
    public Long getFacultyId() { return facultyId; }
    public void setFacultyId(Long facultyId) { this.facultyId = facultyId; }
    
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
}