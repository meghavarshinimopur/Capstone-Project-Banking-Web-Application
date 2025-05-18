package com.capstonebank.capstonebankingwebapp.controller;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capstonebank.capstonebankingwebapp.DTO.CustomerProfileDTO;
import com.capstonebank.capstonebankingwebapp.DTO.PasswordUpdateRequest;
import com.capstonebank.capstonebankingwebapp.model.Customer;
import com.capstonebank.capstonebankingwebapp.model.UserProfile;
import com.capstonebank.capstonebankingwebapp.repository.CustomerRepository;
import com.capstonebank.capstonebankingwebapp.repository.UserProfileRepository;

@RestController
@RequestMapping("/profile")
public class CustomerProfileController {

        @Autowired
        private CustomerRepository customerRepository;

        @Autowired
        private UserProfileRepository userProfileRepository;

        @Autowired
        private BCryptPasswordEncoder bCryptPasswordEncoder;

        @GetMapping("/{username}")
        public ResponseEntity<?> getCompleteProfile(@PathVariable String username) {
                try {
                        Customer customer = customerRepository.findByUsername(username);
                        if (customer == null) {
                                return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
                        }

                        UserProfile userProfile = userProfileRepository.findByCustomerId(customer.getId());
                        // If no UserProfile exists, create a placeholder UserProfile
                        if (userProfile == null) {
                                userProfile = new UserProfile();
                                userProfile.setCustomer(customer); // Link to the customer
                                userProfile.setAvatarUrl(UserProfile.getDefaultOtherAvatar()); // Default avatar
                        }

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
                        profileDTO.setDob(
                                        userProfile.getDob() != null ? userProfile.getDob() : LocalDate.of(1900, 1, 1)); // Default
                                                                                                                         // DOB
                        profileDTO.setGender(
                                        userProfile.getGender() != null ? userProfile.getGender() : "Not Specified");
                        profileDTO.setMaritalStatus(
                                        userProfile.getMaritalStatus() != null ? userProfile.getMaritalStatus()
                                                        : "Not Specified");
                        profileDTO.setProfilePictureUrl(
                                        userProfile.getProfilePictureUrl() != null ? userProfile.getProfilePictureUrl()
                                                        : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.1133634801.1736242704&semt=ais_hybrid");
                        profileDTO.setAccountType(
                                        userProfile.getAccountType() != null ? userProfile.getAccountType()
                                                        : "Not Specified");
                        profileDTO
                                        .setBranchCode(userProfile.getBranchCode() != null ? userProfile.getBranchCode()
                                                        : "Not Specified");
                        profileDTO
                                        .setBranchName(userProfile.getBranchName() != null ? userProfile.getBranchName()
                                                        : "Not Specified");
                        profileDTO
                                        .setOccupation(userProfile.getOccupation() != null ? userProfile.getOccupation()
                                                        : "Not Specified");
                        profileDTO.setAnnualIncome(
                                        userProfile.getAnnualIncome() != null ? userProfile.getAnnualIncome()
                                                        : BigDecimal.ZERO);
                        profileDTO.setAddress1(userProfile.getAddress1() != null ? userProfile.getAddress1() : "");
                        profileDTO.setAddress2(userProfile.getAddress2() != null ? userProfile.getAddress2() : "");
                        profileDTO.setCity(userProfile.getCity() != null ? userProfile.getCity() : "Not Specified");
                        profileDTO.setState(userProfile.getState() != null ? userProfile.getState() : "Not Specified");
                        profileDTO.setPincode(userProfile.getPincode() != null ? userProfile.getPincode() : "");
                        profileDTO.setCountry(
                                        userProfile.getCountry() != null ? userProfile.getCountry() : "Not Specified");

                        // Handle avatar based on gender
                        if ("Male".equalsIgnoreCase(userProfile.getGender())) {
                                profileDTO.setAvatarUrl(UserProfile.getDefaultMaleAvatar());
                        } else if ("Female".equalsIgnoreCase(userProfile.getGender())) {
                                profileDTO.setAvatarUrl(UserProfile.getDefaultFemaleAvatar());
                        } else {
                                profileDTO.setAvatarUrl(UserProfile.getDefaultOtherAvatar());
                        }

                        return new ResponseEntity<>(profileDTO, HttpStatus.OK);
                } catch (Exception e) {
                        return new ResponseEntity<>("An error occurred while fetching the profile",
                                        HttpStatus.INTERNAL_SERVER_ERROR);
                }
        }

        @PutMapping("/updateProfile/{username}")
        public ResponseEntity<?> updateUserProfile(@PathVariable String username,
                        @RequestBody UserProfile updatedProfile) {
                try {
                        // Retrieve the customer by username
                        Customer customer = customerRepository.findByUsername(username);
                        if (customer == null) {
                                return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
                        }

                        // Check if the UserProfile exists, if not, create an empty profile
                        UserProfile userProfile = userProfileRepository.findByCustomerId(customer.getId());
                        if (userProfile == null) {
                                userProfile = new UserProfile();
                                userProfile.setCustomer(customer);
                        }

                        // Update fields only if provided (preserve already saved values)
                        userProfile.setDob(updatedProfile.getDob() != null ? updatedProfile.getDob()
                                        : userProfile.getDob());
                        userProfile.setGender(
                                        updatedProfile.getGender() != null ? updatedProfile.getGender()
                                                        : userProfile.getGender());
                        userProfile.setMaritalStatus(
                                        updatedProfile.getMaritalStatus() != null ? updatedProfile.getMaritalStatus()
                                                        : userProfile.getMaritalStatus());
                        userProfile.setProfilePictureUrl(
                                        updatedProfile.getProfilePictureUrl() != null
                                                        ? updatedProfile.getProfilePictureUrl()
                                                        : userProfile.getProfilePictureUrl());
                        userProfile.setAccountType(
                                        updatedProfile.getAccountType() != null ? updatedProfile.getAccountType()
                                                        : userProfile.getAccountType());
                        userProfile.setBranchCode(
                                        updatedProfile.getBranchCode() != null ? updatedProfile.getBranchCode()
                                                        : userProfile.getBranchCode());
                        userProfile.setBranchName(
                                        updatedProfile.getBranchName() != null ? updatedProfile.getBranchName()
                                                        : userProfile.getBranchName());
                        userProfile.setOccupation(
                                        updatedProfile.getOccupation() != null ? updatedProfile.getOccupation()
                                                        : userProfile.getOccupation());
                        userProfile.setAnnualIncome(
                                        updatedProfile.getAnnualIncome() != null ? updatedProfile.getAnnualIncome()
                                                        : userProfile.getAnnualIncome());
                        userProfile.setAddress1(
                                        updatedProfile.getAddress1() != null ? updatedProfile.getAddress1()
                                                        : userProfile.getAddress1());
                        userProfile.setAddress2(
                                        updatedProfile.getAddress2() != null ? updatedProfile.getAddress2()
                                                        : userProfile.getAddress2());
                        userProfile.setCity(updatedProfile.getCity() != null ? updatedProfile.getCity()
                                        : userProfile.getCity());
                        userProfile
                                        .setState(updatedProfile.getState() != null ? updatedProfile.getState()
                                                        : userProfile.getState());
                        userProfile.setPincode(
                                        updatedProfile.getPincode() != null ? updatedProfile.getPincode()
                                                        : userProfile.getPincode());
                        userProfile.setCountry(
                                        updatedProfile.getCountry() != null ? updatedProfile.getCountry()
                                                        : userProfile.getCountry());

                        // Save the updated profile
                        userProfileRepository.save(userProfile);

                        return new ResponseEntity<>("UserProfile updated successfully", HttpStatus.OK);
                } catch (Exception e) {
                        return new ResponseEntity<>("An error occurred while updating the profile",
                                        HttpStatus.INTERNAL_SERVER_ERROR);
                }
        }

        @PostMapping("/updatePassword/{username}")
        public ResponseEntity<?> updatePassword(@PathVariable String username, @RequestBody PasswordUpdateRequest passwordUpdateRequest) {
            try {
                Customer existingUser = customerRepository.findByUsername(username);
                if (existingUser == null) {
                    return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
                }
        
                // Verify current password
                if (!bCryptPasswordEncoder.matches(passwordUpdateRequest.getCurrentPassword(), existingUser.getPassword())) {
                    return new ResponseEntity<>("Current password is incorrect", HttpStatus.UNAUTHORIZED);
                }
        
                // Update the password
                existingUser.setPassword(bCryptPasswordEncoder.encode(passwordUpdateRequest.getNewPassword()));
                customerRepository.save(existingUser);
        
                return new ResponseEntity<>("Password updated successfully!", HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>("An error occurred while updating the password", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
}