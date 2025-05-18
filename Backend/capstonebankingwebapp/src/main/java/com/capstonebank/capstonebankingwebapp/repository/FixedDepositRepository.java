package com.capstonebank.capstonebankingwebapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.capstonebank.capstonebankingwebapp.model.FixedDeposit;

@Repository
public interface FixedDepositRepository extends JpaRepository<FixedDeposit, Long> {
    List<FixedDeposit> findByCustomerId(Long customerId);
    List<FixedDeposit> findByStatus(String status);
    List<FixedDeposit> findByCustomerIdAndStatus(Long customerId, String status);
}

