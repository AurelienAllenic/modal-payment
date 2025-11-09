import React from "react";
import { useNavigate } from "react-router-dom";
import "./failure.scss";
import { FaTimesCircle } from "react-icons/fa";

const Failure = () => {
  const navigate = useNavigate();

  return (
    <div className="failure-container">
      <div className="failure-card">
        <FaTimesCircle className="failure-icon" />
        <h1>Paiement annulé !</h1>
        <p className="failure-message">Votre paiement a été annulé.</p>
        <button onClick={() => navigate("/")} className="btn-home">
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default Failure;
