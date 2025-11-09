import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./modal.scss";
import { IoMdClose } from "react-icons/io";
import PersonnalInfos from "./Steps/PersonnalInfos/PersonnalInfos";
import Recap from "./Steps/Recap/Recap";

const Modal = ({ dataType, data, onClose, isClosing }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  // Fonction pour générer un numéro de commande aléatoire
  const generateOrderNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `CMD-${timestamp}-${random}`;
  };

  // Configuration des étapes selon le type
  const getStepsConfig = () => {
    switch (dataType) {
      case "traineeship":
        return {
          totalSteps: 2,
          steps: [
            { component: "PersonnalInfos", needsNumberSelector: true },
            { component: "Recap" },
          ],
        };
      case "courses":
        return {
          totalSteps: 3,
          steps: [
            { component: "CourseSelection" },
            { component: "PersonnalInfos", needsNumberSelector: false },
            { component: "Payment" },
          ],
        };
      case "show":
        return {
          totalSteps: 3,
          steps: [
            { component: "ShowSelection" },
            { component: "PersonnalInfos", needsNumberSelector: false },
            { component: "Payment" },
          ],
        };
      default:
        return { totalSteps: 0, steps: [] };
    }
  };

  const config = getStepsConfig();
  const currentStepConfig = config.steps[currentStep];

  const handleNextStep = (stepData) => {
    const updatedFormData = { ...formData, ...stepData };
    setFormData(updatedFormData);

    if (currentStep < config.totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Données finales:", updatedFormData);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReserve = () => {
    const orderNumber = generateOrderNumber();

    console.log("Réservation finale:", {
      orderNumber,
      formData,
      data,
    });

    // Redirection vers Success avec les données
    navigate("/success", {
      state: {
        orderNumber,
        formData,
        data,
        dataType,
      },
    });
  };

  const renderStep = () => {
    if (!currentStepConfig) return null;

    const stepNumber = currentStep + 1;

    switch (currentStepConfig.component) {
      case "PersonnalInfos":
        return (
          <PersonnalInfos
            isNumberSelector={currentStepConfig.needsNumberSelector}
            stepNumber={stepNumber}
            totalSteps={config.totalSteps}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            initialData={formData}
            showPrevButton={currentStep > 0}
          />
        );

      case "Recap":
        return (
          <Recap
            formData={formData}
            data={data}
            dataType={dataType}
            stepNumber={stepNumber}
            onPrev={handlePrevStep}
            onReserve={handleReserve}
            showPrevButton={currentStep > 0}
          />
        );

      case "CourseSelection":
        return <div className="course-selection-step"></div>;

      case "ShowSelection":
        return <div className="show-selection-step"></div>;

      default:
        return null;
    }
  };

  return (
    <div>
      {dataType && (
        <div className={`modal-container ${isClosing ? "closing" : ""}`}>
          <div className="modal">
            <div className="container-close-modal">
              <IoMdClose className="icon-close-modal" onClick={onClose} />
            </div>
            {renderStep()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
