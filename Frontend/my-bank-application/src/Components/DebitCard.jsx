import React, { useState } from "react";
import "../css/DebitCard.css";
import Mitra from "../assets/Mitra.png";

function DebitCard({ card }) {
    const [isVisible, setIsVisible] = useState(false);

    if (!card) {
        return <div className="card-error">Card data is missing.</div>;
    }

    const toggleDetails = () => setIsVisible(!isVisible);

    const formatCardNumber = (number) =>
        number?.match(/.{1,4}/g)?.join(" ") || "•••• •••• •••• ••••";

    const formatExpiry = (expiryDate) => {
        if (!expiryDate) return "MM/YY";
        const date = new Date(expiryDate);
        return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear().toString().slice(-2)}`;
    };

    return (
        <div className="card-container">
            <div className="card-logo">
                <img src={Mitra} alt="Bank Logo" />
            </div>

            <div className="chip"></div>

            <div className="card-number">
                {isVisible ? formatCardNumber(card.cardNumber) : "•••• •••• •••• ••••"}
            </div>

            <div className="card-details">
                <div className="name">{card.nameOnCard}</div>
                <div className="expiry">{formatExpiry(card.expiryDate)}</div>
                <div className="cvv">
                    {isVisible ? `CVV: ${card.cvv}` : "CVV: •••"}
                </div>
            </div>

            <button className="toggle-button" onClick={toggleDetails}>
                {isVisible ? "Hide" : "View"}
            </button>
        </div>
    );
}

export default DebitCard;
