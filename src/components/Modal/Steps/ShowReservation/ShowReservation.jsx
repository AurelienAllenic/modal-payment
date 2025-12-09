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
  
  const maxPlaces = initialData?.numberOfPlaces || 999;
  
  const [formData, setFormData] = useState({
    adultes: initialData?.adultes || 0,
    enfants: initialData?.enfants || 0,
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        adultes: initialData.adultes ?? prev.adultes ?? 0,
        enfants: initialData.enfants ?? prev.enfants ?? 0,
      }));
    }
  }, [initialData]);

  const handleNumberChange = (type, increment) => {
    setFormData((prev) => {
      const newValue = Math.max(0, prev[type] + increment);
      const otherType = type === "adultes" ? "enfants" : "adultes";
      const total = newValue + prev[otherType];
      
      if (increment > 0 && total > maxPlaces) {
        setErrorMessage("Maximum de places atteint");
        setTimeout(() => setErrorMessage(""), 3000);
        return prev;
      }
      
      setErrorMessage("");
      
      return {
        ...prev,
        [type]: newValue,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.adultes === 0 && formData.enfants === 0) {
      alert("Veuillez sélectionner au moins une place");
      return;
    }
    
    const total = formData.adultes + formData.enfants;
    if (total > maxPlaces) {
      setErrorMessage(`Désolé, il ne reste que ${maxPlaces} place(s) disponible(s).`);
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
  const totalPlaces = formData.adultes + formData.enfants;

  return (
    <div className="showReservationContainer">
      <div className="showReservationTitle">
        {getStepIcon()}
        <h2>Nombre de places</h2>
      </div>
      <div className="containerBothParts">
        <form onSubmit={handleSubmit} className="showReservationForm">
          <div className="showReservationFormContainer">
            <div className="placesInputsGroup" style={{position: 'relative'}}> {/* ✅ AJOUT : position relative */}
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
              
              {/* ✅ AJOUT : Message d'erreur */}
              {errorMessage && (
                <p style={{
                  position: 'absolute',
                  bottom: '-45px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#d32f2f',
                  fontSize: '14px',
                  fontWeight: '500',
                  animation: 'fadeIn 0.3s ease-in',
                  backgroundColor: '#ffebee',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ef9a9a',
                  whiteSpace: 'nowrap',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(211, 47, 47, 0.2)'
                }}>
                  ⚠️ {errorMessage}
                </p>
              )}
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
