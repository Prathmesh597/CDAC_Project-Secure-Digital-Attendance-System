package com.cdac.attendance.service;

import com.cdac.attendance.dto.MarkAttendanceRequest;
import com.cdac.attendance.entity.Attendance;
import com.cdac.attendance.entity.Lecture;
import com.cdac.attendance.entity.User;
import com.cdac.attendance.repository.AttendanceRepository;
import com.cdac.attendance.repository.LectureRepository;
import com.cdac.attendance.repository.UserRepository;
import com.cdac.attendance.utils.DistanceUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDateTime;

@Service
public class StudentService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private LectureRepository lectureRepository;

    @Autowired
    private UserRepository userRepository;

    public String markAttendance(String studentEmail, MarkAttendanceRequest request) {
        
        // 1. Get Data
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Lecture lecture = lectureRepository.findById(request.getLectureId())
                .orElseThrow(() -> new RuntimeException("Lecture not found"));

        // --- DEBUGGING LOGS ---
        System.out.println("========== ATTENDANCE DEBUG ==========");
        System.out.println("Student: " + studentEmail);
        System.out.println("Input OTP: '" + request.getOtp() + "'"); 

        // 2. CRITICAL FIX: Check Expiration
        if (lecture.getOtpExpiryTime() != null && LocalDateTime.now().isAfter(lecture.getOtpExpiryTime())) {
            throw new RuntimeException("Attendance Session Expired! You were too late.");
        }

        // 3. CHECK: Is OTP correct?
        if (lecture.getActiveOtp() == null || !lecture.getActiveOtp().trim().equals(request.getOtp().trim())) {
            throw new RuntimeException("Invalid OTP or Session Closed.");
        }

        // 4. CHECK: Is Duplicate?
        if (attendanceRepository.existsByStudentIdAndLectureId(student.getId(), lecture.getId())) {
            throw new RuntimeException("Attendance already marked!");
        }

        // 5. CHECK: Distance (The Geofence)
        double distance = DistanceUtil.calculateDistance(
                lecture.getLatitude(), lecture.getLongitude(),
                request.getLatitude(), request.getLongitude()
        );

        System.out.println("Distance: " + distance + " meters");

        if (distance > lecture.getRadius()) { 
            throw new RuntimeException("You are too far from the class! Distance: " + (int)distance + "m. (Allowed: " + lecture.getRadius() + "m)");
        }

        // 6. Save Attendance
        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setLecture(lecture);
        attendance.setTimestamp(LocalDateTime.now());
        attendance.setPresent(true);
        attendance.setStudentLatitude(request.getLatitude());
        attendance.setStudentLongitude(request.getLongitude());

        attendanceRepository.save(attendance);
        return "Attendance Marked Successfully!";
    }
    
    public List<Attendance> getStudentHistory(String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
                
        return attendanceRepository.findByStudentId(student.getId());
    }
    
    public List<Lecture> getAllLectures() {
        return lectureRepository.findAll();
    }
}