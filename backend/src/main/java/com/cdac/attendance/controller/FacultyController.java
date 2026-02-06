package com.cdac.attendance.controller;

import com.cdac.attendance.entity.Lecture;
import com.cdac.attendance.entity.User;
import com.cdac.attendance.service.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    @Autowired
    private FacultyService facultyService;

    // "Show my lectures"
    @GetMapping("/lectures/{facultyId}")
    public ResponseEntity<List<Lecture>> getMyLectures(@PathVariable Long facultyId) {
        return ResponseEntity.ok(facultyService.getFacultyLectures(facultyId));
    }

    // "Start Class" (Expects Lat/Lon in body)
    // Example JSON: { "lat": 18.5204, "lon": 73.8567 }
    @PostMapping("/lectures/{lectureId}/start")
    public ResponseEntity<?> startClass(@PathVariable Long lectureId, @RequestBody Map<String, Double> location) {
        Lecture updatedLecture = facultyService.startClass(
            lectureId, 
            location.get("lat"), 
            location.get("lon")
        );
        return ResponseEntity.ok("Class Started! OTP is: " + updatedLecture.getActiveOtp());
    }
    
    @GetMapping("/students")
    public ResponseEntity<List<User>> getStudents() {
        return ResponseEntity.ok(facultyService.getStudentList());
    }
}