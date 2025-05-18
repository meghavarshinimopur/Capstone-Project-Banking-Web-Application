package com.capstonebank.capstonebankingwebapp.conn;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capstonebank.capstonebankingwebapp.model.AgricultureLoan;
import com.capstonebank.capstonebankingwebapp.model.Customer;
import com.capstonebank.capstonebankingwebapp.repository.AgricultureLoanRepository;
import com.capstonebank.capstonebankingwebapp.repository.CustomerRepository;

@RestController
@RequestMapping("/agricultureLoan")
public class AgricultureLoanController {

    private static final Logger logger = LoggerFactory.getLogger(AgricultureLoanController.class);

    @Autowired
    private AgricultureLoanRepository agricultureLoanRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // Apply for an agriculture loan
    @PostMapping("/apply/{username}")
    public ResponseEntity<?> applyForLoan(@PathVariable String username, @RequestBody AgricultureLoan agricultureLoan) {
        try {
            // Validate Customer
            Customer customer = customerRepository.findByUsername(username);
            if (customer == null) {
                return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
            }

            // Validate Loan Data
            if (agricultureLoan.getLoanAmount() == null || agricultureLoan.getLoanAmount().compareTo(BigDecimal.ZERO) <= 0) {
                return new ResponseEntity<>("Invalid loan amount", HttpStatus.BAD_REQUEST);
            }
            if (agricultureLoan.getInterestRate() == null || agricultureLoan.getInterestRate().compareTo(BigDecimal.ZERO) <= 0) {
                return new ResponseEntity<>("Invalid interest rate", HttpStatus.BAD_REQUEST);
            }
            if (agricultureLoan.getTenureInMonths() == null || agricultureLoan.getTenureInMonths() <= 0) {
                return new ResponseEntity<>("Invalid tenure", HttpStatus.BAD_REQUEST);
            }
            if (agricultureLoan.getCropType() == null || agricultureLoan.getCropType().isEmpty()) {
                return new ResponseEntity<>("Crop type is required", HttpStatus.BAD_REQUEST);
            }
            if (agricultureLoan.getRepaymentType() == null || agricultureLoan.getRepaymentType().isEmpty()) {
                return new ResponseEntity<>("Repayment type is required", HttpStatus.BAD_REQUEST);
            }

            // Set Default Values
            agricultureLoan.setCustomer(customer);
            agricultureLoan.setStatus("pending");
            agricultureLoan.setApprovalDate(null); // Approval date remains null until approved
            agricultureLoan.setCreatedDate(LocalDateTime.now());

            // Save Loan
            AgricultureLoan savedLoan = agricultureLoanRepository.save(agricultureLoan);
            return new ResponseEntity<>(savedLoan, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("An error occurred while applying for the loan", e);
            return new ResponseEntity<>("An error occurred while applying for the loan: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // View loans for a user
    @GetMapping("/view/{username}")
    public ResponseEntity<?> viewLoans(@PathVariable String username) {
        try {
            // Validate Customer
            Customer customer = customerRepository.findByUsername(username);
            if (customer == null) {
                return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
            }

            // Fetch Loans
            List<AgricultureLoan> loans = agricultureLoanRepository.findByCustomerId(customer.getId());
            return new ResponseEntity<>(loans, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("An error occurred while fetching loans", e);
            return new ResponseEntity<>("An error occurred while fetching loans: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get pending loans
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingAgricultureLoans() {
        try {
            // Retrieve all pending agriculture loans
            List<AgricultureLoan> pendingAgricultureLoans = agricultureLoanRepository.findByStatus("pending");
            return ResponseEntity.ok(pendingAgricultureLoans);
        } catch (Exception e) {
            logger.error("Error retrieving pending agriculture loans", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving pending agriculture loans: " + e.getMessage());
        }
    }

    // Close an agriculture loan
    @PostMapping("/close/{id}")
    public ResponseEntity<?> closeLoan(@PathVariable Long id) {
        try {
            // Find the agriculture loan by its ID
            AgricultureLoan agricultureLoan = agricultureLoanRepository.findById(id).orElse(null);
            if (agricultureLoan == null || !"pending".equalsIgnoreCase(agricultureLoan.getStatus())) {
                return new ResponseEntity<>("Agriculture loan not found or not eligible for closure", HttpStatus.BAD_REQUEST);
            }

            // Update the status to "approved"
            agricultureLoan.setStatus("approved");
            agricultureLoan.setApprovalDate(LocalDateTime.now());
            agricultureLoanRepository.save(agricultureLoan);
            return new ResponseEntity<>("Agriculture loan closed successfully", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error closing agriculture loan", e);
            return new ResponseEntity<>("Error closing agriculture loan: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete a closed agriculture loan
    @PostMapping("/delete/{id}")
    public ResponseEntity<?> deleteLoan(@PathVariable Long id) {
        try {
            // Find the agriculture loan by its ID
            AgricultureLoan agricultureLoan = agricultureLoanRepository.findById(id).orElse(null);
            if (agricultureLoan == null) {
                return new ResponseEntity<>("Agriculture loan not found", HttpStatus.NOT_FOUND);
            }

            if (!"approved".equalsIgnoreCase(agricultureLoan.getStatus())) {
                return new ResponseEntity<>("Only approved agriculture loans can be deleted", HttpStatus.BAD_REQUEST);
            }

            // Delete the loan
            agricultureLoanRepository.delete(agricultureLoan);
            return new ResponseEntity<>("Closed agriculture loan deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error deleting agriculture loan", e);
            return new ResponseEntity<>("Error deleting agriculture loan: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
