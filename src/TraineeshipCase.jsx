import React from "react";
import { traineeship } from "./components/data/Data.js";
import ButtonModal from "./components/ButtonModal.jsx/ButtonModal";

const TraineeshipCase = () => {
  return (
    <div className="container-app">
      <ButtonModal
        text={"Réservez ce stage ici"}
        traineeshipData={traineeship}
        coursesData={""}
        ShowData={""}
      />
    </div>
  );
};

export default TraineeshipCase;
