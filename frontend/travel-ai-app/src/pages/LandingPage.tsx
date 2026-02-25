import React from 'react';
import { useHistory } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const history = useHistory();

  const handleStartPlanning = () => {
    history.push('/trip-planner');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-pink-500 to-yellow-500">
      <h1 className="text-4xl font-bold text-white mb-8">Welcome to Travel AI</h1>
      <p className="text-lg text-white mb-4">Plan your perfect trip with our AI-powered assistant.</p>
      <button
        onClick={handleStartPlanning}
        className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
      >
        Start Planning
      </button>
    </div>
  );
};

export default LandingPage;