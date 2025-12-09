import React, { useEffect } from "react";
import ButtonModal from "./components/ButtonModal.jsx/ButtonModal";
import { HiArrowLongRight } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import "./cases.scss";

const Cases = ({ data, type }) => {
  const navigate = useNavigate();
  const returnHome = () => {
    navigate("/");
  };

  // Debug: voir ce qui arrive
  useEffect(() => {
    console.log(`[Cases Debug] Type: ${type}`, data);
    if (data) {
      console.log(`[Cases Debug] numberOfPlaces:`, data.numberOfPlaces);
    }
  }, [data, type]);

  // Vérifier si des places sont disponibles
  const hasPlacesAvailable = () => {
    // Si pas de données, on ne peut pas réserver
    if (!data) {
      console.log("[Cases] Pas de données disponibles");
      return false;
    }

    if (type === "traineeship" || type === "show") {
      const hasPlaces = data.numberOfPlaces > 0;
      console.log(`[Cases] ${type} - Places disponibles:`, data.numberOfPlaces, "→", hasPlaces);
      return hasPlaces;
    }
    
    // Pour les cours, on considère toujours disponible
    return true;
  };

  const getButtonText = () => {
    if (type === "traineeship") return "Réservez ce stage ici";
    if (type === "show") return "Réservez ce spectacle ici";
    if (type === "courses") return "Réservez ce cours ici";
    return "";
  };

  // Si pas de données du tout
  if (!data) {
    return (
      <div className="container-app">
        <div className="return-home">
          <HiArrowLongRight className="iconReturnHome" onClick={returnHome} />
        </div>
        <div className="no-places-available">
          <h2>⏳ Chargement...</h2>
          <p>Récupération des données en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app">
      <div className="return-home">
        <HiArrowLongRight className="iconReturnHome" onClick={returnHome} />
      </div>
      
      {hasPlacesAvailable() ? (
        <ButtonModal
          text={getButtonText()}
          data={data}
          dataType={type}
        />
      ) : (
        <div className="no-places-available">
          <h2>😔 Plus aucune place disponible !</h2>
          <p>Toutes les places ont été réservées pour cet événement.</p>
          <p>N'hésitez pas à consulter nos autres événements.</p>
        </div>
      )}
    </div>
  );
};

export default Cases;
