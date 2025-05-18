package com.capstonebank.capstonebankingwebapp.Admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capstonebank.capstonebankingwebapp.Admin.model.Admin;
import com.capstonebank.capstonebankingwebapp.Admin.repository.AdminRepository;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    // Admin Registration
    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(@RequestBody Admin admin) {
        try {
            if (adminRepository.existsByEmail(admin.getEmail())) {
                return new ResponseEntity<>("Email is already taken", HttpStatus.BAD_REQUEST);
            }

            if (adminRepository.existsByUsername(admin.getUsername())) {
                return new ResponseEntity<>("Username is already taken", HttpStatus.BAD_REQUEST);
            }

            admin.setPassword(bCryptPasswordEncoder.encode(admin.getPassword()));
            Admin savedAdmin = adminRepository.save(admin);
            return new ResponseEntity<>(savedAdmin, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while registering the admin",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Admin Login
    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody Admin admin) {
        try {
            Admin existingAdmin = adminRepository.findByUsername(admin.getUsername());
            if (existingAdmin != null
                    && bCryptPasswordEncoder.matches(admin.getPassword(), existingAdmin.getPassword())) {
                return new ResponseEntity<>("Login successful!", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Invalid username or password", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while logging in", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get Admin Details by Username
    @GetMapping("/details/{username}")
    public ResponseEntity<?> getAdminDetails(@PathVariable String username) {
        try {
            Admin admin = adminRepository.findByUsername(username);
            if (admin == null) {
                return new ResponseEntity<>("Admin not found", HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(admin, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while fetching admin details",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Admin Logout
    @PostMapping("/logout")
    public ResponseEntity<?> logoutAdmin() {
        // Stateless logout just returns a success message
        return new ResponseEntity<>("Logout successful!", HttpStatus.OK);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return new ResponseEntity<>("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
