// ButtonModal.jsx
import { useState } from "react";
import { HiArrowRight } from "react-icons/hi2";
import Modal from "../Modal/Modal";
import "./buttonModal.scss";

const ButtonModal = ({ text, data, dataType }) => {
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  console.log(data)

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
          <span className="btn-text">{text}</span>
          <HiArrowRight className="icon-btn-modal" />
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
