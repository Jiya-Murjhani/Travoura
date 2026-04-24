import { useEffect, useState } from "react";

interface Alert {
  id: number;
  type: "weather" | "safety" | "clear";
  destination: string | null;
  message: string;
  icon: string;
}

const INITIAL_ALERTS: Alert[] = [
  { id: 1, type: "weather", destination: "Goa", message: "Heavy rainfall expected Dec 26–28", icon: "🌧" },
  { id: 2, type: "clear",   destination: null,  message: "All clear for your upcoming trips",  icon: "✓"  },
];

const BORDER_COLOR: Record<string, string> = {
  weather: "#C97B2C",
  safety:  "#B33A3A",
};

function AlertCard({ alert, onDismiss }: { alert: Alert; onDismiss: (id: number) => void }) {
  const [exiting, setExiting] = useState(false);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(alert.id), 300);
  };

  return (
    <div style={{
      width: 260,
      borderRadius: 12,
      background: "rgba(20,20,22,0.92)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(232,220,200,0.1)",
      padding: "14px 16px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      borderLeft: `3px solid ${BORDER_COLOR[alert.type] ?? "transparent"}`,
      transform: exiting ? "translateX(120px)" : "translateX(0)",
      opacity: exiting ? 0 : 1,
      transition: "transform 300ms ease, opacity 300ms ease",
    }}>
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16 }}>{alert.icon}</span>
          {alert.destination && (
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(247,245,240,0.9)",
            }}>
              {alert.destination}
            </span>
          )}
        </div>
        <button
          onClick={handleDismiss}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            color: "rgba(247,245,240,0.3)",
            padding: "2px 4px",
            lineHeight: 1,
            transition: "color 200ms",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(247,245,240,0.3)")}
        >
          ×
        </button>
      </div>
      {/* Message */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        fontWeight: 300,
        color: "rgba(247,245,240,0.55)",
        margin: "4px 0 0",
        lineHeight: 1.4,
      }}>
        {alert.message}
      </p>
    </div>
  );
}

function AllClearPill() {
  return (
    <div style={{
      height: 36,
      borderRadius: 18,
      background: "rgba(58,125,92,0.12)",
      border: "1px solid rgba(58,125,92,0.3)",
      padding: "0 16px",
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}>
      <div style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: "rgba(58,125,92,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        color: "#3A7D5C",
        fontWeight: 700,
      }}>✓</div>
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        fontWeight: 500,
        color: "#3A7D5C",
      }}>
        All clear for your upcoming trips
      </span>
    </div>
  );
}

export default function AlertBadgeStack() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [mounted, setMounted] = useState(false);
  const [entranceIndex, setEntranceIndex] = useState(-1);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setAlerts(INITIAL_ALERTS);
      setMounted(true);
      // stagger entrance
      INITIAL_ALERTS.forEach((_, i) => {
        setTimeout(() => setEntranceIndex(i), i * 400);
      });
    }, 2000);
    return () => clearTimeout(showTimer);
  }, []);

  const dismiss = (id: number) => setAlerts(prev => prev.filter(a => a.id !== id));

  if (!mounted) return null;

  const activeAlerts = alerts.filter(a => a.type !== "clear").slice(0, 2);
  const hasClearOnly = alerts.length > 0 && activeAlerts.length === 0;

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      right: 24,
      zIndex: 50,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 10,
    }}>
      {hasClearOnly ? (
        <div style={{
          opacity: entranceIndex >= 0 ? 1 : 0,
          transform: entranceIndex >= 0 ? "translateY(0)" : "translateY(80px)",
          transition: "opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1)",
        }}>
          <AllClearPill />
        </div>
      ) : (
        activeAlerts.map((alert, i) => (
          <div
            key={alert.id}
            style={{
              opacity: entranceIndex >= i ? 1 : 0,
              transform: entranceIndex >= i ? "translateY(0)" : "translateY(80px)",
              transition: "opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <AlertCard alert={alert} onDismiss={dismiss} />
          </div>
        ))
      )}
    </div>
  );
}
