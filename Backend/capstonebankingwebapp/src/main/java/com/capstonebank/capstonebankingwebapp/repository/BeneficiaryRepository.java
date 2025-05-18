package com.capstonebank.capstonebankingwebapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.capstonebank.capstonebankingwebapp.model.Beneficiary;

@Repository
public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {
    Beneficiary findByAccountNumberAndCustomerId(String accountNumber, Long customerId);
    List<Beneficiary> findByCustomerId(Long customerId);
}
