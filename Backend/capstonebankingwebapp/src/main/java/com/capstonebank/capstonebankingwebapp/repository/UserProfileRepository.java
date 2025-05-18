package com.capstonebank.capstonebankingwebapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.capstonebank.capstonebankingwebapp.model.UserProfile;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    // Add this method to fetch UserProfile by customerId
    UserProfile findByCustomerId(Long customerId);
}
