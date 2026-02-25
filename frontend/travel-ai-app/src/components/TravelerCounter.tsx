import React, { useState } from 'react';

const TravelerCounter: React.FC = () => {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const handleAdultChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAdults(Number(event.target.value));
  };

  const handleChildrenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setChildren(Number(event.target.value));
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg glassmorphism">
      <h2 className="text-lg font-semibold mb-4">Traveler Counter</h2>
      <div className="flex justify-between w-full mb-4">
        <div className="flex flex-col">
          <label htmlFor="adults" className="mb-2">Adults</label>
          <select id="adults" value={adults} onChange={handleAdultChange} className="border rounded p-2">
            {[...Array(10).keys()].map((num) => (
              <option key={num} value={num + 1}>{num + 1}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="children" className="mb-2">Children</label>
          <select id="children" value={children} onChange={handleChildrenChange} className="border rounded p-2">
            {[...Array(10).keys()].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-sm text-gray-600">Total Travelers: {adults + children}</p>
    </div>
  );
};

export default TravelerCounter;