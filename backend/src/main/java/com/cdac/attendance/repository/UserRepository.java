package com.cdac.attendance.repository;

import com.cdac.attendance.entity.User;
import com.cdac.attendance.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    
    // Used for Login: Finds user by email
    Optional<User> findByEmail(String email);
    
    // Used for Registration: Checks if email already exists
    boolean existsByEmail(String email);
    
    // Used by Admin: To see list of all Faculty or Students
    List<User> findByRole(Role role);
}