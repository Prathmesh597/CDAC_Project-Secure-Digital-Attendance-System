package com.cdac.attendance.repository;

import com.cdac.attendance.entity.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LectureRepository extends JpaRepository<Lecture, Long> {
    
    // Used for Faculty Dashboard: Show only their lectures
    List<Lecture> findByFacultyId(Long facultyId);
}