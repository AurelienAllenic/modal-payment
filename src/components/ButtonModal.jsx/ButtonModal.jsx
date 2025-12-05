// ButtonModal.jsx
import { useState } from "react";
import Modal from "../Modal/Modal";

const ButtonModal = ({ text, data, dataType }) => {
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 300);
  };

  return (
    <div className="btn-payment-modal-wrapper">
      {!showModal ? (
        <button className="btn-payment-modal" onClick={openModal}>
          {text} <span className="icon-btn-modal">👉</span>
        </button>
      ) : (
        <Modal
          fetchedData={data}
          dataType={dataType}
          onClose={handleCloseModal}
          isClosing={isClosing}
        />
      )}
    </div>
  );
};

export default ButtonModal;
