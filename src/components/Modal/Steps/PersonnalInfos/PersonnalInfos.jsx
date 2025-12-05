import React, { useState, useEffect } from "react";
import "./personnalInfos.scss";
import { PiNumberCircleOneThin, PiNumberCircleTwoThin } from "react-icons/pi";
import { HiArrowLongRight } from "react-icons/hi2";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";

const PersonnalInfos = ({
  isNumberSelector,
  stepNumber,
  onNext,
  onPrev,
  initialData,
  showPrevButton,
}) => {
  console.log(initialData, "initialData")
  const [formData, setFormData] = useState({
    nom: initialData?.nom || "",
    telephone: initialData?.telephone || "",
    email: initialData?.email || "",
    message: initialData?.message || "",
    ...(isNumberSelector && {
      nombreParticipants: initialData?.nombreParticipants || 1,
    }),
  });

  // ✅ Ajoute cet useEffect pour mettre à jour quand initialData change
  useEffect(() => {
    if (initialData) {
      setFormData({
        nom: initialData.nom || "",
        telephone: initialData.telephone || "",
        email: initialData.email || "",
        message: initialData.message || "",
        ...(isNumberSelector && {
          nombreParticipants: initialData.nombreParticipants || 1,
        }),
      });
    }
  }, [initialData, isNumberSelector]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (increment) => {
    setFormData((prev) => ({
      ...prev,
      nombreParticipants: Math.max(1, prev.nombreParticipants + increment),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({
      nom: formData.nom,
      telephone: formData.telephone,
      email: formData.email,
      message: formData.message,
      ...(isNumberSelector && { nombreParticipants: formData.nombreParticipants }),
    });
  };

  return (
    <div className="personnalInfosContainer">
      <div className="PersonalInfosTitle">
        {stepNumber === 1 ? (
          <PiNumberCircleOneThin className="stepIcon" />
        ) : stepNumber === 2 ? (
          <PiNumberCircleTwoThin className="stepIcon" />
        ) : null}
        <h2>Vos informations personnelles</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="personnalInfosFormContainer">
          <div className="inputsGroup">
            <div className="singleInput">
              <label>Nom</label>
              <input
                type="text"
                name="nom"
                placeholder="Votre nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>
            <div className="singleInput">
              <label>Téléphone</label>
              <input
                type="tel"
                name="telephone"
                placeholder="0612345678"
                value={formData.telephone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="singleInput">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="textareaContainer">
            <label>Message</label>
            <textarea
              name="message"
              placeholder="Pourquoi nous écrire ? Quelles sont vos attentes, des commentaires ?"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>
          {isNumberSelector && (
            <div className="numberSelectorContainer">
              <label>Nombre de participants</label>
              <div className="number-selector-wrapper">
                <div className="number-display">
                  {formData.nombreParticipants}
                </div>
                <div className="number-controls">
                  <button
                    type="button"
                    className="number-btn"
                    onClick={() => handleNumberChange(1)}
                  >
                    <IoMdArrowDropup />
                  </button>
                  <button
                    type="button"
                    className="number-btn"
                    onClick={() => handleNumberChange(-1)}
                  >
                    <IoMdArrowDropdown />
                  </button>
                </div>
              </div>
            </div>
          )}
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

export default PersonnalInfos;
