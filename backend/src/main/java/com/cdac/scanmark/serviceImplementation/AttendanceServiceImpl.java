package com.cdac.scanmark.serviceImplementation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.cdac.scanmark.dto.AttendanceRequest;
import com.cdac.scanmark.entities.Attendance;
import com.cdac.scanmark.entities.Lecture;
import com.cdac.scanmark.entities.QRData;
import com.cdac.scanmark.entities.Student;
import com.cdac.scanmark.repository.AttendanceRepository;
import com.cdac.scanmark.repository.LectureRepository;
import com.cdac.scanmark.repository.QRDataRepository;
import com.cdac.scanmark.repository.StudentRepository;
import com.cdac.scanmark.service.AttendanceService;

import jakarta.validation.ValidationException;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final QRDataRepository qrDataRepository;
    private final StudentRepository studentRepository;
    private final LectureRepository lectureRepository;

    public AttendanceServiceImpl(LectureRepository lectureRepository, AttendanceRepository attendanceRepository,
            QRDataRepository qrDataRepository,
            StudentRepository studentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.lectureRepository = lectureRepository;
        this.studentRepository = studentRepository;
        this.qrDataRepository = qrDataRepository;
    }

    // --- STANDARD CRUD METHODS (Unchanged) ---
    @Override
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    @Override
    public Attendance getAttendanceById(Long id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found with ID: " + id));
    }

    @Override
    public Attendance updateAttendance(Long id, Attendance attendance) {
        Attendance existingAttendance = getAttendanceById(id);
        existingAttendance.setIsPresent(attendance.getIsPresent());
        return attendanceRepository.save(existingAttendance);
    }

    @Override
    public void deleteAttendance(Long id) {
        Attendance attendance = getAttendanceById(id);
        attendanceRepository.delete(attendance);
    }

    @Override
    public List<Attendance> getAttendanceByStudent(Long prn) {
        return attendanceRepository.findByStudentPrn(prn);
    }

    @Override
    public List<Attendance> getAttendanceByLecture(Long lectureId) {
        return attendanceRepository.findByLectureId(lectureId);
    }

    @Override
    public List<Attendance> getAttendanceByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        return attendanceRepository.findByLectureDateBetween(startOfDay, endOfDay);
    }

    // --- THE MAIN LOGIC (MODIFIED FOR DEMO) ---
    @Override
    public void markAttendance(AttendanceRequest request) {
        
        // --- FIX FOR DEMO: IGNORE FRONTEND ID, PICK LATEST LECTURE ---
        // Instead of using request.getLectureId(), we fetch the LAST lecture created.
        List<Lecture> allLectures = lectureRepository.findAll();
        if (allLectures.isEmpty()) {
             throw new ValidationException("No lectures exist!");
        }
        Lecture lecture = allLectures.get(allLectures.size() - 1); // Get the last one
        Long lectureId = lecture.getId();
        System.out.println("⚠️ DEMO MODE: Marking attendance for Latest Lecture ID: " + lectureId + " (" + lecture.getSubjectName() + ")");
        // -------------------------------------------------------------
        
        // 2. Fetch Student
        Student student = studentRepository.findByPrn(request.getStudentPrn())
                .orElseThrow(() -> new ValidationException("Student not found for prn: " + request.getStudentPrn()));

        // (We already have the lecture object from the fix above, so we don't need to fetch it again)

        // 3. Prevent Duplicate Attendance (Logic Check)
        // Check if this student already marked attendance for THIS SPECIFIC lecture
        List<Attendance> existing = attendanceRepository.findByStudentPrn(request.getStudentPrn());
        boolean alreadyMarked = existing.stream().anyMatch(a -> a.getLectureId().equals(lectureId));
        
        if (alreadyMarked) {
             throw new ValidationException("Attendance already marked for this lecture!");
        }

        // 4. Save Attendance
        Attendance attendance = new Attendance();
        attendance.setStudentPrn(request.getStudentPrn());
        attendance.setStudentName(student.getName());
        attendance.setLectureId(lectureId);
        attendance.setSubjectName(lecture.getSubjectName());
        attendance.setFacultyName(lecture.getFacultyName());
        attendance.setLectureTime(lecture.getLectureTime());
        attendance.setLectureDate(lecture.getLectureTime().toLocalDate());
        attendance.setIsPresent(true);

        attendanceRepository.save(attendance);
        System.out.println("Success: Marked attendance for " + student.getName());
    }

    // --- REPORTING METHODS (Unchanged) ---
    @Override
    public List<Attendance> getAttendanceByPrn(Long prn){
        return attendanceRepository.findByStudentPrn(prn);
    }

    @Override
    public List<Attendance> getAttendanceByStudentName(String name){
        return attendanceRepository.findByStudentName(name);
    }

    @Override
    public List<Attendance> getTodaysAttendance(){
        return attendanceRepository.findByLectureDate(LocalDate.now());
    }

    @Override
    public List<Attendance> getCurrentMonthAttendance() {
        YearMonth currentMonth = YearMonth.now();
        LocalDate startOfMonth = currentMonth.atDay(1);
        LocalDate endOfMonth = currentMonth.atEndOfMonth();
        return attendanceRepository.findByMonth(startOfMonth, endOfMonth);
    }
}