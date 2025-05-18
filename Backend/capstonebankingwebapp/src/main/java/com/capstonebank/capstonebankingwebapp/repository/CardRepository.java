package com.capstonebank.capstonebankingwebapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.capstonebank.capstonebankingwebapp.model.Card;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
    // Find all cards by owner ID
    List<Card> findByOwnerId(Long ownerId);

    // Find a card by owner ID and card type
    Optional<Card> findByOwnerIdAndCardType(Long ownerId, String cardType);

    // Find all cards for a specific owner by status
    List<Card> findByOwnerIdAndStatus(Long ownerId, String status);

    // Find all cards by status (e.g., pending, approved, etc.)
    List<Card> findByStatus(String status);
}
