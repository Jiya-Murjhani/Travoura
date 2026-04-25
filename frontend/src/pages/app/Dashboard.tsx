import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useBudget } from "@/contexts/BudgetContext";
import { ChevronRight } from "lucide-react";

// Types
type Trip = {
  id: string;
  destination: string;
  dates: string;
  startDate?: string;
  status?: string;
};

// Helpers
function getDaysUntil(dateStr: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  if (diff < 0) return null;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Mocks
const mockUpdates = [
  { id: "1", text: "Flight JFK → LHR on time. Gate B12.", time: "2m ago", type: "flight", color: "#3A6AC8", bg: "var(--sky-pale)" },
  { id: "2", text: "Weather in Bali: Sunny, 28°C.", time: "1h ago", type: "weather", color: "#C8973A", bg: "var(--gold-pale)" },
  { id: "3", text: "Your hotel check-in is from 3:00 PM.", time: "3h ago", type: "hotel", color: "#2C7A6F", bg: "var(--teal-pale)" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Traveler");
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
  const [pastTrips, setPastTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPreferences, setShowPreferences] = useState(true);

  // Budget Context
  const { budgetData } = useBudget();
  const budgetPercent = budgetData.total > 0 ? Math.min(100, (budgetData.spent / budgetData.total) * 100) : 0;

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      const name = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? "Traveler";
      setUserName(name);

      const { data: trips, error } = await supabase.from("trips").select("*").order("start_date", { ascending: true });

      if (error) {
        console.error("Failed to fetch trips:", error);
        setLoading(false);
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      setUpcomingTrips(
        (trips ?? []).filter((t) => !t.start_date || t.start_date >= today || t.status === "planning").map((t) => ({
          id: t.id,
          destination: t.destination,
          dates: t.start_date ?? "Date TBD",
          startDate: t.start_date,
          status: t.status,
        }))
      );

      setPastTrips(
        (trips ?? []).filter((t) => t.start_date && t.start_date < today && t.status !== "planning").map((t) => ({
          id: t.id,
          destination: t.destination,
          dates: t.start_date,
          status: t.status,
        }))
      );

      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  const nextTrip = upcomingTrips[0];
  const daysUntil = nextTrip?.startDate ? getDaysUntil(nextTrip.startDate) : null;
  const itinerariesCount = upcomingTrips.length; // Mock logic for itineraries

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--sand)]">
        <p className="text-[var(--ink-muted)] text-sm font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--sand)] min-h-screen p-[28px] overflow-x-hidden">
      <div className="mx-auto max-w-[1200px] flex flex-col gap-[20px]">
        
        {/* 1. Preferences Banner */}
        {showPreferences && (
          <div style={{
            background: "linear-gradient(135deg, var(--teal-pale), var(--sky-pale))",
            border: "1px solid rgba(44,122,111,0.2)",
            borderRadius: "14px",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }} className="flex-col md:flex-row text-center md:text-left">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#fff", flexShrink: 0 }}>✦</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Set your preferences for smarter recommendations</p>
              <p style={{ fontSize: 11, color: "var(--ink-muted)", marginTop: 2 }}>Get personalised itineraries, budget tips, and travel alerts tailored to you.</p>
            </div>
            <div className="flex gap-4 items-center">
              <button style={{ padding: "7px 14px", background: "var(--teal)", color: "#fff", borderRadius: 8, fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "var(--teal-light)"} onMouseOut={e => e.currentTarget.style.background = "var(--teal)"}>Start Setup</button>
              <button onClick={() => setShowPreferences(false)} style={{ background: "none", border: "none", fontSize: 16, color: "var(--ink-muted)", cursor: "pointer", padding: "0 8px" }}>✕</button>
            </div>
          </div>
        )}

        {/* 2. Hero Welcome Banner */}
        <div style={{
          background: "#1A1814",
          borderRadius: "20px",
          padding: "28px 32px",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          position: "relative",
          overflow: "hidden"
        }} className="flex-col md:flex-row">
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "radial-gradient(circle at 80% 50%, rgba(200,151,58,0.18) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(44,122,111,0.15) 0%, transparent 50%)"
          }} />
          
          <div style={{ flex: 1, position: "relative", zIndex: 1, width: "100%" }}>
            <p style={{ fontSize: 10, letterSpacing: "3px", textTransform: "uppercase", color: "#C8973A", fontWeight: 500, marginBottom: 6 }}>Good evening</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 8 }}>
              Welcome back, {userName}!
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>Plan and manage your next adventure from one place.</p>

            {nextTrip && daysUntil !== null && (
              <div style={{
                marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(200,151,58,0.15)", border: "1px solid rgba(200,151,58,0.35)",
                borderRadius: 24, padding: "8px 16px"
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8973A", animation: "pulse 1.8s ease-in-out infinite", display: "block" }} />
                <span style={{ fontSize: 12, color: "#F5D98B", fontWeight: 500 }}>
                  {daysUntil === 0 ? "Departing today for " : `${daysUntil} day${daysUntil !== 1 ? "s" : ""} until `}
                  {nextTrip.destination}
                </span>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative", zIndex: 1, flexShrink: 0, width: "100%", maxWidth: "100%" }} className="md:w-auto">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/app/flights"><button className="cta-primary w-full md:w-auto">✈ Search Flights</button></Link>
              <Link to="/app/hotels"><button className="cta-ghost w-full md:w-auto">🏨 Find Hotels</button></Link>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/app/itineraries"><button className="cta-ghost w-full md:w-auto">📋 Itineraries</button></Link>
              <Link to="/app/budget"><button className="cta-ghost w-full md:w-auto">💰 Budget Tracker</button></Link>
            </div>
          </div>
        </div>

        {/* 3. Stats Row */}
        <div className="flex overflow-x-auto pb-2 -mx-[28px] px-[28px] md:mx-0 md:px-0 md:grid md:grid-cols-3 gap-[20px] hide-scrollbar">
          <div className="flex-shrink-0 w-[260px] md:w-auto" style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(26,24,20,0.07)", padding: "18px 20px" }}>
            <div className="flex justify-between items-start mb-2">
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--gold-pale)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🗺️</div>
              <div style={{ padding: "4px 8px", borderRadius: 20, background: "var(--gold-pale)", color: "var(--gold)", fontSize: 10, fontWeight: 600 }}>+1 new</div>
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "var(--ink)", lineHeight: 1.2 }}>{upcomingTrips.length}</div>
            <div style={{ fontSize: 13, color: "var(--ink-muted)", fontWeight: 500, marginTop: 2 }}>Upcoming trips</div>
          </div>

          <div className="flex-shrink-0 w-[260px] md:w-auto" style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(26,24,20,0.07)", padding: "18px 20px" }}>
            <div className="flex justify-between items-start mb-2">
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--teal-pale)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📋</div>
              <div style={{ padding: "4px 8px", borderRadius: 20, background: "var(--teal-pale)", color: "var(--teal)", fontSize: 10, fontWeight: 600 }}>Active</div>
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "var(--ink)", lineHeight: 1.2 }}>{itinerariesCount}</div>
            <div style={{ fontSize: 13, color: "var(--ink-muted)", fontWeight: 500, marginTop: 2 }}>Itineraries created</div>
          </div>

          <div className="flex-shrink-0 w-[260px] md:w-auto" style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(26,24,20,0.07)", padding: "18px 20px" }}>
            <div className="flex mb-2">
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--rose-pale)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💸</div>
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--ink)", lineHeight: 1.2, marginTop: 6 }}>
              ₹{budgetData.spent.toLocaleString()} <span style={{ fontSize: 14, color: "var(--ink-muted)", fontWeight: 400 }}>/ ₹{budgetData.total.toLocaleString()}</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-muted)", fontWeight: 500, marginTop: 4 }}>Budget used</div>
          </div>
        </div>

        {/* 4. Trips & Itineraries (2 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
          {/* My Trips */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(26,24,20,0.07)", padding: "20px 24px" }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 16 }}>My Trips</h2>
            
            {/* Upcoming Section */}
            <div className="mb-6">
              <p style={{ fontSize: 9, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--ink-muted)", fontWeight: 600, marginBottom: 12 }}>Upcoming</p>
              <div className="flex flex-col gap-3">
                {upcomingTrips.length === 0 ? (
                  <p style={{ fontSize: 13, color: "var(--ink-muted)" }}>No upcoming trips.</p>
                ) : (
                  upcomingTrips.slice(0, 3).map((trip) => (
                    <Link key={trip.id} to={`/trip/${trip.id}`} style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderRadius: 12, background: "var(--gold-pale)", border: "1px solid rgba(200,151,58,0.2)", textDecoration: "none" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #F5D98B, #C8973A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginRight: 12, flexShrink: 0 }}>🌍</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{trip.destination}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-muted)", marginTop: 2 }}>{trip.dates}</div>
                      </div>
                      <ChevronRight size={16} color="var(--ink-muted)" />
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Past Section */}
            <div>
              <p style={{ fontSize: 9, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--ink-muted)", fontWeight: 600, marginBottom: 12 }}>Past</p>
              {pastTrips.length === 0 ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px", background: "rgba(26,24,20,0.02)", borderRadius: 12, border: "1px dashed rgba(26,24,20,0.1)" }}>
                  <span style={{ fontSize: 18 }}>🕰️</span>
                  <span style={{ fontSize: 12, color: "var(--ink-muted)" }}>No past trips yet</span>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {pastTrips.slice(0, 2).map((trip) => (
                    <div key={trip.id} style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderRadius: 12, background: "rgba(26,24,20,0.02)", border: "1px solid rgba(26,24,20,0.06)" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-light)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{trip.destination}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-muted)", marginTop: 2 }}>{trip.dates}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* My Itineraries */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(26,24,20,0.07)", padding: "20px 24px", display: "flex", flexDirection: "column" }}>
            <div className="flex justify-between items-center mb-6">
              <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>My Itineraries</h2>
            </div>
            
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--teal-pale)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>🗺️</div>
              <p style={{ fontSize: 13, color: "var(--ink-muted)", marginBottom: 16 }}>No itineraries yet.</p>
              <Link to="/itineraries/new">
                <button style={{ background: "var(--teal)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                  Create itinerary
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* 5. Budget & Updates (2 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
          {/* Budget Overview Card */}
          <div style={{ background: "#1A1814", borderRadius: 16, padding: "24px 28px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 100% 0%, rgba(200,151,58,0.2) 0%, transparent 60%)", pointerEvents: "none" }} />
            
            <p style={{ fontSize: 9, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", fontWeight: 600, marginBottom: 12, position: "relative", zIndex: 1 }}>Budget Overview</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 24, position: "relative", zIndex: 1 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: "#fff" }}>₹{budgetData.spent.toLocaleString()}</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>of ₹{budgetData.total.toLocaleString()} used</span>
            </div>

            <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.12)", borderRadius: 4, marginBottom: 24, overflow: "hidden", position: "relative", zIndex: 1 }}>
              <div style={{ width: `${budgetPercent}%`, height: "100%", background: "linear-gradient(90deg, #C8973A, #F5D98B)", borderRadius: 4 }} />
            </div>

            <Link to="/app/budget" style={{ position: "relative", zIndex: 1, display: "block" }}>
              <button style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"} onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}>
                Open Budget Tracker
              </button>
            </Link>
          </div>

          {/* Real-Time Updates Card */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(26,24,20,0.07)", padding: "20px 24px" }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 16 }}>Real-Time Updates</h2>
            
            <div className="flex flex-col">
              {mockUpdates.map((update, index) => (
                <div key={update.id} style={{ display: "flex", alignItems: "center", padding: "14px 0", borderBottom: index < mockUpdates.length - 1 ? "1px solid rgba(26,24,20,0.06)" : "none" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: update.bg, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 14, flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: update.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-light)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{update.text}</div>
                    <div style={{ fontSize: 10, color: "var(--ink-muted)", marginTop: 2 }}>{update.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
      
      {/* Required style to hide scrollbar on mobile horizontal scrolling stats row */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}