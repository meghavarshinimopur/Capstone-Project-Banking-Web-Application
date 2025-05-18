package com.capstonebank.capstonebankingwebapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.capstonebank.capstonebankingwebapp.model.AgricultureLoan;


@Repository
public interface AgricultureLoanRepository extends JpaRepository<AgricultureLoan, Long> {
    List<AgricultureLoan> findByCustomerId(Long customerId);
    List<AgricultureLoan> findByStatus(String status);

}

