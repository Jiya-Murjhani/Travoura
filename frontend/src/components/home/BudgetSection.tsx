import { useEffect, useRef, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: "Accommodation", icon: "🏨", color: "#C9A84C", pct: 38, amount: "₹6,900", value: 6900 },
  { name: "Transport",     icon: "✈",  color: "#8C6D2F", pct: 22, amount: "₹4,000", value: 4000 },
  { name: "Food",          icon: "🍽", color: "#E8C86C", pct: 18, amount: "₹3,280", value: 3280 },
  { name: "Activities",    icon: "🎭", color: "#6D8C4C", pct: 15, amount: "₹2,730", value: 2730 },
  { name: "Other",         icon: "🛍", color: "#4C6D8C", pct:  7, amount: "₹1,290", value: 1290 },
];

const STATS = [
  { value: "₹45,000", end: 45000, label: "Total Budget", color: "#F7F5F0" },
  { value: "₹18,200", end: 18200, label: "Spent",        color: "#C9A84C" },
  { value: "₹26,800", end: 26800, label: "Remaining",    color: "#3A7D5C" },
];

// ─── Count-up Hook ────────────────────────────────────────────────────────────

function useCountUp(end: number, duration: number, active: boolean, delay: number) {
  const [display, setDisplay] = useState("₹0");
  useEffect(() => {
    if (!active) return;
    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * end);
        setDisplay("₹" + current.toLocaleString("en-IN"));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [active, end, duration, delay]);
  return display;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: "#1A1A1C",
      border: "1px solid rgba(232,220,200,0.1)",
      borderRadius: 8,
      padding: "10px 14px",
    }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#F7F5F0", margin: 0 }}>{d.name}</p>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#C9A84C", margin: "4px 0 0" }}>{d.amount}</p>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(247,245,240,0.45)", margin: "2px 0 0" }}>{d.pct}%</p>
    </div>
  );
};

// ─── Stat Item ────────────────────────────────────────────────────────────────

function StatItem({ stat, active, index }: { stat: typeof STATS[0]; active: boolean; index: number }) {
  const display = useCountUp(stat.end, 1400, active, 300 + index * 100);
  return (
    <div style={{ flex: 1 }}>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(30px, 3.5vw, 44px)",
        fontWeight: 600,
        color: stat.color,
        margin: 0,
        lineHeight: 1,
      }}>{display}</p>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        fontWeight: 400,
        color: "rgba(247,245,240,0.45)",
        marginTop: 4,
        marginBottom: 0,
      }}>{stat.label}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BudgetSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [barsActive, setBarsActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setTimeout(() => setBarsActive(true), 400);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

        .budget-section * { box-sizing: border-box; }

        .bs-left {
          opacity: 0;
          transform: translateX(-40px);
          transition: opacity 700ms ease, transform 700ms ease;
        }
        .bs-left.active {
          opacity: 1;
          transform: translateX(0);
        }

        .bs-right {
          opacity: 0;
          transform: translateX(40px);
          transition: opacity 700ms ease 200ms, transform 700ms ease 200ms;
        }
        .bs-right.active {
          opacity: 1;
          transform: translateX(0);
        }

        .bs-eyebrow {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 500ms ease, transform 500ms ease;
        }
        .bs-eyebrow.active { opacity: 1; transform: translateY(0); }

        .bs-title {
          opacity: 0;
          clip-path: inset(0 100% 0 0);
          transition: opacity 600ms ease 150ms, clip-path 600ms ease 150ms;
        }
        .bs-title.active { opacity: 1; clip-path: inset(0 0% 0 0); }

        .bs-bar-fill {
          width: 0;
          transition: width 1000ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .budget-link {
          color: #C9A84C;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          display: inline-block;
          transition: color 200ms, transform 200ms;
        }
        .budget-link:hover {
          color: #E8C86C;
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .bs-columns {
            flex-direction: column !important;
          }
          .bs-left-col, .bs-right-col {
            width: 100% !important;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="budget-section"
        style={{
          background: "#141416",
          padding: "100px var(--section-px, 48px)",
          width: "100%",
        }}
      >
        {/* Gold divider */}
        <div style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.25) 40%, rgba(201,168,76,0.25) 60%, transparent)",
          marginBottom: 80,
          maxWidth: 1280,
          margin: "0 auto 80px",
        }} />

        {/* Content wrapper */}
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* Two columns */}
          <div className="bs-columns" style={{ display: "flex", gap: 64, alignItems: "center" }}>

            {/* ── LEFT COLUMN ── */}
            <div
              className={`bs-left bs-left-col ${visible ? "active" : ""}`}
              style={{ width: "55%" }}
            >
              {/* Eyebrow */}
              <p className={`bs-eyebrow ${visible ? "active" : ""}`} style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                fontWeight: 400,
                color: "#C9A84C",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                margin: "0 0 16px",
              }}>
                Active Trip Budget
              </p>

              {/* Trip name */}
              <h2 className={`bs-title ${visible ? "active" : ""}`} style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(28px, 3.5vw, 42px)",
                fontWeight: 500,
                color: "#F7F5F0",
                margin: "0 0 6px",
                lineHeight: 1.15,
              }}>
                Goa Escape · Dec 2025
              </h2>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 300,
                color: "rgba(247,245,240,0.45)",
                margin: "0 0 40px",
              }}>
                7 days · 3 travelers
              </p>

              {/* Big numbers row */}
              <div style={{ display: "flex", gap: 0 }}>
                {STATS.map((stat, i) => (
                  <div key={stat.label} style={{ display: "flex", flex: 1 }}>
                    <StatItem stat={stat} active={visible} index={i} />
                    {i < STATS.length - 1 && (
                      <div style={{
                        width: 1,
                        background: "rgba(255,255,255,0.08)",
                        margin: "4px 24px 0",
                        alignSelf: "stretch",
                      }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Progress bars */}
              <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 16 }}>
                {CATEGORIES.map((cat, i) => (
                  <div key={cat.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Icon + name */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, width: 140, flexShrink: 0 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: cat.color, flexShrink: 0 }} />
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        color: "rgba(247,245,240,0.7)",
                      }}>{cat.name}</span>
                    </div>
                    {/* Bar */}
                    <div style={{
                      flex: 1,
                      height: 4,
                      borderRadius: 2,
                      background: "rgba(255,255,255,0.06)",
                      overflow: "hidden",
                    }}>
                      <div
                        className="bs-bar-fill"
                        style={{
                          height: "100%",
                          borderRadius: 2,
                          background: cat.color,
                          ...(barsActive
                            ? {
                                width: `${cat.pct}%`,
                                transitionDelay: `${i * 150}ms`,
                              }
                            : { width: 0 }),
                        }}
                      />
                    </div>
                    {/* Amount */}
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      color: "rgba(247,245,240,0.5)",
                      width: 64,
                      textAlign: "right",
                      flexShrink: 0,
                    }}>{cat.amount}</span>
                  </div>
                ))}
              </div>

              {/* View full budget link */}
              <div style={{ marginTop: 32 }}>
                <Link to="/app/budget" className="budget-link">
                  View full budget →
                </Link>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div
              className={`bs-right bs-right-col ${visible ? "active" : ""}`}
              style={{ width: "45%" }}
            >
              {/* Chart wrapper with glow */}
              <div style={{
                filter: "drop-shadow(0 0 30px rgba(201,168,76,0.08))",
                position: "relative",
              }}>
                {/* Recharts donut */}
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={CATEGORIES}
                      cx="50%"
                      cy="50%"
                      innerRadius={90}
                      outerRadius={130}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={3}
                      dataKey="value"
                      isAnimationActive={true}
                      animationBegin={200}
                      animationDuration={1200}
                      animationEasing="ease-out"
                      strokeWidth={0}
                    >
                      {CATEGORIES.map((cat) => (
                        <Cell key={cat.name} fill={cat.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center text — absolutely positioned */}
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  pointerEvents: "none",
                }}>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 48,
                    fontWeight: 600,
                    color: "#F7F5F0",
                    margin: 0,
                    lineHeight: 1,
                  }}>40%</p>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: "rgba(247,245,240,0.45)",
                    margin: "4px 0 0",
                  }}>spent</p>
                </div>
              </div>

              {/* Legend */}
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "10px 20px",
                marginTop: 20,
              }}>
                {CATEGORIES.map((cat) => (
                  <div key={cat.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      color: "rgba(247,245,240,0.55)",
                    }}>{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
