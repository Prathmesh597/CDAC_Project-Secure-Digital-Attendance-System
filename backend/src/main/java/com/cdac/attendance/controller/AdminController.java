package com.cdac.attendance.controller;

import com.cdac.attendance.dto.FacultyRegisterDTO;
import com.cdac.attendance.dto.LectureRequest;
import com.cdac.attendance.dto.StudentRegisterDTO;
import com.cdac.attendance.entity.User;
import com.cdac.attendance.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.cdac.attendance.entity.Attendance;
import com.cdac.attendance.entity.Course;
import com.cdac.attendance.entity.Lecture;
import com.cdac.attendance.entity.Subject;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/student")
    public ResponseEntity<?> registerStudent(@RequestBody StudentRegisterDTO dto) {
        User savedUser = adminService.registerStudent(dto);
        return ResponseEntity.ok("Student Registered with ID: " + savedUser.getId());
    }

    @PostMapping("/faculty")
    public ResponseEntity<?> registerFaculty(@RequestBody FacultyRegisterDTO dto) {
        User savedUser = adminService.registerFaculty(dto);
        return ResponseEntity.ok("Faculty Registered with ID: " + savedUser.getId());
    }

    @PostMapping("/lecture")
    public ResponseEntity<?> scheduleLecture(@RequestBody LectureRequest request) {
        adminService.scheduleLecture(request);
        return ResponseEntity.ok("Lecture Scheduled Successfully");
    }
    
    @GetMapping("/lectures/{lectureId}/report")
    public ResponseEntity<List<Attendance>> getLectureReport(@PathVariable Long lectureId) {
        return ResponseEntity.ok(adminService.getLectureReport(lectureId));
    }
    
    @GetMapping("/students")
    public ResponseEntity<List<User>> getAllStudents() {
        return ResponseEntity.ok(adminService.getAllStudents());
    }

    @GetMapping("/faculty")
    public ResponseEntity<List<User>> getAllFaculty() {
        return ResponseEntity.ok(adminService.getAllFaculty());
    }
    
    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(adminService.getAllCourses());
    }

    @GetMapping("/courses/{courseId}/subjects")
    public ResponseEntity<List<Subject>> getSubjectsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(adminService.getSubjectsByCourse(courseId));
    }
    
    @GetMapping("/lectures")
    public ResponseEntity<List<Lecture>> getAllLectures() {
        return ResponseEntity.ok(adminService.getAllLectures());
    }
    
    @GetMapping("/attendance/all")
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        return ResponseEntity.ok(adminService.getAllAttendanceRecords());
    }
}