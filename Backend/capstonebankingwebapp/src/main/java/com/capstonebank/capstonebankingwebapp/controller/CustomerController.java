package com.capstonebank.capstonebankingwebapp.controller;

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

import com.capstonebank.capstonebankingwebapp.model.Customer;
import com.capstonebank.capstonebankingwebapp.repository.CustomerRepository;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> addUser(@RequestBody Customer user) {
        try {
            if (customerRepository.existsByEmail(user.getEmail())) {
                return new ResponseEntity<>("Email is already taken", HttpStatus.BAD_REQUEST);
            }
            if (customerRepository.existsByUsername(user.getUsername())) {
                return new ResponseEntity<>("Username is already taken", HttpStatus.BAD_REQUEST);
            }
            if (customerRepository.existsByMobileNumber(user.getMobileNumber())) {
                return new ResponseEntity<>("Mobile number is already taken", HttpStatus.BAD_REQUEST);
            }

            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            Customer savedUser = customerRepository.save(user);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while registering the user",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Customer user) {
        try {
            Customer existingUser = customerRepository.findByUsername(user.getUsername());
            if (existingUser != null && bCryptPasswordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
                return new ResponseEntity<>("Login successful!", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Invalid username or password", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while logging in", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/details/{username}")
    public ResponseEntity<?> getUserDetails(@PathVariable String username) {
        try {
            Customer existingUser = customerRepository.findByUsername(username);
            if (existingUser != null) {
                return new ResponseEntity<>(existingUser, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while fetching user details",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/details/account/{accountNumber}")
    public ResponseEntity<?> getCustomerDetailsByAccountNumber(@PathVariable String accountNumber) {
        Customer customer = customerRepository.findByAccountNumber(accountNumber);
        if (customer == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        try {
            // Clear any session or authentication details here if applicable
            return new ResponseEntity<>("Logout successful!", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while logging out", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return new ResponseEntity<>("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
