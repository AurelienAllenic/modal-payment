import React from "react";
import { PiNumberCircleOneThin, PiNumberCircleTwoThin } from "react-icons/pi";
import { HiArrowLongRight } from "react-icons/hi2";
import "./recap.scss";

const Recap = ({
  formData,
  data,
  dataType,
  stepNumber,
  onPrev,
  onReserve,
  showPrevButton,
}) => {
  console.log(formData, data);

  const handleReserve = () => {
    // Appelle la fonction onReserve qui affichera Success
    onReserve();
  };

  return (
    <div className="containerRecap">
      <div className="RecapTitle">
        {stepNumber === 1 ? (
          <PiNumberCircleOneThin className="stepIcon" />
        ) : stepNumber === 2 ? (
          <PiNumberCircleTwoThin className="stepIcon" />
        ) : null}
        <h2>Résumé de votre commande</h2>
      </div>
      <div className="containerAllRecap">
        <div className="containerRecapObject">
          {dataType === "traineeship" && (
            <>
              <p>Stage :</p>
              <ul>
                <li>{data[0].title}</li>
                <li>{data[0].place}</li>
                <li>{data[0].hours}</li>
                <li>{data[0].date}</li>
                <li>Participant(s) : {formData.nombreParticipants}</li>
              </ul>
              <p className="recapTotal">Total : 20 €</p>
            </>
          )}
        </div>
        <div className="containerUserRecap">
          <p>Vos informations :</p>
          <ul>
            <li>Nom : {formData.nom}</li>
            <li>Téléphone : {formData.telephone}</li>
            <li>Email : {formData.email}</li>
            {formData.message && <li>Message : {formData.message}</li>}
          </ul>
        </div>
      </div>

      <div className="buttons-group">
        {showPrevButton && (
          <button type="button" onClick={onPrev} className="btn-prev-step">
            <HiArrowLongRight />
            Précédent
          </button>
        )}
        <button type="button" onClick={handleReserve} className="btn-reserve">
          Réserver <HiArrowLongRight />
        </button>
      </div>
    </div>
  );
};

export default Recap;
