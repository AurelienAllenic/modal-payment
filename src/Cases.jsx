import React from "react";
import ButtonModal from "./components/ButtonModal.jsx/ButtonModal";
import { HiArrowLongRight } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const Cases = ({ data, type }) => {
  const navigate = useNavigate();
  const returnHome = () => {
    navigate("/");
  };

  return (
    <div className="container-app">
      <div className="return-home">
        <HiArrowLongRight className="iconReturnHome" onClick={returnHome} />
      </div>
      <ButtonModal
        text={
          type === "traineeship"
            ? "Réservez ce stage ici"
            : type === "show"
            ? "Réservez ce spectacle ici"
            : type === "courses"
            ? "Réservez ce cours ici"
            : ""
        }
        data={data}
        dataType={type}
      />
    </div>
  );
};

export default Cases;
