import React, { useState, useEffect } from "react";
import "./showReservation.scss";
import { PiNumberCircleOneThin, PiNumberCircleTwoThin, PiNumberCircleThreeThin } from "react-icons/pi";
import { HiArrowLongRight } from "react-icons/hi2";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";

const ShowReservation = ({
  stepNumber,
  onNext,
  onPrev,
  initialData,
  showPrevButton,
}) => {
  const [formData, setFormData] = useState({
    adultes: initialData?.adultes || 0,
    enfants: initialData?.enfants || 0,
  });

  // Mise à jour quand initialData change
  useEffect(() => {
    if (initialData) {
      setFormData({
        adultes: initialData.adultes || 0,
        enfants: initialData.enfants || 0,
      });
    }
  }, [initialData]);

  const handleNumberChange = (type, increment) => {
    setFormData((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + increment),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Vérifier qu'au moins une place est sélectionnée
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

  return (
    <div className="showReservationContainer">
      <div className="showReservationTitle">
        {getStepIcon()}
        <h2>Nombre de places</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="showReservationFormContainer">
          <div className="placesInputsGroup">
            <div className="placeInput">
              <label>Adultes</label>
              <div className="number-selector-wrapper">
                <div className="number-display">
                  {formData.adultes}
                </div>
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
              <label>Enfants</label>
              <div className="number-selector-wrapper">
                <div className="number-display">
                  {formData.enfants}
                </div>
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
        </div>
        <div className="buttons-group">
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
    </div>
  );
};

export default ShowReservation;

