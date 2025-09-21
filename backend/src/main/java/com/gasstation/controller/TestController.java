package com.gasstation.controller;

import com.gasstation.entity.User;
import com.gasstation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/create-user")
    public ResponseEntity<?> createTestUser(@RequestBody Map<String, String> request) {
        try {
            User user = new User();
            user.setUsername(request.get("username"));
            user.setEmail(request.get("email"));
            user.setPassword(passwordEncoder.encode(request.get("password")));
            user.setFirstName(request.get("firstName"));
            user.setLastName(request.get("lastName"));
            user.setActive(true);
            
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok("User created: " + savedUser.getUsername());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating user: " + e.getMessage());
        }
    }

    @GetMapping("/db-test")
    public ResponseEntity<?> testDatabase() {
        try {
            long userCount = userRepository.count();
            return ResponseEntity.ok("Database connected! User count: " + userCount);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Database error: " + e.getMessage());
        }
    }
} 