package com.capstonebank.capstonebankingwebapp.model;

import java.time.LocalDateTime;
import java.util.Random;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "card")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String cardNumber;

    @Column(nullable = false)
    private int cvv; // 3-digit security code

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Column(nullable = false)
    private String nameOnCard; // Display name on the card

    @Column(nullable = false)
    private String bankName; // Bank name displayed

    @Column(nullable = false)
    private String cardType; // Teenager or Senior Citizen

    @Column(nullable = false)
    private String status = "pending"; // Default status

    @Column(nullable = true) // Allow null for pending status
    private LocalDateTime approvalDate; // Date when the card is approved

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private Customer owner; // Owner of the card (customer)

    // Constructors
    public Card() {
        this.cardNumber = generateCardNumber();
        this.cvv = generateCVV();
        this.expiryDate = LocalDateTime.now().plusYears(5); // Expiry date: 5 years
        this.status = "pending"; // Default status
        this.bankName = "Chase Bank"; // Default bank name
    }

    private String generateCardNumber() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 16; i++) {
            sb.append((int) (Math.random() * 10));
        }
        return sb.toString();
    }

    private int generateCVV() {
        return 100 + new Random().nextInt(900); // Random CVV between 100-999
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public int getCvv() {
        return cvv;
    }

    public void setCvv(int cvv) {
        this.cvv = cvv;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getNameOnCard() {
        return nameOnCard;
    }

    public void setNameOnCard(String nameOnCard) {
        this.nameOnCard = nameOnCard;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getCardType() {
        return cardType;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getApprovalDate() {
        return approvalDate;
    }

    public void setApprovalDate(LocalDateTime approvalDate) {
        this.approvalDate = approvalDate;
    }

    public Customer getOwner() {
        return owner;
    }

    public void setOwner(Customer owner) {
        this.owner = owner;
    }
}
