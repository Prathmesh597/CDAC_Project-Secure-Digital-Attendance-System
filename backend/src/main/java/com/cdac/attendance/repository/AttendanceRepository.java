package com.cdac.attendance.repository;

import com.cdac.attendance.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    // Critical: Checks if this student already marked attendance for this lecture.
    // Prevents double-clicking or cheating.
    boolean existsByStudentIdAndLectureId(Long studentId, Long lectureId);
    
    // Used for Student Dashboard: Show their history
    List<Attendance> findByStudentId(Long studentId);
    
    // Used for Admin/Faculty: Count total present students for a class
    long countByLectureId(Long lectureId);
    
    List<Attendance> findByLectureId(Long lectureId);
}