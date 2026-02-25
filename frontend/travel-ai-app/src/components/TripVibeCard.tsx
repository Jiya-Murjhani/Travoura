import React from 'react';

interface TripVibeCardProps {
  vibe: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: (vibe: string) => void;
}

const TripVibeCard: React.FC<TripVibeCardProps> = ({ vibe, icon, selected, onSelect }) => {
  const handleClick = () => {
    onSelect(vibe);
  };

  return (
    <div
      className={`flex items-center p-4 border rounded-xl transition-transform transform hover:scale-105 ${
        selected ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
      } shadow-lg`}
      onClick={handleClick}
    >
      <div className="mr-3">{icon}</div>
      <span className="font-semibold">{vibe}</span>
    </div>
  );
};

export default TripVibeCard;