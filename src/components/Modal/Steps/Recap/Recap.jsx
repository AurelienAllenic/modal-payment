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

  // Calcul du total pour les spectacles
  const calculateShowTotal = () => {
    const adultes = formData.adultes || 0;
    const enfants = formData.enfants || 0;
    return adultes * 15 + enfants * 10;
  };

  const eventData = Array.isArray(data) ? data[0] : data;

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
                <li>{eventData?.title}</li>
                <li>{eventData?.place}</li>
                <li>{eventData?.hours}</li>
                <li>{eventData?.date}</li>
                <li>Participant(s) : {formData.nombreParticipants}</li>
              </ul>
              <p className="recapTotal">
                Total : {formData.nombreParticipants * 20} €
              </p>
            </>
          )}
          {dataType === "show" && (
            <>
              <p>Spectacle :</p>
              <ul>
                <li>{eventData?.title}</li>
                <li>{eventData?.place}</li>
                <li>{eventData?.hours}</li>
                <li>{eventData?.date}</li>
                <li>
                  Places adultes : {formData.adultes || 0} × 15€ ={" "}
                  {(formData.adultes || 0) * 15}€
                </li>
                <li>
                  Places enfants : {formData.enfants || 0} × 10€ ={" "}
                  {(formData.enfants || 0) * 10}€
                </li>
                <li>
                  Total places :{" "}
                  {(formData.adultes || 0) + (formData.enfants || 0)}
                </li>
              </ul>
              <p className="recapTotal">Total : {calculateShowTotal()} €</p>
            </>
          )}
          {dataType === "courses" && (
            <>
              <p>Cours :</p>
              <ul>
                <li>Catégorie d’âge : {formData.ageGroup}</li>
                <li>Type de cours : {formData.courseType}</li>
                {formData.trialCourse && (
                  <>
                    <li>Date du cours : {formData.trialCourse.date}</li>
                    <li>Heure : {formData.trialCourse.time}</li>
                    <li>Lieu : {formData.trialCourse.place}</li>
                  </>
                )}
              </ul>
              <p className="recapTotal">
                Total :{" "}
                {formData.courseType === "essai"
                  ? "10 €"
                  : formData.courseType === "trimestre"
                  ? "200 à 400 €"
                  : formData.courseType === "semestre"
                  ? "300 à 600 €"
                  : formData.courseType === "annee"
                  ? "600 à 800 €"
                  : "—"}
              </p>
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
