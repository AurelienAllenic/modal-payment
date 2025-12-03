import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="container-app">
      <div className="containerOptions">
        <button onClick={() => navigate("/traineeship-reservation")}>
          Voir le formulaire de stage
        </button>
        <button onClick={() => navigate("/show-reservation")}>
          Voir le formulaire de spectacle
        </button>
        <button onClick={() => navigate("/course-reservation")}>
          Voir le formulaire de cours
        </button>
        <button onClick={() => navigate("/cancel")}>
          Voir la page d'annulation
        </button>
        <button onClick={() => navigate("/orders-list")}>
          Voir la liste des commandes
        </button>
        <button onClick={() => navigate("/admin-capacities")}>
          Modifier le nombre de places disponibles
        </button>
      </div>
    </div>
  );
};

export default HomePage;
