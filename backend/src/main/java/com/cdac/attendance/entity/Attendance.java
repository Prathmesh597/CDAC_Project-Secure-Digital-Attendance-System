package com.cdac.attendance.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lecture_id", nullable = false)
    private Lecture lecture;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(nullable = false)
    private LocalDateTime timestamp; // When they marked attendance

    private boolean isPresent; // True = Present
    
    // Optional: Store where the student was when they clicked 'Mark'
    // Good for auditing if someone disputes the attendance later.
    private Double studentLatitude;
    private Double studentLongitude;
}