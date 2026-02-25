import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-gradient-to-r from-pink-500 to-yellow-500 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;