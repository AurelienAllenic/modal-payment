import React, { useState } from "react";
import "./modal.scss";
import { IoMdClose } from "react-icons/io";
import PersonnalInfos from "./Steps/PersonnalInfos/PersonnalInfos";
import Recap from "./Steps/Recap/Recap";

const Modal = ({ dataType, data, onClose, isClosing }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

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
    setFormData((prevData) => ({ ...prevData, ...stepData }));

    if (currentStep < config.totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Dernière étape - soumission finale
      console.log("Données finales:", { ...formData, ...stepData });
      // Ici tu peux envoyer au backend
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
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
        return <Recap data={formData} />;

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
