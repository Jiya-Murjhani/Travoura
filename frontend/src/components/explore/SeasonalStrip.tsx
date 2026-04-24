import { useSeasonalData } from '@/hooks/useExplore';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface SeasonalStripProps {
  destinationId: string;
  destinationName: string;
}

export default function SeasonalStrip({ destinationId, destinationName }: SeasonalStripProps) {
  const { data: months, isLoading, isError } = useSeasonalData(destinationId);

  if (isError) return null;

  const currentMonth = new Date().getMonth(); // 0-indexed

  if (isLoading || !months) {
    return (
      <div className="rounded-2xl border border-black/[0.07] bg-white p-5">
        <Skeleton className="h-5 w-40 mb-1" />
        <Skeleton className="h-3 w-52 mb-5" />
        <div className="flex gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="flex-1 h-6 rounded" />
          ))}
        </div>
      </div>
    );
  }

  // Sort by month to ensure 1–12 order
  const sorted = [...months].sort((a, b) => a.month - b.month);

  // Compute peak season info
  const peakMonths = sorted.filter((m) => m.qualityScore === 5).map((m) => m.month);
  const currentMonthNum = currentMonth + 1; // 1-indexed to match data

  let seasonBadge: { label: string; dot: string } | null = null;

  if (peakMonths.length > 0) {
    if (peakMonths.includes(currentMonthNum)) {
      seasonBadge = { label: "You're in peak season", dot: 'bg-emerald-500' };
    } else {
      // Find months until next peak
      let minDistance = 12;
      for (const pm of peakMonths) {
        const dist = pm > currentMonthNum ? pm - currentMonthNum : 12 - currentMonthNum + pm;
        if (dist < minDistance) minDistance = dist;
      }

      if (minDistance <= 2) {
        const weeks = Math.round(minDistance * 4.3);
        seasonBadge = { label: `Peak season in ~${weeks} weeks`, dot: 'bg-amber-500' };
      } else {
        seasonBadge = { label: 'Shoulder season — good deals available', dot: 'bg-blue-500' };
      }
    }
  }

  const getBarStyles = (score: number) => {
    if (score >= 5) return { bg: 'bg-gray-900', text: 'text-white', symbol: '★' };
    if (score >= 3) return { bg: 'bg-gray-200', text: 'text-gray-600', symbol: '+' };
    return { bg: 'bg-gray-100', text: 'text-gray-300', symbol: '' };
  };

  return (
    <div className="rounded-2xl border border-black/[0.07] bg-white p-5">
      {/* Header */}
      <h4 className="text-[17px] font-bold text-gray-900 leading-snug">
        {destinationName}
      </h4>
      <p className="text-xs text-gray-400 mt-0.5 mb-5">
        Best months highlighted
      </p>

      {/* Month bars */}
      <TooltipProvider delayDuration={0}>
        <div className="flex gap-1">
          {sorted.map((m, i) => {
            const style = getBarStyles(m.qualityScore);
            const isCurrent = m.month === currentMonthNum;

            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                {/* Month label */}
                <span className="text-[8px] uppercase tracking-wide text-gray-400 font-medium">
                  {MONTH_ABBR[m.month - 1]}
                </span>

                {/* Bar */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`
                        w-full rounded flex items-center justify-center text-[9px] font-bold
                        seasonal-bar-grow
                        ${style.bg} ${style.text}
                        ${isCurrent ? 'ring-2 ring-gray-900 ring-offset-1' : ''}
                      `}
                      style={{
                        animationDelay: `${i * 35}ms`,
                      }}
                    >
                      {style.symbol}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="rounded-lg text-xs"
                  >
                    <p className="font-semibold">{m.label}</p>
                    <p className="text-muted-foreground">{m.avgTempCelsius}°C</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          })}
        </div>
      </TooltipProvider>

      {/* Season badge */}
      {seasonBadge && (
        <div className="mt-4">
          <Badge
            variant="secondary"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${seasonBadge.dot}`} />
            {seasonBadge.label}
          </Badge>
        </div>
      )}

      {/* Bar grow animation */}
      <style>{`
        @keyframes barGrow {
          from {
            height: 0;
          }
          to {
            height: 24px;
          }
        }

        .seasonal-bar-grow {
          height: 0;
          animation: barGrow 0.3s ease-out forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .seasonal-bar-grow {
            height: 24px;
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
