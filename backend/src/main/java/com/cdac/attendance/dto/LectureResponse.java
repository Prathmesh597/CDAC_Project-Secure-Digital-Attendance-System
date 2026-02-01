package com.cdac.attendance.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LectureResponse {
    private Long id;
    private String subjectName;
    private String facultyName;
    private LocalDateTime startTime;
    private boolean active; // Is the class currently happening?
}