import React from 'react';

interface AccommodationPreferenceCardProps {
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

const AccommodationPreferenceCard: React.FC<AccommodationPreferenceCardProps> = ({ title, description, selected, onSelect }) => {
  return (
    <div
      className={`p-4 rounded-xl shadow-lg transition-transform transform ${
        selected ? 'scale-105 bg-white bg-opacity-30' : 'bg-white bg-opacity-10'
      } hover:scale-105 cursor-pointer backdrop-blur-md`}
      onClick={onSelect}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  );
};

export default AccommodationPreferenceCard;