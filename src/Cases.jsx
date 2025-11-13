import React from "react";
import ButtonModal from "./components/ButtonModal.jsx/ButtonModal";

const Cases = ({data}) => {
  return (
    <div className="container-app">
      <ButtonModal
        text={"Réservez ce stage ici"}
        traineeshipData={data}
        coursesData={""}
        ShowData={""}
      />
    </div>
  );
};

export default Cases;
