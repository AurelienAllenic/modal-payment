import React, { useState, useEffect } from "react";
import { PiNumberCircleOneThin } from "react-icons/pi";
import { HiArrowLongRight } from "react-icons/hi2";
import { HiCheck } from "react-icons/hi";
import "./courseType.scss";

const CourseType = ({
  stepNumber,
  onNext,
  onPrev,
  showPrevButton,
  initialData,
}) => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
  const [selectedCourseType, setSelectedCourseType] = useState("");

  useEffect(() => {
    if (initialData) {
      setSelectedAgeGroup(initialData.ageGroup || "");
      setSelectedCourseType(initialData.courseType || "");
    }
  }, [initialData]);

  const handleAgeGroupChange = (value) => setSelectedAgeGroup(value);
  const handleCourseTypeChange = (value) => setSelectedCourseType(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAgeGroup || !selectedCourseType) {
      alert("Veuillez sélectionner une catégorie d'âge et un type de cours.");
      return;
    }
    onNext({ ageGroup: selectedAgeGroup, courseType: selectedCourseType });
  };

  const getStepIcon = () =>
    stepNumber === 1 ? <PiNumberCircleOneThin className="stepIcon" /> : null;

  return (
    <div className="courseTypeContainer">
      <div className="courseTypeTitle">
        {getStepIcon()}
        <h2>Type de cours</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="courseTypeFormContainer">
          <div className="section">
            <h3>Qui êtes-vous ?</h3>
            <div className="options">
              {["enfant", "ado", "adulte"].map((val) => (
                <label key={val} className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedAgeGroup === val}
                    onChange={() => handleAgeGroupChange(val)}
                  />
                  <span className="checkmark">
                    {selectedAgeGroup === val && <HiCheck />}
                  </span>
                  {val === "enfant"
                    ? "Enfant (8+)"
                    : val === "ado"
                    ? "Ado (12+)"
                    : "Adulte"}
                </label>
              ))}
            </div>
          </div>
          <div className="section">
            <h3>Quel type de cours souhaitez-vous réserver ?</h3>
            <div className="options">
              {[
                { val: "essai", label: "Cours à l'essai (10€)" },
                { val: "trimestre", label: "Cours au trimestre (200€ à 400€)" },
                { val: "semestre", label: "Cours au semestre (300€ à 600€)" },
                { val: "annee", label: "Cours à l'année (600€ à 800€)" },
              ].map(({ val, label }) => (
                <label key={val} className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCourseType === val}
                    onChange={() => handleCourseTypeChange(val)}
                  />
                  <span className="checkmark">
                    {selectedCourseType === val && <HiCheck />}
                  </span>
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="buttons-group">
          {showPrevButton && (
            <button type="button" onClick={onPrev} className="btn-prev-step">
              <HiArrowLongRight style={{ transform: "rotate(180deg)" }} />
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

export default CourseType;
