import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./success.scss";
import { FaCheckCircle } from "react-icons/fa";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderNumber, formData, data, dataType } = location.state || {};

  // Redirection si pas de données
  if (!orderNumber) {
    navigate("/");
    return null;
  }

  // Calcul du total pour les spectacles
  const calculateShowTotal = () => {
    const adultes = formData?.adultes || 0;
    const enfants = formData?.enfants || 0;
    return adultes * 15 + enfants * 10;
  };

  return (
    <div className="success-container">
      <div className="success-card">
        <FaCheckCircle className="success-icon" />
        <h1>Réservation confirmée !</h1>
        <p className="order-number">
          Numéro de commande : <strong>{orderNumber}</strong>
        </p>

        <div className="success-details">
          <div className="detail-section">
            <h3>Vos informations</h3>
            <p>Nom : {formData?.nom}</p>
            <p>Email : {formData?.email}</p>
            <p>Téléphone : {formData?.telephone}</p>
          </div>

          {dataType === "traineeship" && data && (
            <div className="detail-section">
              <h3>Détails du stage</h3>
              <p>{data[0]?.title}</p>
              <p>{data[0]?.place}</p>
              <p>
                {data[0]?.date} - {data[0]?.hours}
              </p>
              <p>Participants : {formData?.nombreParticipants}</p>
            </div>
          )}

          {dataType === "show" && data && (
            <div className="detail-section">
              <h3>Détails du spectacle</h3>
              <p>{data[0]?.title}</p>
              <p>{data[0]?.place}</p>
              <p>
                {data[0]?.date} - {data[0]?.hours}
              </p>
              <p>Places adultes : {formData?.adultes || 0} × 15€ = {(formData?.adultes || 0) * 15}€</p>
              <p>Places enfants : {formData?.enfants || 0} × 10€ = {(formData?.enfants || 0) * 10}€</p>
              <p>Total places : {(formData?.adultes || 0) + (formData?.enfants || 0)}</p>
              <p><strong>Total : {calculateShowTotal()} €</strong></p>
            </div>
          )}
        </div>

        <p className="confirmation-message">
          Un email de confirmation a été envoyé à {formData?.email}
        </p>

        <button onClick={() => navigate("/")} className="btn-home">
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default Success;
