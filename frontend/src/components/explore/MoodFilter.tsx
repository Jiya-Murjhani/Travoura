const MOODS = [
  {
    label: 'Beach',
    value: 'beach',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80',
  },
  {
    label: 'Adventure',
    value: 'adventure',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=300&q=80',
  },
  {
    label: 'Nature',
    value: 'nature',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=300&q=80',
  },
  {
    label: 'Culture',
    value: 'culture',
    image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=300&q=80',
  },
  {
    label: 'Nights',
    value: 'nights',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e6da7?auto=format&fit=crop&w=300&q=80',
  },
  {
    label: 'Slow',
    value: 'slow',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&q=80',
  },
];

interface MoodFilterProps {
  activeMood: string | null;
  onMoodChange: (mood: string) => void;
}

export default function MoodFilter({ activeMood, onMoodChange }: MoodFilterProps) {
  const handleClick = (mood: string) => {
    console.log(`[MoodFilter] mood selected: ${mood}`);
    onMoodChange(mood);
  };

  return (
    <section className="px-10 py-8">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
        What's your mood?
      </h3>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {MOODS.map((mood) => {
          const isActive = activeMood === mood.value;

          return (
            <button
              key={mood.value}
              type="button"
              onClick={() => handleClick(mood.value)}
              className={`
                relative w-[120px] h-[80px] rounded-xl overflow-hidden cursor-pointer flex-shrink-0
                transition-transform duration-200 hover:scale-[1.04]
                ${isActive ? 'ring-[2.5px] ring-gray-900 ring-offset-2' : ''}
              `}
            >
              {/* Background image */}
              <img
                src={mood.image}
                alt={mood.label}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/35" />

              {/* Label */}
              <span className="absolute bottom-2 left-2.5 text-[11px] font-semibold text-white z-10">
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
