import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import "./buttonModal.scss";
import { FaRegHandPointRight } from "react-icons/fa";

const ButtonModal = ({ text, traineeshipData, coursesData, ShowData }) => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [dataType, setDataType] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (traineeshipData && traineeshipData !== "") {
      setData(traineeshipData);
      setDataType("traineeship");
    } else if (coursesData && coursesData !== "") {
      setData(coursesData);
      setDataType("courses");
    } else if (ShowData && ShowData !== "") {
      setData(ShowData);
      setDataType("show");
    }
  }, [traineeshipData, coursesData, ShowData]);

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
