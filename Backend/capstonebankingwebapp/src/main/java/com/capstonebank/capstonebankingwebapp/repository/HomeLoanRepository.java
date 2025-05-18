package com.capstonebank.capstonebankingwebapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.capstonebank.capstonebankingwebapp.model.HomeLoan;

@Repository
public interface HomeLoanRepository extends JpaRepository<HomeLoan, Long> {
    List<HomeLoan> findByCustomerId(Long customerId);
    List<HomeLoan> findByStatus(String status);

}

