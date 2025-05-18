package com.capstonebank.capstonebankingwebapp.Admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.capstonebank.capstonebankingwebapp.Admin.model.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    Admin findByUsername(String username);
}

