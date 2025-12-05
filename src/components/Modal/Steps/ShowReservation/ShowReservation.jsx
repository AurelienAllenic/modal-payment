import React, { useState, useEffect } from "react";
import "./showReservation.scss";
import {
  PiNumberCircleOneThin,
  PiNumberCircleTwoThin,
  PiNumberCircleThreeThin,
} from "react-icons/pi";
import { HiArrowLongRight } from "react-icons/hi2";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { prices } from "../../../data/Data";

const ShowReservation = ({
  stepNumber,
  onNext,
  onPrev,
  initialData,
  showPrevButton,
  show,
}) => {
  console.log(initialData, 'initialData')
  const [formData, setFormData] = useState({
    adultes: initialData?.adultes || 0,
    enfants: initialData?.enfants || 0,
  });

  useEffect(() => {
  if (initialData) {
    setFormData(prev => ({
      ...prev, // garde ce qui existe déjà (adultes/enfants, etc.)
      ...initialData, // ajoute ou remplace les champs venant de initialData
      adultes: initialData.adultes ?? prev.adultes ?? 0,
      enfants: initialData.enfants ?? prev.enfants ?? 0,
    }));
  }
  console.log('modifiedInitialData : ', initialData);
}, [initialData]);


  const handleNumberChange = (type, increment) => {
    setFormData((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + increment),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.adultes === 0 && formData.enfants === 0) {
      alert("Veuillez sélectionner au moins une place");
      return;
    }
    onNext(formData);
  };

  const getStepIcon = () => {
    switch (stepNumber) {
      case 1:
        return <PiNumberCircleOneThin className="stepIcon" />;
      case 2:
        return <PiNumberCircleTwoThin className="stepIcon" />;
      case 3:
        return <PiNumberCircleThreeThin className="stepIcon" />;
      default:
        return null;
    }
  };

  const totalPrice = formData.adultes * prices.show_adult + formData.enfants * prices.show_child;

  return (
    <div className="showReservationContainer">
      <div className="showReservationTitle">
        {getStepIcon()}
        <h2>Nombre de places</h2>
      </div>
      <div className="containerBothParts">
        <form onSubmit={handleSubmit} className="showReservationForm">
          <div className="showReservationFormContainer">
            <div className="placesInputsGroup">
              <div className="placeInput">
                <label>Adultes / 15€</label>
                <div className="number-selector-wrapper">
                  <div className="number-display">{formData.adultes}</div>
                  <div className="number-controls">
                    <button
                      type="button"
                      className="number-btn"
                      onClick={() => handleNumberChange("adultes", 1)}
                    >
                      <IoMdArrowDropup />
                    </button>
                    <button
                      type="button"
                      className="number-btn"
                      onClick={() => handleNumberChange("adultes", -1)}
                    >
                      <IoMdArrowDropdown />
                    </button>
                  </div>
                </div>
              </div>
              <div className="placeInput">
                <label>Enfants ( -10 ans ) / 10€</label>
                <div className="number-selector-wrapper">
                  <div className="number-display">{formData.enfants}</div>
                  <div className="number-controls">
                    <button
                      type="button"
                      className="number-btn"
                      onClick={() => handleNumberChange("enfants", 1)}
                    >
                      <IoMdArrowDropup />
                    </button>
                    <button
                      type="button"
                      className="number-btn"
                      onClick={() => handleNumberChange("enfants", -1)}
                    >
                      <IoMdArrowDropdown />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p className="totalShowReservation">Total : {totalPrice} €</p>
          </div>
          <div className="buttons-group-showReservation">
            {showPrevButton && (
              <button type="button" onClick={onPrev} className="btn-prev-step">
                <HiArrowLongRight />
                Précédent
              </button>
            )}
            <button type="submit" className="btn-next-step">
              Suivant <HiArrowLongRight />
            </button>
          </div>
        </form>
        <div className="rightImage">
          <img src={initialData?.img} alt={initialData?.alt} />
        </div>
      </div>
    </div>
  );
};

export default ShowReservation;
