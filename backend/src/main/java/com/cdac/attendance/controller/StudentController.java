package com.cdac.attendance.controller;

import com.cdac.attendance.dto.MarkAttendanceRequest;
import com.cdac.attendance.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import com.cdac.attendance.entity.Lecture;
import com.cdac.attendance.entity.Attendance;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // Interview Note: We use 'Principal' to get the email of the currently logged-in student.
    // This prevents a student from marking attendance for someone else by hacking the ID.
    @PostMapping("/attendance")
    public ResponseEntity<?> markAttendance(@RequestBody MarkAttendanceRequest request, Principal principal) {
        String studentEmail = principal.getName(); // Extracted from the JWT Token
        String result = studentService.markAttendance(studentEmail, request);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/history")
    public ResponseEntity<List<Attendance>> getMyHistory(Principal principal) {
        return ResponseEntity.ok(studentService.getStudentHistory(principal.getName()));
    }
    
    @GetMapping("/lectures")
    public ResponseEntity<List<Lecture>> getStudentLectures() {
        return ResponseEntity.ok(studentService.getAllLectures());
    }
}