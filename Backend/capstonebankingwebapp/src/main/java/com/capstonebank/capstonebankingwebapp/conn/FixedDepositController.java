package com.capstonebank.capstonebankingwebapp.conn;

import java.math.BigDecimal;
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
import com.capstonebank.capstonebankingwebapp.model.FixedDeposit;
import com.capstonebank.capstonebankingwebapp.repository.CustomerRepository;
import com.capstonebank.capstonebankingwebapp.repository.FixedDepositRepository;

@RestController
@RequestMapping("/fixedDeposit")
public class FixedDepositController {

    @Autowired
    private FixedDepositRepository fixedDepositRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // Create a fixed deposit
    @PostMapping("/create/{username}")
    public ResponseEntity<?> createFixedDeposit(@PathVariable String username, @RequestBody FixedDeposit fixedDeposit) {
        Customer customer = customerRepository.findByUsername(username);
        if (customer == null) {
            return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
        }

        // Calculate maturity date and amount
        fixedDeposit.setCustomer(customer);
        fixedDeposit.setCreateDate(LocalDateTime.now());
        fixedDeposit.setMaturityDate(LocalDateTime.now().plusMonths(fixedDeposit.getTenureInMonths()));
        BigDecimal interest = fixedDeposit.getPrincipalAmount()
                .multiply(fixedDeposit.getInterestRate().divide(BigDecimal.valueOf(100)))
                .multiply(BigDecimal.valueOf(fixedDeposit.getTenureInMonths()).divide(BigDecimal.valueOf(12)));
        fixedDeposit.setMaturityAmount(fixedDeposit.getPrincipalAmount().add(interest));
        fixedDeposit.setStatus("active");

        FixedDeposit savedDeposit = fixedDepositRepository.save(fixedDeposit);
        return new ResponseEntity<>(savedDeposit, HttpStatus.CREATED);
    }

    // Get all fixed deposits for a customer
    @GetMapping("/view/{username}")
    public ResponseEntity<?> viewFixedDeposits(@PathVariable String username) {
        Customer customer = customerRepository.findByUsername(username);
        if (customer == null) {
            return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
        }

        List<FixedDeposit> deposits = fixedDepositRepository.findByCustomerId(customer.getId());
        return new ResponseEntity<>(deposits, HttpStatus.OK);
    }

    // Close a fixed deposit
    @PutMapping("/close/{id}")
    public ResponseEntity<?> closeFixedDeposit(@PathVariable Long id) {
        FixedDeposit fixedDeposit = fixedDepositRepository.findById(id).orElse(null);
        if (fixedDeposit == null || !"active".equals(fixedDeposit.getStatus())) {
            return new ResponseEntity<>("Fixed deposit not found or already closed", HttpStatus.BAD_REQUEST);
        }

        fixedDeposit.setStatus("closed");
        fixedDepositRepository.save(fixedDeposit);
        return new ResponseEntity<>("Fixed deposit closed successfully", HttpStatus.OK);
    }

    // Delete closed fixed deposits
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteClosedFixedDeposit(@PathVariable Long id) {
        FixedDeposit fixedDeposit = fixedDepositRepository.findById(id).orElse(null);

        if (fixedDeposit == null) {
            return new ResponseEntity<>("Fixed deposit not found", HttpStatus.NOT_FOUND);
        }

        if (!"closed".equals(fixedDeposit.getStatus())) {
            return new ResponseEntity<>("Only closed fixed deposits can be deleted", HttpStatus.BAD_REQUEST);
        }

        fixedDepositRepository.delete(fixedDeposit);
        return new ResponseEntity<>("Closed fixed deposit deleted successfully", HttpStatus.OK);
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingFixedDeposits() {
        try {
            // Retrieve all active fixed deposits
            List<FixedDeposit> pendingFixedDeposits = fixedDepositRepository.findByStatus("active");
            return ResponseEntity.ok(pendingFixedDeposits);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving pending fixed deposits: " + e.getMessage());
        }
    }

}
