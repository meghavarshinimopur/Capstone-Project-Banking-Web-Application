package com.capstonebank.capstonebankingwebapp.conn;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capstonebank.capstonebankingwebapp.DTO.CardRequest;
import com.capstonebank.capstonebankingwebapp.model.Card;
import com.capstonebank.capstonebankingwebapp.model.Customer;
import com.capstonebank.capstonebankingwebapp.repository.CardRepository;
import com.capstonebank.capstonebankingwebapp.repository.CustomerRepository;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    private static final Logger logger = LoggerFactory.getLogger(CardController.class);

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private CustomerRepository customerRepository;

// Apply for a card
@PostMapping("/apply/{username}")
public ResponseEntity<?> applyForCard(@PathVariable String username, @RequestBody CardRequest cardRequest) {
    try {
        // Validate Customer
        Customer customer = customerRepository.findByUsername(username);
        if (customer == null) {
            return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
        }

        // Validate Card Type
        if (!cardRequest.getCardType().equalsIgnoreCase("Teenager") &&
            !cardRequest.getCardType().equalsIgnoreCase("Senior Citizen")) {
            return new ResponseEntity<>(
                "Invalid card type. Choose either 'Teenager' or 'Senior Citizen'.",
                HttpStatus.BAD_REQUEST);
        }

        // Check if customer already owns a card of the given type
        Optional<Card> existingCard = cardRepository.findByOwnerIdAndCardType(customer.getId(),
            cardRequest.getCardType());
        if (existingCard.isPresent()) {
            return new ResponseEntity<>("Customer already owns this type of card.", HttpStatus.BAD_REQUEST);
        }

        // Create a new card
        Card card = new Card();
        card.setOwner(customer);
        card.setCardType(cardRequest.getCardType());
        card.setNameOnCard(cardRequest.getNameOnCard());
        card.setStatus("pending"); // Default status

        // Save Card
        Card savedCard = cardRepository.save(card);
        return new ResponseEntity<>(savedCard, HttpStatus.CREATED);
    } catch (Exception e) {
        logger.error("Error occurred while applying for card", e);
        return new ResponseEntity<>("Error occurred while applying for card: " + e.getMessage(),
            HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

    // Customer views their approved cards
    @GetMapping("/view/{username}")
    public ResponseEntity<?> viewCards(@PathVariable String username) {
        try {
            // Validate Customer
            Customer customer = customerRepository.findByUsername(username);
            if (customer == null) {
                return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
            }

            // Fetch Cards
            List<Card> cards = cardRepository.findByOwnerId(customer.getId());
            return new ResponseEntity<>(cards, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error occurred while fetching cards", e);
            return new ResponseEntity<>("Error occurred while fetching cards: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get pending cards
    @GetMapping("/pending/{username}")
    public ResponseEntity<?> getPendingCards(@PathVariable String username) {
        try {
            // Validate Customer
            Customer customer = customerRepository.findByUsername(username);
            if (customer == null) {
                return new ResponseEntity<>("Customer not found", HttpStatus.NOT_FOUND);
            }

            // Retrieve all pending cards for the customer
            List<Card> pendingCards = cardRepository.findByOwnerIdAndStatus(customer.getId(), "pending");
            return new ResponseEntity<>(pendingCards, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error occurred while retrieving pending cards", e);
            return new ResponseEntity<>("Error occurred while retrieving pending cards: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Cancel a card
    @DeleteMapping("/cancel/{id}")
    public ResponseEntity<?> cancelCard(@PathVariable Long id) {
        try {
            // Find the card by ID
            Card card = cardRepository.findById(id).orElse(null);
            if (card == null || !"pending".equalsIgnoreCase(card.getStatus())) {
                return new ResponseEntity<>("Card not found or not eligible for cancellation", HttpStatus.BAD_REQUEST);
            }

            // Delete the card
            cardRepository.delete(card);
            return new ResponseEntity<>("Card application canceled successfully", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error occurred while canceling card", e);
            return new ResponseEntity<>("Error occurred while canceling card: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingCards() {
        try {
            // Retrieve all pending cards
            List<Card> pendingCards = cardRepository.findByStatus("pending");
            return ResponseEntity.ok(pendingCards);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving pending cards: " + e.getMessage());
        }
    }
}
