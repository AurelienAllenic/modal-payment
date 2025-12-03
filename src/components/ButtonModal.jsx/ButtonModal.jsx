import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import "./buttonModal.scss";
import { FaRegHandPointRight } from "react-icons/fa";

const ButtonModal = ({ text, data, dataType }) => {
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [capacity, setCapacity] = useState(null);
  const [loading, setLoading] = useState(true);

  // eventId uniquement pour les stages → format attendu : stage-2025-07-15
  const eventId = dataType === "traineeship" ? data.id : null;

  // Chargement des places disponibles
  useEffect(() => {
    if (dataType === "traineeship" && eventId) {
      fetch(`${import.meta.env.VITE_API_URL || ""}/api/capacity/${eventId}`)
        .then((res) => res.json())
        .then((data) => {
          setCapacity(data);
          setLoading(false);
        })
        .catch(() => {
          setCapacity({ available: 0, isFull: true });
          setLoading(false);
        });
    } else {
      setLoading(false); // pas un stage → pas de limite
    }
  }, [dataType, eventId]);

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 300);
  };

  const openModal = () => {
    if (dataType === "traineeship" && capacity?.isFull) return;
    setShowModal(true);
  };

  // Chargement
  if (loading) {
    return (
      <div className="btn-payment-modal-wrapper">
        <button className="btn-payment-modal" disabled>
          Chargement…
        </button>
      </div>
    );
  }

  // STAGE COMPLET → message rouge, pas de bouton
  if (dataType === "traineeship" && capacity?.isFull) {
    return (
      <div className="btn-payment-modal-wrapper">
        <div className="places-full">
          Plus aucune place disponible
        </div>
      </div>
    );
  }

  // AFFICHAGE NORMAL
  return (
    <div className="btn-payment-modal-wrapper">
      {!showModal ? (
        <>
          <button className="btn-payment-modal" onClick={openModal}>
            {text} <FaRegHandPointRight className="icon-btn-modal" />
          </button>

          {/* Message places restantes */}
          {dataType === "traineeship" && capacity && capacity.available > 0 && (
            <p className="places-remaining">
              Encore <strong>{capacity.available}</strong> place{capacity.available > 1 ? "s" : ""}{" "}
              disponible{capacity.available > 1 ? "s" : ""}
            </p>
          )}
        </>
      ) : (
        <Modal
          dataType={dataType}
          data={data}
          onClose={handleCloseModal}
          isClosing={isClosing}
        />
      )}
    </div>
  );
};

export default ButtonModal;