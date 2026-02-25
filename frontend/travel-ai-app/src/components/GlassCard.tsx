import React from 'react';

const GlassCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl shadow-lg p-6 transition-transform transform hover:scale-105">
      {children}
    </div>
  );
};

export default GlassCard;