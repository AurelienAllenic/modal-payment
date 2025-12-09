import React, { useState, useEffect, useMemo } from "react";
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
  data,
}) => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
  const [selectedCourseType, setSelectedCourseType] = useState("");

  // ✅ Vérifier si des cours d'essai sont disponibles
  const hasAvailableTrialCourses = useMemo(() => {
    const trialCourses = data?.courses?.trials || [];
    return trialCourses.some(course => course.numberOfPlaces > 0);
  }, [data]);

  // ✅ AJOUT : Vérifier si des cours classiques sont disponibles
  const hasAvailableClassicCourses = useMemo(() => {
    const classicCourses = data?.courses?.classics || [];
    return classicCourses.some(course => course.numberOfPlaces > 0);
  }, [data]);

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

  // ✅ Liste des types de cours avec condition d'affichage
  const courseTypes = [
    { 
      val: "essai", 
      label: "Cours à l'essai (10€)", 
      show: hasAvailableTrialCourses
    },
    { 
      val: "trimestre", 
      label: "Cours au trimestre (200€ à 400€)", 
      show: hasAvailableClassicCourses // ✅ Condition ajoutée
    },
    { 
      val: "semestre", 
      label: "Cours au semestre (300€ à 600€)", 
      show: hasAvailableClassicCourses // ✅ Condition ajoutée
    },
    { 
      val: "annee", 
      label: "Cours à l'année (600€ à 800€)", 
      show: hasAvailableClassicCourses // ✅ Condition ajoutée
    },
  ];

  // ✅ AJOUT : Vérifier si au moins un type de cours est disponible
  const hasAnyAvailableCourses = hasAvailableTrialCourses || hasAvailableClassicCourses;

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
            
            {/* ✅ AJOUT : Si aucun cours disponible, afficher un message */}
            {!hasAnyAvailableCourses ? (
              <div className="no-courses-message">
                <p>😔 Plus aucun cours disponible actuellement.</p>
                <p>Tous les cours sont complets pour le moment. Veuillez revenir plus tard.</p>
              </div>
            ) : (
              <>
                <div className="options">
                  {courseTypes
                    .filter(({ show }) => show)
                    .map(({ val, label }) => (
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
                
                {/* ✅ Messages informatifs spécifiques */}
                {!hasAvailableTrialCourses && hasAvailableClassicCourses && (
                  <p className="info-message">
                    ℹ️ Les cours à l'essai sont actuellement complets.
                  </p>
                )}
                {hasAvailableTrialCourses && !hasAvailableClassicCourses && (
                  <p className="info-message">
                    ℹ️ Les cours réguliers (trimestre/semestre/année) sont actuellement complets.
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="buttons-group">
          {showPrevButton && (
            <button type="button" onClick={onPrev} className="btn-prev-step">
              <HiArrowLongRight style={{ transform: "rotate(180deg)" }} />
              Précédent
            </button>
          )}
          <button 
            type="submit" 
            className="btn-next-step"
            disabled={!hasAnyAvailableCourses} // ✅ Désactiver si aucun cours
          >
            Suivant <HiArrowLongRight />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseType;