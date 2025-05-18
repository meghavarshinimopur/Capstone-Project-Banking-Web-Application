package com.capstonebank.capstonebankingwebapp.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.capstonebank.capstonebankingwebapp.model.Beneficiary;
import com.capstonebank.capstonebankingwebapp.model.Customer;
import com.capstonebank.capstonebankingwebapp.model.Transaction;
import com.capstonebank.capstonebankingwebapp.repository.BeneficiaryRepository;
import com.capstonebank.capstonebankingwebapp.repository.CustomerRepository;
import com.capstonebank.capstonebankingwebapp.repository.TransactionRepository;

@RestController
@RequestMapping("/transaction")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BeneficiaryRepository beneficiaryRepository;

    @PostMapping("/transfer/{senderUsername}")
    public ResponseEntity<?> transfer(@PathVariable String senderUsername, @RequestBody Transaction transaction) {
        Customer sender = null;
        Customer receiver = null;

        try {
            // Find the sender customer by username
            sender = customerRepository.findByUsername(senderUsername);
            if (sender == null) {
                return new ResponseEntity<>("Sender not found", HttpStatus.NOT_FOUND);
            }

            // Find the receiver customer by account number
            receiver = customerRepository.findByAccountNumber(transaction.getReceiverAccountNumber());
            if (receiver == null) {
                return new ResponseEntity<>("Receiver not found", HttpStatus.NOT_FOUND);
            }

            // Ensure the sender has enough balance
            if (sender.getBalance().compareTo(transaction.getAmount()) < 0) {
                return new ResponseEntity<>("Insufficient balance", HttpStatus.BAD_REQUEST);
            }

            // Check if the receiver is a valid beneficiary of the sender
            Beneficiary beneficiary = beneficiaryRepository.findByAccountNumberAndCustomerId(receiver.getAccountNumber(), sender.getId());
            if (beneficiary == null) {
                return new ResponseEntity<>("Receiver is not a valid beneficiary", HttpStatus.BAD_REQUEST);
            }

            // Check if the amount exceeds the beneficiary's max transfer limit
            if (transaction.getAmount().compareTo(beneficiary.getMaxTransferLimit()) > 0) {
                return new ResponseEntity<>("Transfer amount exceeds the beneficiary's max transfer limit", HttpStatus.BAD_REQUEST);
            }

            // Generate a unique UTR ID
            String utrId = generateUtrId();
            if (!canUseUtrId(utrId)) {
                return new ResponseEntity<>("UTR ID has already been used twice", HttpStatus.BAD_REQUEST);
            }

            // Perform the transaction
            performTransaction(sender, receiver, transaction.getAmount(), utrId);
            return new ResponseEntity<>("Transaction successful!", HttpStatus.CREATED);

        } catch (Exception e) {
            if (sender != null) {
                rollbackTransaction(sender, transaction.getAmount());
            }
            return new ResponseEntity<>("An error occurred while processing the transaction", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void performTransaction(Customer sender, Customer receiver, BigDecimal amount, String utrId) {
        // Deduct amount from sender's balance
        sender.setBalance(sender.getBalance().subtract(amount));

        // Add amount to receiver's balance
        receiver.setBalance(receiver.getBalance().add(amount));

        // Save updated sender and receiver balances
        customerRepository.save(sender);
        customerRepository.save(receiver);

        // Create transaction for sender (debited) and receiver (credited) with the same UTR ID
        Transaction senderTransaction = createTransaction(sender.getAccountNumber(), receiver.getAccountNumber(), amount, "success", "debited", utrId);
        Transaction receiverTransaction = createTransaction(sender.getAccountNumber(), receiver.getAccountNumber(), amount, "success", "credited", utrId);

        // Save transactions
        transactionRepository.save(senderTransaction);
        transactionRepository.save(receiverTransaction);
    }

    private void rollbackTransaction(Customer sender, BigDecimal amount) {
        sender.setBalance(sender.getBalance().add(amount));
        customerRepository.save(sender);
    }

    private Transaction createTransaction(String senderAccount, String receiverAccount, BigDecimal amount, String status, String type, String utrId) {
        Transaction transaction = new Transaction();
        transaction.setSenderAccountNumber(senderAccount);
        transaction.setReceiverAccountNumber(receiverAccount);
        transaction.setAmount(amount);
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setStatus(status);
        transaction.setType(type);
        transaction.setUtrId(utrId); // Set the same UTR ID for both sender and receiver
        return transaction;
    }

    @GetMapping("/history/{username}")
public ResponseEntity<?> getTransactionHistory(
        @PathVariable String username,
        @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
        @RequestParam(value = "minAmount", required = false) BigDecimal minAmount,
        @RequestParam(value = "maxAmount", required = false) BigDecimal maxAmount) {
    try {
        // Find the customer by username
        Customer customer = customerRepository.findByUsername(username);
        if (customer == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        String accountNumber = customer.getAccountNumber();

        // Retrieve all transactions where the customer is involved as sender or receiver
        List<Transaction> allTransactions = transactionRepository.findBySenderAccountNumberOrReceiverAccountNumber(
                accountNumber, accountNumber);

        // Filter transactions to only show:
        // 1. Debit transactions where the customer is the sender
        // 2. Credit transactions where the customer is the receiver
        List<Transaction> filteredTransactions = allTransactions.stream()
                .filter(transaction -> (transaction.getSenderAccountNumber().equals(accountNumber) && "debited".equals(transaction.getType())) ||
                                       (transaction.getReceiverAccountNumber().equals(accountNumber) && "credited".equals(transaction.getType())))
                .collect(Collectors.toList());

        // Apply additional filters for date range and amount
        if (startDate != null || endDate != null) {
            LocalDateTime startDateTime = (startDate != null) ? startDate.atStartOfDay() : LocalDateTime.MIN;
            LocalDateTime endDateTime = (endDate != null) ? endDate.atStartOfDay().plusDays(1) : LocalDateTime.now();
            filteredTransactions = filteredTransactions.stream()
                    .filter(transaction -> !transaction.getTimestamp().isBefore(startDateTime) &&
                                           !transaction.getTimestamp().isAfter(endDateTime))
                    .collect(Collectors.toList());
        }

        if (minAmount != null || maxAmount != null) {
            filteredTransactions = filteredTransactions.stream()
                    .filter(transaction -> (minAmount == null || transaction.getAmount().compareTo(minAmount) >= 0) &&
                                            (maxAmount == null || transaction.getAmount().compareTo(maxAmount) <= 0))
                    .collect(Collectors.toList());
        }

        // Return a message if no transactions are found
        if (filteredTransactions.isEmpty()) {
            return new ResponseEntity<>("No transactions found in the specified range", HttpStatus.OK);
        }

        return new ResponseEntity<>(filteredTransactions, HttpStatus.OK);

    } catch (Exception e) {
        return new ResponseEntity<>("An error occurred while fetching the transaction history", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


    private String generateUtrId() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 12; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

    private boolean canUseUtrId(String utrId) {
        long usageCount = transactionRepository.countByUtrId(utrId);
        return usageCount < 2; // Allow only up to 2 usages of a UTR ID
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return new ResponseEntity<>("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
