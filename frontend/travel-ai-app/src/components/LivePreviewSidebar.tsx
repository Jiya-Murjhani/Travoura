import React from 'react';

interface LivePreviewSidebarProps {
  estimatedCost: number;
  suggestedDuration: string;
  miniMap: React.ReactNode; // Placeholder for mini map component
}

const LivePreviewSidebar: React.FC<LivePreviewSidebarProps> = ({ estimatedCost, suggestedDuration, miniMap }) => {
  return (
    <div className="bg-white bg-opacity-30 backdrop-blur-lg rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
      <div className="mb-4">
        <h3 className="text-lg font-medium">Estimated Cost</h3>
        <p className="text-2xl font-bold">${estimatedCost.toFixed(2)}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-medium">Suggested Duration</h3>
        <p className="text-xl">{suggestedDuration}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-medium">Map Preview</h3>
        <div className="h-40 w-full border border-gray-300 rounded-lg overflow-hidden">
          {miniMap}
        </div>
      </div>
    </div>
  );
};

export default LivePreviewSidebar;