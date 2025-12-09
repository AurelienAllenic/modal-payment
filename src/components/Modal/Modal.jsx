import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./modal.scss";
import { IoMdClose } from "react-icons/io";
import PersonnalInfos from "./Steps/PersonnalInfos/PersonnalInfos";
import Recap from "./Steps/Recap/Recap";
import ShowReservation from "./Steps/ShowReservation/ShowReservation";
import CourseType from "./Steps/CourseType/CourseType";
import WhatDays from "./Steps/WhatDays/WhatDays";

const Modal = ({ dataType, fetchedData, onClose, isClosing }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const data = React.useMemo(() => {
    if (dataType === "traineeship") {
      return {
        event: fetchedData.traineeship,
        capacity: fetchedData.traineeshipCapacity,
      };
    }
    if (dataType === "show") {
      return {
        event: fetchedData.show,
        capacity: fetchedData.showCapacity,
      };
    }
    if (dataType === "courses") {
      return {
        courses: {
          trials: fetchedData.trialCourses || [],
          classics: fetchedData.courses || [],
        },
        capacities: {
          trialCapacities: fetchedData.capacities?.trialCapacities || [],
          classicCapacities: fetchedData.capacities?.classicCapacities || [],
        },
      };
    }
    return {};
  }, [dataType, fetchedData]);

  useEffect(() => {
    if (!fetchedData) return;

    if (dataType === "traineeship") {
      setFormData({
        title: fetchedData.title,
        date: fetchedData.date,
        hours: fetchedData.hours,
        numberOfPlaces: fetchedData.numberOfPlaces,
        place: fetchedData.place,
        _id: fetchedData._id,
      });
    }

    if (dataType === "show") {
      setFormData({
        title: fetchedData.title,
        date: fetchedData.date,
        hours: fetchedData.hours,
        numberOfPlaces: fetchedData.numberOfPlaces,
        place: fetchedData.place,
        _id: fetchedData._id,
        alt: fetchedData.alt,
        img: fetchedData.img,
      });
    }
  }, [fetchedData, dataType]);

  const getCourseCapacity = (courseId, capacitiesArray) => {
    return capacitiesArray?.find((cap) => cap.id === courseId);
  };

  useEffect(() => {
    setCurrentStep(0);
  }, [dataType]);

  const generateOrderNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `CMD-${timestamp}-${random}`;
  };

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
          totalSteps: 4,
          steps: [
            { component: "CourseType" },
            { component: "WhatDays" },
            { component: "PersonnalInfos", needsNumberSelector: false },
            { component: "Recap" },
          ],
        };
      case "show":
        return {
          totalSteps: 3,
          steps: [
            { component: "ShowReservation" },
            { component: "PersonnalInfos", needsNumberSelector: false },
            { component: "Recap" },
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
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReserve = () => {
    const orderNumber = generateOrderNumber();

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

      case "CourseType":
        return (
          <CourseType
            stepNumber={stepNumber}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            showPrevButton={currentStep > 0}
            data={data}
            initialData={formData}
            getCourseCapacity={getCourseCapacity}
          />
        );

      case "WhatDays":
        return (
          <WhatDays
            stepNumber={stepNumber}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            showPrevButton={currentStep > 0}
            data={data}
            formData={formData}
          />
        );

      case "ShowReservation":
        return (
          <ShowReservation
            stepNumber={stepNumber}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            initialData={formData}
            showPrevButton={currentStep > 0}
            show={data.event}
            capacity={data.capacity}
          />
        );

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