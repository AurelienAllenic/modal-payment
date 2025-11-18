import React, { useState } from "react";
import { PiNumberCircleOneThin } from "react-icons/pi";
import { HiArrowLongRight } from "react-icons/hi2";
import "./courseType.scss"; // Assume you create a SCSS file for styling

const CourseType = ({ stepNumber, onNext, onPrev, showPrevButton }) => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
  const [selectedCourseType, setSelectedCourseType] = useState("");

  const handleAgeGroupChange = (e) => {
    setSelectedAgeGroup(e.target.value);
  };

  const handleCourseTypeChange = (e) => {
    setSelectedCourseType(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAgeGroup || !selectedCourseType) {
      alert("Veuillez sélectionner une catégorie d'âge et un type de cours.");
      return;
    }
    onNext({ ageGroup: selectedAgeGroup, courseType: selectedCourseType });
  };

  const getStepIcon = () => {
    switch (stepNumber) {
      case 1:
        return <PiNumberCircleOneThin className="stepIcon" />;
      default:
        return null;
    }
  };

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
              <label>
                <input
                  type="radio"
                  name="ageGroup"
                  value="enfant"
                  checked={selectedAgeGroup === "enfant"}
                  onChange={handleAgeGroupChange}
                />
                Enfant
              </label>
              <label>
                <input
                  type="radio"
                  name="ageGroup"
                  value="ado"
                  checked={selectedAgeGroup === "ado"}
                  onChange={handleAgeGroupChange}
                />
                Ado
              </label>
              <label>
                <input
                  type="radio"
                  name="ageGroup"
                  value="adulte"
                  checked={selectedAgeGroup === "adulte"}
                  onChange={handleAgeGroupChange}
                />
                Adulte
              </label>
            </div>
          </div>
          <div className="section">
            <h3>Quel type de cours souhaitez-vous réserver ?</h3>
            <div className="options">
              <label>
                <input
                  type="radio"
                  name="courseType"
                  value="essai"
                  checked={selectedCourseType === "essai"}
                  onChange={handleCourseTypeChange}
                />
                Cours à l'essai
              </label>
              <label>
                <input
                  type="radio"
                  name="courseType"
                  value="trimestre"
                  checked={selectedCourseType === "trimestre"}
                  onChange={handleCourseTypeChange}
                />
                Cours au trimestre
              </label>
              <label>
                <input
                  type="radio"
                  name="courseType"
                  value="semestre"
                  checked={selectedCourseType === "semestre"}
                  onChange={handleCourseTypeChange}
                />
                Cours au semestre
              </label>
              <label>
                <input
                  type="radio"
                  name="courseType"
                  value="annee"
                  checked={selectedCourseType === "annee"}
                  onChange={handleCourseTypeChange}
                />
                Cours à l'année
              </label>
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
