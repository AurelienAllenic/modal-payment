import React from "react";
import "./modal.scss";
import { IoMdClose } from "react-icons/io";

const Modal = ({ dataType, data, onClose, isClosing }) => {
  console.log(dataType, data);
  console.log(data);

  return (
    <div>
      {dataType === "traineeship" && (
        <div className={`modal-container ${isClosing ? "closing" : ""}`}>
          <div className="modal">
            <div className="container-close-modal">
              <IoMdClose className="icon-close-modal" onClick={onClose} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
