package com.cdac.attendance.service;

import com.cdac.attendance.dto.StudentRegisterDTO;
import com.cdac.attendance.dto.FacultyRegisterDTO;
import com.cdac.attendance.dto.LectureRequest;
import com.cdac.attendance.entity.*;
import com.cdac.attendance.repository.*;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.cdac.attendance.entity.Attendance;
import com.cdac.attendance.repository.AttendanceRepository;

import com.cdac.attendance.entity.Course;
import com.cdac.attendance.entity.Subject;
import com.cdac.attendance.repository.CourseRepository;
import com.cdac.attendance.repository.SubjectRepository;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LectureRepository lectureRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private CourseRepository courseRepository;

    

    // --- User Management ---

    public User registerStudent(StudentRegisterDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        User student = new User();
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setPassword(passwordEncoder.encode(dto.getPassword())); // Hash Password!
        student.setPrn(dto.getPrn());
        student.setRole(Role.STUDENT);
        return userRepository.save(student);
    }

    public User registerFaculty(FacultyRegisterDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        User faculty = new User();
        faculty.setName(dto.getName());
        faculty.setEmail(dto.getEmail());
        faculty.setPassword(passwordEncoder.encode(dto.getPassword()));
        faculty.setFacultyCode(dto.getFacultyCode());
        faculty.setRole(Role.FACULTY);
        return userRepository.save(faculty);
    }

    // --- Scheduling ---

    public Lecture scheduleLecture(LectureRequest request) {
        User faculty = userRepository.findById(request.getFacultyId())
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        
        Lecture lecture = new Lecture();
        lecture.setFaculty(faculty);
        lecture.setSubjectName(request.getSubjectName()); 
        lecture.setStartTime(request.getStartTime());
        
        return lectureRepository.save(lecture);
    }
    
    public List<Attendance> getLectureReport(Long lectureId) {
      
        return attendanceRepository.findByLectureId(lectureId);
    }
    
    public List<User> getAllStudents() {
        return userRepository.findByRole(Role.STUDENT);
    }

    public List<User> getAllFaculty() {
        return userRepository.findByRole(Role.FACULTY);
    }
    
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<Subject> getSubjectsByCourse(Long courseId) {
        return subjectRepository.findByCourseId(courseId);
    }
    
    public List<Lecture> getAllLectures() {
        return lectureRepository.findAll();
    }
    
    public List<Attendance> getAllAttendanceRecords() {
        return attendanceRepository.findAll();
    }
}