import React, { useState, useEffect } from "react";
import {
  PiNumberCircleOneThin,
  PiNumberCircleTwoThin,
  PiNumberCircleThreeThin,
  PiNumberCircleFourThin,
} from "react-icons/pi";
import { HiArrowLongRight } from "react-icons/hi2";
import { AiOutlineCheck } from "react-icons/ai";
import { prices } from "../../../../data/Data";
import "./classic.scss";

const Classic = ({
  data,
  formData,
  stepNumber,
  onNext,
  onPrev,
  showPrevButton,
}) => {
  const coursesData = Array.isArray(data?.courses?.classics)
  ? data.courses.classics
  : [];

  const days = ["Mardi", "Mercredi", "Jeudi"];


  const [selectedCourses, setSelectedCourses] = useState({
    Mardi: formData?.classicCourses?.Mardi || null,
    Mercredi: formData?.classicCourses?.Mercredi || null,
    Jeudi: formData?.classicCourses?.Jeudi || null,
  });

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const selectedCount = Object.values(selectedCourses).filter(Boolean).length;
    if (selectedCount === 0) {
      setTotalPrice(0);
      return;
    }

    const ageGroup = formData?.ageGroup; // "enfant", "ado", "adulte"
    const isChild = ageGroup === "enfant";
    const type = formData?.courseType; // "trimestre", "semestre", "annee"

    // Construction du préfixe
    let prefix = "";
    if (type === "trimestre") {
      prefix = selectedCount === 1 ? "trimester" : `trimester${selectedCount}`;
    } else if (type === "semestre") {
      prefix = selectedCount === 1 ? "semester" : `semester${selectedCount}`;
    } else if (type === "annee") {
      prefix = selectedCount === 1 ? "year" : `year${selectedCount}`;
    } else {
      setTotalPrice(0);
      return;
    }

    const suffix = isChild ? "_child" : "_adult";
    const priceKey = prefix + suffix;

    const price = prices[priceKey] || 0;
    console.log("Prix calculé :", priceKey, "→", price); // Debug temporaire

    setTotalPrice(price);
  }, [selectedCourses, formData?.courseType, formData?.ageGroup]);

  // Important : on dépend aussi de ageGroup ici ↑

  const handleSelectCourse = (day, course) => {
    setSelectedCourses((prev) => ({
      ...prev,
      [day]: prev[day] === course ? null : course,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedCount = Object.values(selectedCourses).filter(Boolean).length;

    if (selectedCount === 0) {
      alert("Veuillez sélectionner au moins un cours sur un jour.");
      return;
    }

    if ((formData.courseType === "trimestre" || formData.courseType === "semestre") && selectedCount > 3) {
      alert("Vous ne pouvez sélectionner que 3 cours maximum pour trimestre/semestre.");
      return;
    }

    // Recalcul final (sécurité)
    const isChild = formData.ageGroup === "enfant";
    const type = formData.courseType;
    let prefix = "";
    if (type === "trimestre") prefix = selectedCount === 1 ? "trimester" : `trimester${selectedCount}`;
    else if (type === "semestre") prefix = selectedCount === 1 ? "semester" : `semester${selectedCount}`;
    else if (type === "annee") prefix = selectedCount === 1 ? "year" : `year${selectedCount}`;

    const finalPrice = prices[prefix + (isChild ? "_child" : "_adult")] || 0;

    onNext({
      classicCourses: selectedCourses,
      totalPrice: finalPrice,
      duration: formData.courseType,        // important pour Stripe
      nbCoursesPerWeek: selectedCount,      // très important
    });
  };

  const getStepIcon = () => {
    switch (stepNumber) {
      case 1: return <PiNumberCircleOneThin className="stepIcon" />;
      case 2: return <PiNumberCircleTwoThin className="stepIcon" />;
      case 3: return <PiNumberCircleThreeThin className="stepIcon" />;
      case 4: return <PiNumberCircleFourThin className="stepIcon" />;
      default: return null;
    }
  };

  return (
    <div className="classicContainer">
      <div className="classicTitle">
        {getStepIcon()}
        <h2>Choisissez vos cours par jour</h2>
        <div className="totalPrice">
          Total : <span>{totalPrice} €</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="classicGrid">
          {days.map((day) => (
            <div key={day} className="dayColumn">
              <h3>{day}</h3>
              <div className="container-options-day">
                {coursesData
                  .filter((course) => course.day?.toLowerCase() === day.toLowerCase())
                  .filter((course) => course.numberOfPlaces > 0) // ✅ AJOUT : Filtrer les cours sans places
                  .map((course, index) => (
                    <label
                      key={index}
                      className={`courseItem ${selectedCourses[day] === course ? "selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCourses[day] === course}
                        onChange={() => handleSelectCourse(day, course)}
                      />
                      <span className="checkbox-custom">
                        {selectedCourses[day] === course && <AiOutlineCheck />}
                      </span>
                      <span>{course.date} - {course.time} - {course.place}</span>
                    </label>
                  ))}
                {/* ✅ AJOUT : Message si aucun cours disponible pour ce jour */}
                {coursesData
                  .filter((course) => course.day?.toLowerCase() === day.toLowerCase())
                  .filter((course) => course.numberOfPlaces > 0).length === 0 && (
                  <p className="no-courses-available">Aucun cours disponible ce jour</p>
                )}
              </div>
            </div>
          ))}
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

export default Classic;