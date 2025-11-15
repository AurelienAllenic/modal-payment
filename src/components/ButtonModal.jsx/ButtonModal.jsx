import { useState } from "react";
import Modal from "../Modal/Modal";
import "./buttonModal.scss";
import { FaRegHandPointRight } from "react-icons/fa";

const ButtonModal = ({ text, data, dataType }) => {
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 300);
  };

  return (
    <div>
      {!showModal ? (
        <button
          className="btn-payment-modal"
          onClick={() => setShowModal(true)}
        >
          {text} <FaRegHandPointRight className="icon-btn-modal" />
        </button>
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
