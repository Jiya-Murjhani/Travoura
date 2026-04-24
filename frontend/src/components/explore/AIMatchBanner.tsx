import { usePreferences } from '@/hooks/usePreferences';
import { useState } from 'react';
import { PreferencesSlideOver } from '@/components/preferences/PreferencesSlideOver';

export default function AIMatchBanner() {
  const { preferences, isLoading } = usePreferences();
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  if (isLoading) return null;

  const topTags = (preferences?.interests ?? []).slice(0, 3);
  const hasPrefs = preferences && topTags.length > 0;

  return (
    <>
      <PreferencesSlideOver open={isSlideOverOpen} onOpenChange={setIsSlideOverOpen} />

      <div className="w-full bg-white border-b border-black/[0.08] px-10 py-3 flex items-center gap-3">
        {/* AI badge */}
        <span className="inline-flex items-center rounded-full bg-gray-900 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white flex-shrink-0">
          AI Picks
        </span>

        {hasPrefs ? (
          <>
            {/* Matched tags */}
            <p className="text-sm text-gray-500 truncate">
              Matched to:{' '}
              {topTags.map((tag, i) => (
                <span key={tag}>
                  <span className="font-semibold text-gray-900">{tag}</span>
                  {i < topTags.length - 1 && ', '}
                </span>
              ))}
            </p>

            {/* Refine link */}
            <button
              type="button"
              onClick={() => setIsSlideOverOpen(true)}
              className="ml-auto text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
            >
              Refine preferences →
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsSlideOverOpen(true)}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200"
          >
            Complete your preferences to get personalised matches →
          </button>
        )}
      </div>
    </>
  );
}
