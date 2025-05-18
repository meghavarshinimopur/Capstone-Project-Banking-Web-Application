import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import DebitCard from "./DebitCard";

function CardViewer() {
    const [teenagerCards, setTeenagerCards] = useState([]);
    const [seniorCards, setSeniorCards] = useState([]);
    const [responseMessage, setResponseMessage] = useState("");

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                if (storedUser && storedUser.username) {
                    const response = await axios.get(
                        `http://localhost:8080/api/cards/view/${storedUser.username}`
                    );
                    const cards = response.data;
                    setTeenagerCards(cards.filter(card => card.cardType === "Teenager"));
                    setSeniorCards(cards.filter(card => card.cardType === "Senior Citizen"));
                } else {
                    setResponseMessage("Please log in to view your cards.");
                }
            } catch (error) {
                setResponseMessage("Error fetching card details.");
            }
        };
        fetchCards();
    }, []);

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container fixed-deposit-container flex-grow-1">
                <h1 className="text-center mb-4">Your Debit Cards</h1>

                {responseMessage && (
                    <div
                        className={`alert ${
                            responseMessage.includes("Error") ? "alert-danger" : "alert-info"
                        } text-center`}
                    >
                        {responseMessage}
                    </div>
                )}

                <div className="cards-inline-container">
                    <div className="cards-column">
                        <h2 className="text-center">Teenager Cards</h2>
                        {teenagerCards.length > 0 ? (
                            teenagerCards.map(card => (
                                <DebitCard key={card.id} card={card} />
                            ))
                        ) : (
                            <p className="text-center">No Teenager Cards Found</p>
                        )}
                    </div>
                    <div className="cards-column">
                        <h2 className="text-center">Senior Citizen Cards</h2>
                        {seniorCards.length > 0 ? (
                            seniorCards.map(card => (
                                <DebitCard key={card.id} card={card} />
                            ))
                        ) : (
                            <p className="text-center">No Senior Citizen Cards Found</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default CardViewer;
