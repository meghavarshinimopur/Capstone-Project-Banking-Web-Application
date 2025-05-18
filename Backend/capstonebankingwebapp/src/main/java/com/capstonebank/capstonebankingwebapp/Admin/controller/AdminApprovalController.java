package com.capstonebank.capstonebankingwebapp.Admin.controller;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capstonebank.capstonebankingwebapp.Admin.repository.AdminRepository;
import com.capstonebank.capstonebankingwebapp.model.AgricultureLoan;
import com.capstonebank.capstonebankingwebapp.model.Card;
import com.capstonebank.capstonebankingwebapp.model.FixedDeposit;
import com.capstonebank.capstonebankingwebapp.model.HomeLoan;
import com.capstonebank.capstonebankingwebapp.repository.AgricultureLoanRepository;
import com.capstonebank.capstonebankingwebapp.repository.CardRepository;
import com.capstonebank.capstonebankingwebapp.repository.FixedDepositRepository;
import com.capstonebank.capstonebankingwebapp.repository.HomeLoanRepository;

@RestController
@RequestMapping("/admin/approve")
public class AdminApprovalController {

    @Autowired
    private AgricultureLoanRepository agricultureLoanRepository;

    @Autowired
    private HomeLoanRepository homeLoanRepository;

    @Autowired
    private FixedDepositRepository fixedDepositRepository;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private AdminRepository adminRepository;

    // Method to check if admin is logged in
    private boolean isAdminLoggedIn(String adminUsername) {
        return adminRepository.existsByUsername(adminUsername);
    }

    // Approve Agriculture Loan
    @PutMapping("/agricultureLoan/{id}")
    public ResponseEntity<?> approveAgricultureLoan(@PathVariable Long id, @RequestHeader("Admin-Username") String adminUsername) {
        if (!isAdminLoggedIn(adminUsername)) {
            return new ResponseEntity<>("Unauthorized access. Admin not logged in.", HttpStatus.UNAUTHORIZED);
        }

        try {
            AgricultureLoan agricultureLoan = agricultureLoanRepository.findById(id).orElse(null);
            if (agricultureLoan == null || !"pending".equals(agricultureLoan.getStatus())) {
                return new ResponseEntity<>("Agriculture Loan not found or already processed", HttpStatus.BAD_REQUEST);
            }

            agricultureLoan.setStatus("approved");
            agricultureLoan.setApprovalDate(LocalDateTime.now());
            agricultureLoan.setUpdatedDate(LocalDateTime.now());
            agricultureLoanRepository.save(agricultureLoan);
            return new ResponseEntity<>("Agriculture Loan approved successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while approving the Agriculture Loan: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Approve Home Loan
    @PutMapping("/homeLoan/{id}")
    public ResponseEntity<?> approveHomeLoan(@PathVariable Long id, @RequestHeader("Admin-Username") String adminUsername) {
        if (!isAdminLoggedIn(adminUsername)) {
            return new ResponseEntity<>("Unauthorized access. Admin not logged in.", HttpStatus.UNAUTHORIZED);
        }

        try {
            HomeLoan homeLoan = homeLoanRepository.findById(id).orElse(null);
            if (homeLoan == null || !"pending".equals(homeLoan.getStatus())) {
                return new ResponseEntity<>("Home Loan not found or already processed", HttpStatus.BAD_REQUEST);
            }

            homeLoan.setStatus("approved");
            homeLoan.setApprovalDate(LocalDateTime.now());
            homeLoan.setUpdatedDate(LocalDateTime.now());
            homeLoanRepository.save(homeLoan);
            return new ResponseEntity<>("Home Loan approved successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while approving the Home Loan: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Approve Fixed Deposit
    @PutMapping("/fixedDeposit/{id}")
    public ResponseEntity<?> approveFixedDeposit(@PathVariable Long id, @RequestHeader("Admin-Username") String adminUsername) {
        if (!isAdminLoggedIn(adminUsername)) {
            return new ResponseEntity<>("Unauthorized access. Admin not logged in.", HttpStatus.UNAUTHORIZED);
        }

        try {
            FixedDeposit fixedDeposit = fixedDepositRepository.findById(id).orElse(null);
            if (fixedDeposit == null || !"active".equals(fixedDeposit.getStatus())) {
                return new ResponseEntity<>("Fixed Deposit not found or already processed", HttpStatus.BAD_REQUEST);
            }

            fixedDeposit.setStatus("approved");
            fixedDepositRepository.save(fixedDeposit);
            return new ResponseEntity<>("Fixed Deposit approved successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while approving the Fixed Deposit: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Approve Card
    @PutMapping("/card/{id}")
    public ResponseEntity<?> approveCard(@PathVariable Long id, @RequestHeader("Admin-Username") String adminUsername) {
        // Check if the admin is logged in
        if (!isAdminLoggedIn(adminUsername)) {
            return new ResponseEntity<>("Unauthorized access. Admin not logged in.", HttpStatus.UNAUTHORIZED);
        }
    
        try {
            // Retrieve the card by its ID
            Optional<Card> cardOptional = cardRepository.findById(id);
            if (cardOptional.isEmpty()) {
                return new ResponseEntity<>("Card not found.", HttpStatus.NOT_FOUND);
            }
    
            Card card = cardOptional.get();
    
            // Check if the card is already approved
            if ("approved".equalsIgnoreCase(card.getStatus())) {
                return new ResponseEntity<>("Card is already approved.", HttpStatus.BAD_REQUEST);
            }
    
            // Approve the card
            card.setStatus("approved");
            card.setApprovalDate(LocalDateTime.now());
            cardRepository.save(card);
    
            // Return success message
            return new ResponseEntity<>("Card approved successfully.", HttpStatus.OK);
        } catch (Exception e) {
            // Handle unexpected errors
            return new ResponseEntity<>("An error occurred while approving the card: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

