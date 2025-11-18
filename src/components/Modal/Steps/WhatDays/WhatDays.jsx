import React, { useEffect, useState } from "react";
import Trial from "./Trial/Trial";
import Classic from "./Classic/Classic";
import "./whatDays.scss";

const WhatDays = ({
  data,
  formData,
  stepNumber,
  onNext,
  onPrev,
  showPrevButton,
}) => {
  const [isTrial, setIsTrial] = useState(false);

  useEffect(() => {
    if (formData.courseType === "essai") {
      setIsTrial(true);
    } else {
      setIsTrial(false);
    }
  }, [formData.courseType]);

  return (
    <div className="whatDaysContainer">
      {isTrial ? (
        <Trial
          data={data}
          formData={formData}
          stepNumber={stepNumber}
          onNext={onNext}
          onPrev={onPrev}
          showPrevButton={showPrevButton}
        />
      ) : (
        <Classic
          data={data}
          formData={formData}
          stepNumber={stepNumber}
          onNext={onNext}
          onPrev={onPrev}
          showPrevButton={showPrevButton}
        />
      )}
    </div>
  );
};

export default WhatDays;
