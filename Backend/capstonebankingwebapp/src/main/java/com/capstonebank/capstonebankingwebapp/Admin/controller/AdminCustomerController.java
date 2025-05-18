package com.capstonebank.capstonebankingwebapp.Admin.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.capstonebank.capstonebankingwebapp.Admin.repository.AdminRepository;
import com.capstonebank.capstonebankingwebapp.model.Beneficiary;
import com.capstonebank.capstonebankingwebapp.model.Customer;
import com.capstonebank.capstonebankingwebapp.model.Transaction;
import com.capstonebank.capstonebankingwebapp.model.UserProfile;
import com.capstonebank.capstonebankingwebapp.repository.BeneficiaryRepository;
import com.capstonebank.capstonebankingwebapp.repository.CustomerRepository;
import com.capstonebank.capstonebankingwebapp.repository.TransactionRepository;
import com.capstonebank.capstonebankingwebapp.repository.UserProfileRepository;

@RestController
@RequestMapping("/admin/customers")
public class AdminCustomerController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private BeneficiaryRepository beneficiaryRepository;

    // Method to check if admin is logged in
    private boolean isAdminLoggedIn(String username) {
        return adminRepository.existsByUsername(username);
    }

    // Retrieve all customers
    @GetMapping("/all")
    public ResponseEntity<?> getAllCustomers(@RequestHeader("Admin-Username") String adminUsername) {
        if (!isAdminLoggedIn(adminUsername)) {
            return new ResponseEntity<>("Unauthorized access. Admin not logged in.", HttpStatus.UNAUTHORIZED);
        }

        try {
            List<Customer> customers = customerRepository.findAll();
            if (customers.isEmpty()) {
                return new ResponseEntity<>("No customers found", HttpStatus.OK);
            }
            return new ResponseEntity<>(customers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while fetching customer data",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Search customers by account number
    @GetMapping("/search")
    public ResponseEntity<?> searchCustomerByAccountNumber(
            @RequestParam String accountNumber,
            @RequestHeader("Admin-Username") String adminUsername) {
        if (!isAdminLoggedIn(adminUsername)) {
            return new ResponseEntity<>("Unauthorized access. Admin not logged in.", HttpStatus.UNAUTHORIZED);
        }

        try {
            Customer customer = customerRepository.findByAccountNumber(accountNumber);
            if (customer == null) {
                return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while searching for the customer",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // View specific customer's details
    @GetMapping("/{username}/details")
    public ResponseEntity<?> getCustomerDetailsByUsername(
            @PathVariable String username,
            @RequestHeader("Admin-Username") String adminUsername) {
        if (!isAdminLoggedIn(adminUsername)) {
            return new ResponseEntity<>("Unauthorized access. Admin not logged in.", HttpStatus.UNAUTHORIZED);
        }

        try {
            Customer customer = customerRepository.findByUsername(username);
            if (customer == null) {
                return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
            }

            UserProfile userProfile = userProfileRepository.findByCustomerId(customer.getId());
            if (userProfile == null) {
                return new ResponseEntity<>("User profile not found", HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>(new Object[] { customer, userProfile }, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while fetching customer details",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // View specific customer's transaction history
    @GetMapping("/{username}/transactions")
    public ResponseEntity<?> getCustomerTransactionHistoryByUsername(
            @PathVariable String username,
            @RequestHeader("Admin-Username") String adminUsername) {
        if (!isAdminLoggedIn(adminUsername)) {
            return new ResponseEntity<>("Unauthorized access. Admin not logged in.", HttpStatus.UNAUTHORIZED);
        }

        try {
            Customer customer = customerRepository.findByUsername(username);
            if (customer == null) {
                return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
            }

            String accountNumber = customer.getAccountNumber();

            // Retrieve all transactions for this customer
            List<Transaction> transactions = transactionRepository.findBySenderAccountNumberOrReceiverAccountNumber(
                    accountNumber, accountNumber);

            // Filter transactions to only include relevant ones
            List<Transaction> filteredTransactions = transactions.stream()
                    .filter(transaction -> (transaction.getSenderAccountNumber().equals(accountNumber)
                            && transaction.getType().equals("debited")) ||
                            (transaction.getReceiverAccountNumber().equals(accountNumber)
                                    && transaction.getType().equals("credited")))
                    .collect(Collectors.toList());

            return new ResponseEntity<>(filteredTransactions, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while fetching transaction history",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{username}/beneficiaries")
    public ResponseEntity<?> getBeneficiariesByUsername(
            @PathVariable String username,
            @RequestHeader("Admin-Username") String adminUsername) {
        try {
            // Validate Admin Login
            if (!adminRepository.existsByUsername(adminUsername)) {
                return new ResponseEntity<>("Unauthorized access. Admin not logged in.", HttpStatus.UNAUTHORIZED);
            }
    
            // Find customer by username
            Customer customer = customerRepository.findByUsername(username);
            if (customer == null) {
                return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
            }
    
            // Fetch all beneficiaries linked to the customer
            List<Beneficiary> beneficiaries = beneficiaryRepository.findByCustomerId(customer.getId());
            if (beneficiaries.isEmpty()) {
                return new ResponseEntity<>("No beneficiaries found for this customer", HttpStatus.OK);
            }
    
            return new ResponseEntity<>(beneficiaries, HttpStatus.OK);
        } catch (Exception e) {
            // Log error for debugging
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred while fetching beneficiaries", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
