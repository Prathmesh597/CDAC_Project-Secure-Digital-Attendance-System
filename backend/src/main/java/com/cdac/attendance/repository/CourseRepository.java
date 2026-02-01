package com.cdac.attendance.repository;

import com.cdac.attendance.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
    // No special queries needed yet. 
    // findAll() is provided by default.
}