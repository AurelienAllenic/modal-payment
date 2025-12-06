import React, { useState, useMemo } from "react";
import {
  PiNumberCircleOneThin,
  PiNumberCircleTwoThin,
  PiNumberCircleThreeThin,
  PiNumberCircleFourThin,
} from "react-icons/pi";
import { HiArrowLongRight } from "react-icons/hi2";
import { AiOutlineCheck } from "react-icons/ai";
import "./trial.scss";

const getStepIcon = (stepNumber) => {
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

const Trial = ({ stepNumber, onNext, onPrev, showPrevButton, formData, data }) => {
  console.log("formData Trial:", formData);
  console.log("data Trial:", data);

  // ✅ Récupérer les cours d'essai depuis data.courses.trials
  const trialCourses = useMemo(() => {
    const courses = data?.courses?.trials || [];
    console.log("trialCourses extraits:", courses);
    return courses;
  }, [data]);

  const [selectedDateIndex, setSelectedDateIndex] = useState(
    formData?.trialCourse
      ? trialCourses.findIndex(
          (course) =>
            course.date === formData.trialCourse.date &&
            course.time === formData.trialCourse.time &&
            course.place === formData.trialCourse.place
        )
      : null
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedDateIndex === null) {
      alert("Veuillez sélectionner une date.");
      return;
    }

    // ✅ Le cours sélectionné contient déjà toutes les données du backend
    const selectedCourse = trialCourses[selectedDateIndex];

    console.log("Cours sélectionné:", selectedCourse);

    onNext({
      trialCourse: selectedCourse,
      totalPrice: 10,
      courseType: "essai",
      duration: "trial",
    });
  };

  return (
    <div className="trialContainer">
      <div className="trialTitle">
        {getStepIcon(stepNumber)}
        <h2>Quel jour souhaitez-vous réserver votre cours ?</h2>
      </div>

      <h3 className="availabilityTitle">Prochaines disponibilités</h3>

      <form onSubmit={handleSubmit}>
        <div className="availabilityList">
          {trialCourses.length > 0 ? (
            trialCourses.map((course, index) => (
              <label
                key={course._id || index}
                className={`availabilityItem ${
                  selectedDateIndex === index ? "selected" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedDateIndex === index}
                  onChange={() => setSelectedDateIndex(index)}
                />
                <span className="checkbox-custom">
                  {selectedDateIndex === index && <AiOutlineCheck />}
                </span>
                <span className="date">{course.date}</span> -{" "}
                <span className="time">{course.time}</span> -{" "}
                <span className="place">{course.place}</span>
              </label>
            ))
          ) : (
            <p>Aucun cours d'essai disponible pour le moment.</p>
          )}
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
            disabled={trialCourses.length === 0}
          >
            Suivant <HiArrowLongRight />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Trial;