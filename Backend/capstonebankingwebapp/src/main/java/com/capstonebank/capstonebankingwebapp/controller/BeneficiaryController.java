package com.capstonebank.capstonebankingwebapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capstonebank.capstonebankingwebapp.model.Beneficiary;
import com.capstonebank.capstonebankingwebapp.model.Customer;
import com.capstonebank.capstonebankingwebapp.repository.BeneficiaryRepository;
import com.capstonebank.capstonebankingwebapp.repository.CustomerRepository;

@RestController
@RequestMapping("/beneficiary")
public class BeneficiaryController {

    @Autowired
    private BeneficiaryRepository beneficiaryRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping("/add/{username}")
    public ResponseEntity<?> addBeneficiary(@PathVariable String username, @RequestBody Beneficiary beneficiary) {
        try {
            // Find the customer by username
            Customer customer = customerRepository.findByUsername(username);
            if (customer == null) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            // Check if beneficiary account number is the same as the user's account number
            if (customer.getAccountNumber().equals(beneficiary.getAccountNumber())) {
                return new ResponseEntity<>("Cannot add yourself as a beneficiary", HttpStatus.BAD_REQUEST);
            }

            // Check if the beneficiary already exists for the customer
            Beneficiary existingBeneficiary = beneficiaryRepository.findByAccountNumberAndCustomerId(beneficiary.getAccountNumber(), customer.getId());
            if (existingBeneficiary != null) {
                return new ResponseEntity<>("Beneficiary already exists", HttpStatus.BAD_REQUEST);
            }

            // Retrieve beneficiary details from the target customer
            Customer targetCustomer = customerRepository.findByAccountNumber(beneficiary.getAccountNumber());
            if (targetCustomer == null) {
                return new ResponseEntity<>("Target beneficiary not found", HttpStatus.NOT_FOUND);
            }

            // Set beneficiary details
            beneficiary.setName(targetCustomer.getFullName());
            beneficiary.setBankName(targetCustomer.getBankName());
            beneficiary.setCustomer(customer);

            // Save the beneficiary
            Beneficiary savedBeneficiary = beneficiaryRepository.save(beneficiary);
            return new ResponseEntity<>(savedBeneficiary, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while adding the beneficiary", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Fetch all beneficiaries for a specific customer by username
    @GetMapping("/{username}/all")
    public ResponseEntity<?> getAllBeneficiaries(@PathVariable String username) {
        try {
            Customer customer = customerRepository.findByUsername(username);
            if (customer == null) {
                return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
            }

            List<Beneficiary> beneficiaries = beneficiaryRepository.findByCustomerId(customer.getId());
            if (beneficiaries.isEmpty()) {
                return new ResponseEntity<>("No beneficiaries found", HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(beneficiaries, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while fetching beneficiaries", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update a beneficiary's transfer limit using username
    @PutMapping("/update/{id}/{username}")
    public ResponseEntity<?> updateBeneficiary(@PathVariable Long id, @PathVariable String username, @RequestBody Beneficiary updatedDetails) {
        try {
            Customer customer = customerRepository.findByUsername(username);
            if (customer == null) {
                return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
            }

            Beneficiary beneficiary = beneficiaryRepository.findById(id).orElse(null);
            if (beneficiary == null || !beneficiary.getCustomer().getId().equals(customer.getId())) {
                return new ResponseEntity<>("Beneficiary not found or does not belong to the customer", HttpStatus.NOT_FOUND);
            }

            beneficiary.setMaxTransferLimit(updatedDetails.getMaxTransferLimit());
            Beneficiary updatedBeneficiary = beneficiaryRepository.save(beneficiary);
            return new ResponseEntity<>(updatedBeneficiary, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while updating the beneficiary", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete a beneficiary using username
    @DeleteMapping("/delete/{id}/{username}")
    public ResponseEntity<?> deleteBeneficiary(@PathVariable Long id, @PathVariable String username) {
        try {
            Customer customer = customerRepository.findByUsername(username);
            if (customer == null) {
                return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
            }

            Beneficiary beneficiary = beneficiaryRepository.findById(id).orElse(null);
            if (beneficiary == null || !beneficiary.getCustomer().getId().equals(customer.getId())) {
                return new ResponseEntity<>("Beneficiary not found or does not belong to the customer", HttpStatus.NOT_FOUND);
            }

            beneficiaryRepository.deleteById(id);
            return new ResponseEntity<>("Beneficiary deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while deleting the beneficiary", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return new ResponseEntity<>("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
