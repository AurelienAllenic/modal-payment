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
  const coursesData = Array.isArray(data?.courses) ? data.courses : [];
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

    const type = formData?.courseType;

    let priceKey = "trial";
    if (type === "trimestre") {
      priceKey =
        selectedCount === 1
          ? "trimester"
          : selectedCount === 2
          ? "trimester2"
          : "trimester3";
    } else if (type === "semestre") {
      priceKey =
        selectedCount === 1
          ? "semester"
          : selectedCount === 2
          ? "semester2"
          : "semester3";
    } else if (type === "annee") {
      priceKey = "year";
    } else if (type === "essai") {
      priceKey = "trial";
    }

    setTotalPrice(prices[priceKey] || 0);
  }, [selectedCourses, formData.courseType]);

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

    let type = formData?.courseType;
    let maxCourses = 1;
    if (type === "trimestre" || type === "semestre") {
      maxCourses = 3;
    }

    if (selectedCount > maxCourses) {
      alert(`Vous ne pouvez sélectionner que ${maxCourses} cours au maximum.`);
      return;
    }

    onNext({ classicCourses: selectedCourses, totalPrice });
  };

  const getStepIcon = () => {
    switch (stepNumber) {
      case 1:
        return <PiNumberCircleOneThin className="stepIcon" />;
      case 2:
        return <PiNumberCircleTwoThin className="stepIcon" />;
      case 3:
        return <PiNumberCircleThreeThin className="stepIcon" />;
      case 4:
        return <PiNumberCircleFourThin className="stepIcon" />;
      default:
        return null;
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
                  .filter((course) => course.day === day)
                  .map((course, index) => (
                    <label
                      key={index}
                      className={`courseItem ${
                        selectedCourses[day] === course ? "selected" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCourses[day] === course}
                        onChange={() => handleSelectCourse(day, course)}
                      />
                      <span className="checkbox-custom">
                        {selectedCourses[day] === course && <AiOutlineCheck />}
                      </span>
                      <span>
                        {course.date} - {course.time} - {course.place}
                      </span>
                    </label>
                  ))}
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
