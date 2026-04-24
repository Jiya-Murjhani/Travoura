import React, { useEffect, useRef, useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WaypointData {
  fraction: number;
  label: string;
  x: number;
  y: number;
  active: boolean;
}

// ─── Scroll Hook ──────────────────────────────────────────────────────────────

function useFlightPathScroll(sectionRef: React.RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const sectionHeight = sectionRef.current.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrolled = windowHeight - rect.top;
    const total = sectionHeight + windowHeight;
    const prog = Math.min(Math.max(scrolled / total, 0), 1);
    setProgress(prog);
  }, [sectionRef]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on mount to set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return progress;
}

// ─── Radar Pulse Sub-component ────────────────────────────────────────────────

interface RadarPulseProps {
  x: number;
  y: number;
}

const RadarPulse: React.FC<RadarPulseProps> = ({ x, y }) => {
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseKey(k => k + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <circle
      key={pulseKey}
      cx={x}
      cy={y}
      r={4}
      fill="none"
      stroke="#C9A84C"
      strokeWidth={1}
      style={{
        animation: 'radar-expand 2s ease-out forwards',
      }}
    />
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const FlightPathSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const aircraftGroupRef = useRef<SVGGElement>(null);
  const trailPathRef = useRef<SVGPathElement>(null);
  const aheadPathRef = useRef<SVGPathElement>(null);

  const progress = useFlightPathScroll(sectionRef as React.RefObject<HTMLElement>);

  const [waypoints, setWaypoints] = useState<WaypointData[]>([
    { fraction: 0.22, label: 'Mumbai', x: 0, y: 0, active: false },
    { fraction: 0.52, label: 'Dubai',  x: 0, y: 0, active: false },
    { fraction: 0.80, label: 'London', x: 0, y: 0, active: false },
  ]);

  const [totalLength, setTotalLength] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // ── Compute path total length + waypoint pixel positions after mount ──
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    requestAnimationFrame(() => {
      const len = path.getTotalLength();
      setTotalLength(len);

      setWaypoints(prev =>
        prev.map(wp => {
          const pt = path.getPointAtLength(wp.fraction * len);
          return { ...wp, x: pt.x, y: pt.y };
        })
      );
    });
  }, []);

  // ── Intersection observer: fade in section labels when visible ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // ── Reposition aircraft + update trail every time scroll progress changes ──
  useEffect(() => {
    const path = pathRef.current;
    const group = aircraftGroupRef.current;
    if (!path || !group || totalLength === 0) return;

    const currentLength = progress * totalLength;
    const pt = path.getPointAtLength(currentLength);

    // Derive heading angle from the path tangent at current position
    const epsilon = 3;
    const p1 = path.getPointAtLength(Math.max(0, currentLength - epsilon));
    const p2 = path.getPointAtLength(Math.min(totalLength, currentLength + epsilon));
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);

    group.setAttribute(
      'transform',
      `translate(${pt.x}, ${pt.y}) rotate(${angle}) scale(1.3)`
    );

    // Gold trail: grow the drawn segment
    const trail = trailPathRef.current;
    if (trail) {
      trail.style.strokeDasharray = `${currentLength} ${totalLength}`;
      trail.style.strokeDashoffset = '0';
    }

    // Ahead dashed path: offset so it starts from current aircraft position
    const ahead = aheadPathRef.current;
    if (ahead) {
      ahead.style.strokeDashoffset = `${-currentLength}`;
      ahead.style.opacity = (totalLength - currentLength) > 10 ? '0.45' : '0';
    }

    // Mark waypoints as active once the plane has passed them
    setWaypoints(prev =>
      prev.map(wp => ({ ...wp, active: progress >= wp.fraction }))
    );
  }, [progress, totalLength]);

  // ── Get current aircraft SVG coordinates for the radar pulse ──
  const aircraftPos = (() => {
    if (!pathRef.current || totalLength === 0) return { x: 140, y: 680 };
    const pt = pathRef.current.getPointAtLength(progress * totalLength);
    return { x: pt.x, y: pt.y };
  })();

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── CSS keyframe animations injected once ── */}
      <style>{`
        @keyframes radar-expand {
          0%   { r: 4;  opacity: 0.7; }
          100% { r: 36; opacity: 0;   }
        }
        @keyframes waypoint-pulse {
          0%   { r: 6;  opacity: 1; }
          100% { r: 18; opacity: 0; }
        }
        @keyframes flight-label-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        .fp-label {
          opacity: 0;
        }
        .fp-label.visible {
          animation: flight-label-in 600ms cubic-bezier(0.16,1,0.3,1) 400ms forwards;
        }
        .fp-label-right.visible {
          animation: flight-label-in 600ms cubic-bezier(0.16,1,0.3,1) 620ms forwards;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="hidden md:block"
        style={{
          position: 'relative',
          width: '100%',
          height: '90vh',
          minHeight: '600px',
          background: 'var(--color-surface, #F7F5F0)',
          overflow: 'hidden',
        }}
      >

        {/* ── Dot-grid world map background ── */}
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.35,
            pointerEvents: 'none',
          }}
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1440 810"
        >
          {Array.from({ length: 17 }, (_, row) =>
            Array.from({ length: 31 }, (_, col) => (
              <circle
                key={`dot-${row}-${col}`}
                cx={col * 48}
                cy={row * 48}
                r={1.5}
                fill="#E8DCC8"
              />
            ))
          )}
        </svg>

        {/* ── Main interactive SVG canvas ── */}
        <svg
          ref={svgRef}
          viewBox="0 0 1440 810"
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        >
          {/*
            HIDDEN MASTER PATH
            This is the canonical bezier curve used for all getPointAtLength()
            calculations. It is stroke transparent so it never renders visually.
            The trail and ahead paths below duplicate this exact 'd' attribute.
          */}
          <path
            ref={pathRef}
            id="travoura-flight-path"
            d="M 140,680 C 320,590 520,470 640,340 C 760,210 960,145 1300,95"
            fill="none"
            stroke="transparent"
            strokeWidth={0}
          />

          {/* ── AHEAD PATH: full route shown as dashed sand-color line ── */}
          <path
            ref={aheadPathRef}
            d="M 140,680 C 320,590 520,470 640,340 C 760,210 960,145 1300,95"
            fill="none"
            stroke="#E8DCC8"
            strokeWidth={1.5}
            strokeLinecap="round"
            style={{
              strokeDasharray: '8 10',
              transition: 'stroke-dashoffset 30ms linear, opacity 200ms ease',
            }}
          />

          {/* ── TRAIL PATH: drawn portion in gold that grows with scroll ── */}
          <path
            ref={trailPathRef}
            d="M 140,680 C 320,590 520,470 640,340 C 760,210 960,145 1300,95"
            fill="none"
            stroke="#C9A84C"
            strokeWidth={2}
            strokeLinecap="round"
            style={{
              strokeDasharray: '0 9999',
              transition: 'stroke-dasharray 30ms linear',
              filter: 'drop-shadow(0 0 4px rgba(201,168,76,0.55))',
            }}
          />

          {/* ── RADAR PULSE: expands from aircraft position every 2s ── */}
          {totalLength > 0 && (
            <RadarPulse x={aircraftPos.x} y={aircraftPos.y} />
          )}

          {/* ── AIRCRAFT SILHOUETTE (top-view) ── */}
          <g
            ref={aircraftGroupRef}
            id="aircraft-group"
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.30))',
              transition: 'transform 30ms linear',
            }}
            /* Initial position: start of path, pointing up-right at ~-55deg */
            transform="translate(140,680) rotate(-55) scale(1.3)"
          >
            {/* Fuselage — elongated vertical ellipse */}
            <ellipse cx={0} cy={0} rx={3} ry={14} fill="white" />
            {/* Wings — swept back shape */}
            <path
              d="M -17,-1 L 0,-6 L 17,-1 L 13,5 L 0,1 L -13,5 Z"
              fill="white"
            />
            {/* Tail fins — smaller delta shape */}
            <path
              d="M -6,9 L 0,7 L 6,9 L 4,13 L 0,11 L -4,13 Z"
              fill="white"
            />
            {/* Cabin windows — subtle gold strip */}
            <rect
              x={-1.5}
              y={-8}
              width={3}
              height={9}
              rx={1.5}
              fill="rgba(201,168,76,0.45)"
            />
          </g>

          {/* ── WAYPOINT MARKERS: Mumbai, Dubai, London ── */}
          {waypoints.map(wp =>
            wp.x > 0 ? (
              <g key={wp.label}>
                {/* Animated pulse ring when this waypoint is active */}
                {wp.active && (
                  <circle
                    cx={wp.x}
                    cy={wp.y}
                    r={6}
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth={1}
                    style={{
                      animation: 'waypoint-pulse 2.2s infinite',
                    }}
                  />
                )}

                {/* Vertical connector line from dot to label */}
                <line
                  x1={wp.x}
                  y1={wp.y - 7}
                  x2={wp.x}
                  y2={wp.y - 30}
                  stroke={wp.active ? '#C9A84C' : '#E8DCC8'}
                  strokeWidth={1}
                  strokeDasharray={wp.active ? 'none' : '3 3'}
                  style={{ transition: 'stroke 500ms ease' }}
                />

                {/* Waypoint dot */}
                <circle
                  cx={wp.x}
                  cy={wp.y}
                  r={5}
                  fill={wp.active ? '#C9A84C' : 'white'}
                  stroke={wp.active ? '#C9A84C' : '#E8DCC8'}
                  strokeWidth={1.5}
                  style={{
                    transition: 'fill 500ms ease, stroke 500ms ease',
                  }}
                />

                {/* City label text */}
                <text
                  x={wp.x}
                  y={wp.y - 37}
                  textAnchor="middle"
                  style={{
                    fontFamily: 'DM Sans, system-ui, sans-serif',
                    fontSize: '11px',
                    fontWeight: '500',
                    letterSpacing: '0.10em',
                    fill: wp.active ? '#C9A84C' : '#9B9590',
                    transition: 'fill 500ms ease',
                    textTransform: 'uppercase',
                  }}
                >
                  {wp.label}
                </text>
              </g>
            ) : null
          )}
        </svg>

        {/* ── SECTION PROGRESS BAR (thin gold line along top edge) ── */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '2px',
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, #C9A84C, #E8C86C)',
            transition: 'width 30ms linear',
            borderRadius: '0 2px 2px 0',
            boxShadow: '0 0 8px rgba(201,168,76,0.5)',
          }}
        />

        {/* ── BOTTOM-LEFT LABEL: "EN ROUTE" ── */}
        <span
          className={`fp-label${isVisible ? ' visible' : ''}`}
          style={{
            position: 'absolute',
            bottom: '32px',
            left: 'clamp(24px, 5vw, 80px)',
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.25em',
            color: 'var(--color-text-muted, #9B9590)',
            textTransform: 'uppercase',
            userSelect: 'none',
          }}
        >
          EN ROUTE
        </span>

        {/* ── BOTTOM-RIGHT LABEL: "SCROLL TO EXPLORE →" ── */}
        <span
          className={`fp-label fp-label-right${isVisible ? ' visible' : ''}`}
          style={{
            position: 'absolute',
            bottom: '32px',
            right: 'clamp(24px, 5vw, 80px)',
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.25em',
            color: 'var(--color-text-muted, #9B9590)',
            textTransform: 'uppercase',
            userSelect: 'none',
          }}
        >
          SCROLL TO EXPLORE →
        </span>

      </section>
    </>
  );
};

export default FlightPathSection;
