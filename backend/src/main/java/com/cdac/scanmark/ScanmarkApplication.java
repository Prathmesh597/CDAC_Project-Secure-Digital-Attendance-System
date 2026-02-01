package com.cdac.scanmark;

import com.cdac.scanmark.entities.*;
import com.cdac.scanmark.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@SpringBootApplication
public class ScanmarkApplication {

    public static void main(String[] args) {
        SpringApplication.run(ScanmarkApplication.class, args);
    }

    @Bean
    @Transactional
    public CommandLineRunner initDatabase(StudentRepository studentRepo,
                                          CoordinatorRepository coordRepo,
                                          FacultyRepository facultyRepo,
                                          LectureRepository lectureRepo,
                                          PasswordsRepository passwordsRepo,
                                          PasswordEncoder passwordEncoder) {
        return args -> {
            System.out.println("🚀 STARTING MASTER DATABASE INIT...");

            // --- 1. SETUP STUDENT (Prathmesh) ---
            Long studentPrn = 25084122101L;
            Student student;
            if (studentRepo.existsById(studentPrn)) {
                student = studentRepo.findById(studentPrn).get();
            } else {
                System.out.println("... Creating Missing Student ...");
                student = new Student();
                student.setPrn(studentPrn);
                student.setName("Prathmesh Student");
                student.setEmail("prathmesh@example.com");
                student.setIsVerified(true);
                student = studentRepo.save(student);
            }
            createPasswordIfMissing(passwordsRepo, passwordEncoder, student, null, null, "1234");
            System.out.println("✅ Student 'Prathmesh' ready.");


            // --- 2. SETUP FACULTY (Prof. Java) ---
            String facultyCode = "FAC001";
            Faculty faculty;
            if (facultyRepo.existsById(facultyCode)) {
                faculty = facultyRepo.findById(facultyCode).get();
            } else {
                System.out.println("... Creating Missing Faculty ...");
                faculty = new Faculty();
                faculty.setFacultyCode(facultyCode);
                faculty.setName("Prof. Java");
                faculty.setEmail("java@example.com");
                faculty.setDepartment("DAC");
                faculty.setIsVerified(true);
                faculty = facultyRepo.save(faculty);
            }


            // --- 3. SETUP LECTURE (ID 1) ---
            // Student needs a lecture to mark attendance against
            Long lectureId = 1L;
            if (!lectureRepo.existsById(lectureId)) {
                System.out.println("... Creating Missing Lecture (ID 1) ...");
                Lecture lecture = new Lecture();
                // Note: We don't set ID manually if it's auto-generated.
                lecture.setSubjectName("Spring Boot Logic");
                lecture.setFacultyName(faculty.getName());
                
                // --- FIX: Set the Object, not the Code ---
                lecture.setFaculty(faculty); 
                
                lecture.setLectureTime(LocalDateTime.now());
                lectureRepo.save(lecture);
                System.out.println("✅ Lecture 'Spring Boot Logic' created.");
            }


            // --- 4. SETUP COORDINATOR (Admin) ---
            Coordinator admin;
            List<Coordinator> allCoordinators = coordRepo.findAll();
            if (!allCoordinators.isEmpty()) {
                admin = allCoordinators.get(0);
            } else {
                System.out.println("... Creating Missing Coordinator ...");
                admin = new Coordinator();
                admin.setName("Admin Coordinator");
                admin.setEmail("admin@example.com"); 
                admin.setIsVerified(true);
                admin = coordRepo.save(admin);
            }
            createPasswordIfMissing(passwordsRepo, passwordEncoder, null, admin, null, "1234");
            System.out.println("✅ Coordinator 'Admin' ready.");
            
            System.out.println("🚀 MASTER INIT COMPLETE");
        };
    }

    private void createPasswordIfMissing(PasswordsRepository repo, PasswordEncoder encoder, 
                                         Student student, Coordinator coordinator, Faculty faculty, String plainPassword) {
        Optional<Passwords> existing = Optional.empty();
        
        if (student != null) existing = repo.findByStudent(student);
        else if (coordinator != null) existing = repo.findByCoordinator(coordinator);
        
        if (existing.isPresent()) {
            Passwords entry = existing.get();
            entry.setPassword(encoder.encode(plainPassword));
            repo.save(entry);
        } else {
            Passwords newEntry = new Passwords();
            if (student != null) newEntry.setStudent(student);
            if (coordinator != null) newEntry.setCoordinator(coordinator);
            newEntry.setPassword(encoder.encode(plainPassword));
            repo.save(newEntry);
        }
    }
}