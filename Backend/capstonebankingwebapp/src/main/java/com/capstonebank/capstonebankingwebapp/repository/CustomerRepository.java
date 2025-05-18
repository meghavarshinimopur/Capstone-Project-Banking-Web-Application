package com.capstonebank.capstonebankingwebapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.capstonebank.capstonebankingwebapp.model.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByMobileNumber(String mobileNumber);
    Customer findByUsername(String username);
    Customer findByAccountNumber(String accountNumber);
}
