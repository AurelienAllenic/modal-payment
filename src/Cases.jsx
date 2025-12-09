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

  const hasPlacesAvailable = () => {
    if (!data) {
      return false;
    }

    if (type === "traineeship" || type === "show") {
      const hasPlaces = data.numberOfPlaces > 0;
      return hasPlaces;
    }
    
    if (type === "courses") {
      const classicCourses = data.courses || [];
      const trialCourses = data.trialCourses || [];

      const hasClassicPlaces = classicCourses.some(course => 
        course && course.numberOfPlaces > 0
      );

      const hasTrialPlaces = trialCourses.some(course => 
        course && course.numberOfPlaces > 0
      );
      
      const hasPlaces = hasClassicPlaces || hasTrialPlaces;
      
      return hasPlaces;
    }

    return true;
  };

  const getButtonText = () => {
    if (type === "traineeship") return "Réservez ce stage ici";
    if (type === "show") return "Réservez ce spectacle ici";
    if (type === "courses") return "Réservez ce cours ici";
    return "";
  };

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
          <p>Toutes les places ont été réservées pour {
            type === "traineeship" ? "ce stage" :
            type === "show" ? "ce spectacle" :
            type === "courses" ? "tous les cours" :
            "cet événement"
          }.</p>
          <p>N'hésitez pas à consulter nos autres événements.</p>
        </div>
      )}
    </div>
  );
};

export default Cases;
