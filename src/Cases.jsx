import React from "react";
import ButtonModal from "./components/ButtonModal.jsx/ButtonModal";

const Cases = ({data, type}) => {
  console.log(type);
  
  return (
    <div className="container-app">
      <ButtonModal
        text={type === "traineeship" ? "Réservez ce stage ici" : type === "show" ? "Réservez ce spectacle ici" : ""}
        traineeshipData={type === "traineeship" ? data : ""}
        coursesData={""}
        ShowData={type === "show" ? data : ""}
      />
    </div>
  );
};

export default Cases;
