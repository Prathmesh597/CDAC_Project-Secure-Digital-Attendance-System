package com.cdac.attendance.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; 

    // Many Subjects belong to One Course
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
}