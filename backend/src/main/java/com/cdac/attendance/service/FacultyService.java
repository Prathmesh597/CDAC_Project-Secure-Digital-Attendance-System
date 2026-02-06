package com.cdac.attendance.service;

import com.cdac.attendance.entity.Lecture;
import com.cdac.attendance.repository.LectureRepository;
import com.cdac.attendance.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cdac.attendance.entity.User; 
import com.cdac.attendance.entity.Role; 

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class FacultyService {

    @Autowired
    private LectureRepository lectureRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<Lecture> getFacultyLectures(Long facultyId) {
        List<Lecture> lectures = lectureRepository.findByFacultyId(facultyId);

        // CLEANUP LOGIC
        for (Lecture l : lectures) {
            if (l.getActiveOtp() != null) {
                // If Expiry is missing (Ghost data) OR Time has passed
                if (l.getOtpExpiryTime() == null || LocalDateTime.now().isAfter(l.getOtpExpiryTime())) {
                    l.setActiveOtp(null); 
                    lectureRepository.save(l);
                }
            }
        }
        return lectures;
    }

    public Lecture startClass(Long lectureId, Double lat, Double lon) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new RuntimeException("Lecture not found"));

        // 1. Check if Class was ALREADY conducted
        // If expiry time exists, it means the professor already pressed start once.
        if (lecture.getOtpExpiryTime() != null) {
            throw new RuntimeException("Class already conducted! You cannot restart it.");
        }

        // 2. Generate OTP (No more Time Restrictions on Start Date)
        String otp = String.format("%04d", new Random().nextInt(10000));
        
        lecture.setActiveOtp(otp);
        lecture.setLatitude(lat);
        lecture.setLongitude(lon);
        lecture.setOtpExpiryTime(LocalDateTime.now().plusMinutes(5)); 
        
        return lectureRepository.save(lecture);
    }
    
    public List<User> getStudentList() {
        return userRepository.findByRole(Role.STUDENT);
    }
}