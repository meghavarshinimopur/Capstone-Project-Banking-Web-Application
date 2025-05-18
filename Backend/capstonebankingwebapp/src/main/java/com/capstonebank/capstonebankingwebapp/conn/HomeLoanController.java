package com.capstonebank.capstonebankingwebapp.conn;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capstonebank.capstonebankingwebapp.model.Customer;
import com.capstonebank.capstonebankingwebapp.model.HomeLoan;
import com.capstonebank.capstonebankingwebapp.repository.CustomerRepository;
import com.capstonebank.capstonebankingwebapp.repository.HomeLoanRepository;

@RestController
@RequestMapping("/homeLoan")
public class HomeLoanController {

    @Autowired
    private HomeLoanRepository homeLoanRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // Apply for a home loan
    @PostMapping("/apply/{username}")
    public ResponseEntity<?> applyForLoan(@PathVariable String username, @RequestBody HomeLoan homeLoan) {
        try {
            // Validate Customer
            Customer customer = customerRepository.findByUsername(username);
            if (customer == null) {
                return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
            }

            // Calculate EMI
            BigDecimal monthlyInterestRate = homeLoan.getInterestRate()
                                                .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP)
                                                .divide(BigDecimal.valueOf(12), 10, RoundingMode.HALF_UP);
            BigDecimal numerator = homeLoan.getLoanAmount().multiply(monthlyInterestRate)
                                           .multiply((BigDecimal.ONE.add(monthlyInterestRate)).pow(homeLoan.getTenureInMonths()));
            BigDecimal denominator = (BigDecimal.ONE.add(monthlyInterestRate).pow(homeLoan.getTenureInMonths()))
                                    .subtract(BigDecimal.ONE);
            BigDecimal emi = numerator.divide(denominator, 10, RoundingMode.HALF_UP);

            // Set Values for HomeLoan
            homeLoan.setCustomer(customer);
            homeLoan.setEmiAmount(emi); // Set calculated EMI
            homeLoan.setStatus("pending"); // Default status
            homeLoan.setApprovalDate(null); // Null approval date for "pending" status
            homeLoan.setCreatedDate(LocalDateTime.now()); // Set creation time

            // Save Loan
            HomeLoan savedLoan = homeLoanRepository.save(homeLoan);
            return new ResponseEntity<>(savedLoan, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace(); // Log stack trace for debugging
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
            List<HomeLoan> loans = homeLoanRepository.findByCustomerId(customer.getId());
            return new ResponseEntity<>(loans, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace(); // Log stack trace for debugging
            return new ResponseEntity<>("An error occurred while fetching loans: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/pending")
public ResponseEntity<?> getPendingHomeLoans() {
    try {
        // Retrieve all pending home loans
        List<HomeLoan> pendingHomeLoans = homeLoanRepository.findByStatus("pending");
        return ResponseEntity.ok(pendingHomeLoans);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving pending home loans: " + e.getMessage());
    }
}
// Close a home loan
    @PutMapping("/close/{id}")
    public ResponseEntity<?> closeHomeLoan(@PathVariable Long id) {
        try {
            // Find the home loan by its ID
            HomeLoan homeLoan = homeLoanRepository.findById(id).orElse(null);
            if (homeLoan == null || !"active".equalsIgnoreCase(homeLoan.getStatus())) {
                return new ResponseEntity<>("Home loan not found or already closed.", HttpStatus.BAD_REQUEST);
            }

            // Update the status to "closed"
            homeLoan.setStatus("closed");
            homeLoanRepository.save(homeLoan);
            return new ResponseEntity<>("Home loan closed successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error closing home loan: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete a closed home loan
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteHomeLoan(@PathVariable Long id) {
        try {
            // Find the home loan by its ID
            HomeLoan homeLoan = homeLoanRepository.findById(id).orElse(null);
            if (homeLoan == null) {
                return new ResponseEntity<>("Home loan not found.", HttpStatus.NOT_FOUND);
            }

            if (!"closed".equalsIgnoreCase(homeLoan.getStatus())) {
                return new ResponseEntity<>("Only closed home loans can be deleted.", HttpStatus.BAD_REQUEST);
            }

            // Delete the home loan
            homeLoanRepository.delete(homeLoan);
            return new ResponseEntity<>("Closed home loan deleted successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting home loan: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
