package com.capstonebank.capstonebankingwebapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.capstonebank.capstonebankingwebapp.model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findBySenderAccountNumberOrReceiverAccountNumber(String senderAccountNumber, String receiverAccountNumber);
    boolean existsByUtrId(String utrId);
    // Retrieve transactions where a specific account is the sender
    List<Transaction> findBySenderAccountNumber(String senderAccountNumber);

    // Retrieve transactions where a specific account is the receiver
    List<Transaction> findByReceiverAccountNumber(String receiverAccountNumber);

    long countByUtrId(String utrId);

    List<Transaction> findByStatus(String status);
}
