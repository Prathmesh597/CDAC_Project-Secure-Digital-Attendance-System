package com.cdac.attendance.repository;

import com.cdac.attendance.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    
    // Critical: Used when Admin selects a Course (e.g., DAC) 
    // and we need to load only subjects for that course.
    List<Subject> findByCourseId(Long courseId);
}