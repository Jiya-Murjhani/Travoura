import { SlidersHorizontal } from 'lucide-react';

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Beaches', value: 'beaches' },
  { label: 'Mountains', value: 'mountains' },
  { label: 'Heritage', value: 'heritage' },
  { label: 'Food trails', value: 'food trails' },
  { label: 'Wellness', value: 'wellness' },
  { label: 'Urban escapes', value: 'urban escapes' },
  { label: 'Nature', value: 'nature' },
  { label: 'Island life', value: 'island life' },
];

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (tag: string) => void;
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="sticky top-[58px] z-10 w-full bg-white border-b border-black/[0.08]">
      <div className="flex items-center px-10">
        {/* Scrollable tabs */}
        <div className="flex-1 flex items-center gap-0 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const isActive = activeFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onFilterChange(tab.value)}
                className={`
                  px-5 py-3.5 text-xs font-medium tracking-wide cursor-pointer whitespace-nowrap
                  border-b-2 transition-colors duration-200
                  ${
                    isActive
                      ? 'text-gray-900 border-gray-900'
                      : 'text-gray-400 border-transparent hover:text-gray-600'
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filters button (stub) */}
        <button
          type="button"
          onClick={() => {
            // Future: open filter drawer
            console.log('[FilterBar] Filters drawer stub');
          }}
          className="ml-3 flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-500 transition-colors duration-200 hover:border-gray-300 hover:text-gray-700 flex-shrink-0"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </button>
      </div>
    </div>
  );
}
