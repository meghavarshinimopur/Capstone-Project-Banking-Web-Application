package com.capstonebank.capstonebankingwebapp.Admin.controller;


import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capstonebank.capstonebankingwebapp.Admin.repository.AdminRepository;
import com.capstonebank.capstonebankingwebapp.DTO.CustomerProfileDTO;
import com.capstonebank.capstonebankingwebapp.model.Customer;
import com.capstonebank.capstonebankingwebapp.model.UserProfile;
import com.capstonebank.capstonebankingwebapp.repository.CustomerRepository;
import com.capstonebank.capstonebankingwebapp.repository.UserProfileRepository;

    @RestController
    @RequestMapping("/admin/customer-profile")
    public class AdminCustomerProfileController {
    
        @Autowired
        private CustomerRepository customerRepository;
    
        @Autowired
        private UserProfileRepository userProfileRepository;
    
        @Autowired
        private AdminRepository adminRepository;
    
        // Admin View Customer Profile by Account Number
        @GetMapping("/by-account/{accountNumber}")
        public ResponseEntity<?> viewCustomerProfileByAccountNumber(@PathVariable String accountNumber, @RequestHeader("Admin-Username") String adminUsername) {
            try {
                // Validate Admin Login
                if (!adminRepository.existsByUsername(adminUsername)) {
                    return new ResponseEntity<>("Unauthorized access. Admin not logged in.", HttpStatus.UNAUTHORIZED);
                }
    
                // Find Customer by Account Number
                Customer customer = customerRepository.findByAccountNumber(accountNumber);
                if (customer == null) {
                    return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
                }
    
                // Find UserProfile linked to the customer
                UserProfile userProfile = userProfileRepository.findByCustomerId(customer.getId());
                if (userProfile == null) {
                    userProfile = new UserProfile(); // Default placeholder
                    userProfile.setCustomer(customer);
                    userProfile.setAvatarUrl(UserProfile.getDefaultOtherAvatar()); // Default avatar
                }
    
                // Create CustomerProfileDTO
                CustomerProfileDTO profileDTO = new CustomerProfileDTO();
    
                // Populate Customer fields
                profileDTO.setId(customer.getId());
                profileDTO.setEmail(customer.getEmail());
                profileDTO.setUsername(customer.getUsername());
                profileDTO.setFirstName(customer.getFirstName());
                profileDTO.setLastName(customer.getLastName());
                profileDTO.setMobileNumber(customer.getMobileNumber());
                profileDTO.setCreateDate(customer.getCreateDate());
                profileDTO.setAccountNumber(customer.getAccountNumber());
                profileDTO.setBalance(customer.getBalance());
                profileDTO.setStatus(customer.getStatus());
                profileDTO.setRole(customer.getRole());
                profileDTO.setBankName(customer.getBankName());
                profileDTO.setRegistrationDate(customer.getRegistrationDate());
    
                // Populate UserProfile fields
                profileDTO.setDob(userProfile.getDob() != null ? userProfile.getDob() : LocalDate.of(1900, 1, 1));
                profileDTO.setGender(userProfile.getGender() != null ? userProfile.getGender() : "Not Specified");
                profileDTO.setMaritalStatus(userProfile.getMaritalStatus() != null ? userProfile.getMaritalStatus() : "Not Specified");
                profileDTO.setProfilePictureUrl(userProfile.getProfilePictureUrl() != null ? userProfile.getProfilePictureUrl() : "Default Image URL");
                profileDTO.setAccountType(userProfile.getAccountType() != null ? userProfile.getAccountType() : "Not Specified");
                profileDTO.setBranchCode(userProfile.getBranchCode() != null ? userProfile.getBranchCode() : "Not Specified");
                profileDTO.setBranchName(userProfile.getBranchName() != null ? userProfile.getBranchName() : "Not Specified");
                profileDTO.setOccupation(userProfile.getOccupation() != null ? userProfile.getOccupation() : "Not Specified");
                profileDTO.setAnnualIncome(userProfile.getAnnualIncome() != null ? userProfile.getAnnualIncome() : BigDecimal.ZERO);
                profileDTO.setAddress1(userProfile.getAddress1() != null ? userProfile.getAddress1() : "");
                profileDTO.setAddress2(userProfile.getAddress2() != null ? userProfile.getAddress2() : "");
                profileDTO.setCity(userProfile.getCity() != null ? userProfile.getCity() : "Not Specified");
                profileDTO.setState(userProfile.getState() != null ? userProfile.getState() : "Not Specified");
                profileDTO.setPincode(userProfile.getPincode() != null ? userProfile.getPincode() : "");
                profileDTO.setCountry(userProfile.getCountry() != null ? userProfile.getCountry() : "Not Specified");
    
                // Handle Avatar URL based on gender
                if ("Male".equalsIgnoreCase(userProfile.getGender())) {
                    profileDTO.setAvatarUrl(UserProfile.getDefaultMaleAvatar());
                } else if ("Female".equalsIgnoreCase(userProfile.getGender())) {
                    profileDTO.setAvatarUrl(UserProfile.getDefaultFemaleAvatar());
                } else {
                    profileDTO.setAvatarUrl(UserProfile.getDefaultOtherAvatar());
                }
    
                return new ResponseEntity<>(profileDTO, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>("An error occurred while fetching the profile", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    