import React from 'react';

const Stepper = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="text-lg font-semibold">
        Step {currentStep} of {totalSteps}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      <div className="flex justify-between w-full mt-2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full ${
              index < currentStep ? 'bg-blue-500' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Stepper;