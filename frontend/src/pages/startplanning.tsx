import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Plane,
  Sparkles,
  Tent,
  TrainFront,
  Users,
  Wallet,
  Hotel,
  Home,
  Leaf,
  UtensilsCrossed,
  Landmark,
  Mountain,
  Camera,
  PartyPopper,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type TripPlan = {
  destination: string;
  startDate: string;
  endDate: string;
  flexibleDates: boolean;
  travelers: { adults: number; children: number };
  budgetTier: 1 | 2 | 3;
  accommodation: "Hotel" | "Hostel" | "Resort" | "Airbnb" | "";
  transport: "Flight" | "Train" | "Public Transport" | "Rental Car" | "";
  vibes: Array<
    | "Relaxing"
    | "Adventure"
    | "Cultural"
    | "Food & Nightlife"
    | "Luxury"
    | "Instagrammable"
  >;
  specialRequests: string;
  aiPreferences: {
    hiddenGems: boolean;
    avoidCrowds: boolean;
    budgetOptimization: boolean;
  };
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function daysBetween(startISO: string, endISO: string) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
}

function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;
  const pieces = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translate3d(var(--x), -10vh, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate3d(var(--x), 110vh, 0) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {pieces.map((i) => {
        const left = (i / pieces.length) * 100;
        const size = 6 + ((i * 7) % 8);
        const delay = (i % 6) * 0.05;
        const dur = 1.2 + ((i % 5) * 0.25);
        const colors = ["#F8C8B4", "#E6A6B3", "#D6C9F8", "#C7D2FE", "#4DA3FF", "#FF6B4A"];
        const color = colors[i % colors.length];

        return (
          <span
            key={i}
            className="absolute top-0 rounded-sm"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${Math.max(6, size - 2)}px`,
              background: color,
              opacity: 0.95,
              animation: `confetti-fall ${dur}s ease-out ${delay}s both`,
              // horizontal spread
              ["--x" as any]: `${(i % 2 === 0 ? 1 : -1) * (10 + (i % 7) * 6)}vw`,
            }}
          />
        );
      })}
    </div>
  );
}

const vibeCards: Array<{
  value: TripPlan["vibes"][number];
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { value: "Relaxing", title: "Relaxing", Icon: Leaf },
  { value: "Adventure", title: "Adventure", Icon: Mountain },
  { value: "Cultural", title: "Cultural", Icon: Landmark },
  { value: "Food & Nightlife", title: "Food & Nightlife", Icon: UtensilsCrossed },
  { value: "Luxury", title: "Luxury", Icon: Sparkles },
  { value: "Instagrammable", title: "Instagrammable", Icon: Camera },
];

export default function StartPlanning() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const initialDestination = (location.state as { destination?: string } | null)?.destination?.trim() ?? "";

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const [trip, setTrip] = useState<TripPlan>({
    destination: initialDestination || "Japan",
    startDate: "",
    endDate: "",
    flexibleDates: false,
    travelers: { adults: 2, children: 0 },
    budgetTier: 2,
    accommodation: "",
    transport: "",
    vibes: [],
    specialRequests: "",
    aiPreferences: {
      hiddenGems: true,
      avoidCrowds: false,
      budgetOptimization: true,
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (initialDestination && trip.destination === "Japan") {
      setTrip((t) => ({ ...t, destination: initialDestination }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDestination, isAuthenticated]);

  const progressValue = useMemo(() => Math.round((step / 3) * 100), [step]);
  const durationDays = useMemo(() => daysBetween(trip.startDate, trip.endDate), [trip.startDate, trip.endDate]);

  const travelersTotal = trip.travelers.adults + trip.travelers.children;
  const budgetLabel = trip.budgetTier === 1 ? "Budget" : trip.budgetTier === 2 ? "Comfort" : "Luxury";

  const estimatedCost = useMemo(() => {
    const basePerPersonPerDay = trip.budgetTier === 1 ? 90 : trip.budgetTier === 2 ? 160 : 260;
    const days = durationDays || (trip.flexibleDates ? 6 : 5);
    const total = basePerPersonPerDay * Math.max(1, travelersTotal) * days;
    const low = Math.round(total * 0.85);
    const high = Math.round(total * 1.2);
    return `$${low.toLocaleString()} – $${high.toLocaleString()}`;
  }, [trip.budgetTier, durationDays, trip.flexibleDates, travelersTotal]);

  const suggestedDuration = useMemo(() => {
    if (durationDays) return `${durationDays} days`;
    if (trip.flexibleDates) return "5–7 days";
    return "5 days";
  }, [durationDays, trip.flexibleDates]);

  const requiredOk =
    trip.destination.trim().length > 0 &&
    (trip.flexibleDates || (trip.startDate.length > 0 && trip.endDate.length > 0)) &&
    trip.travelers.adults >= 1 &&
    trip.accommodation !== "" &&
    trip.transport !== "";

  const toggleVibe = (value: TripPlan["vibes"][number]) => {
    setTrip((t) => ({
      ...t,
      vibes: t.vibes.includes(value) ? t.vibes.filter((v) => v !== value) : [...t.vibes, value],
    }));
  };

  const next = () => setStep((s) => clamp((s + 1) as number, 1, 3) as 1 | 2 | 3);
  const back = () => setStep((s) => clamp((s - 1) as number, 1, 3) as 1 | 2 | 3);

  const handleGenerate = () => {
    if (!requiredOk || loading) return;
    setLoading(true);
    setConfetti(true);

    window.setTimeout(() => setConfetti(false), 1400);
    window.setTimeout(() => {
      setLoading(false);
      navigate("/itinerary-results", { state: { trip } });
    }, 3000);
  };

  const glassCard =
    "rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md shadow-soft transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-elevated";

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <ConfettiBurst active={confetti} />

      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <PartyPopper className="h-4 w-4" />
                Trip Planner
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Welcome back{user?.username ? `, ${user.username}` : ""} ✨
              </p>
              <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
                Planning your trip to{" "}
                <span className="inline-flex items-center gap-2">
                  <Input
                    aria-label="Destination"
                    value={trip.destination}
                    onChange={(e) => setTrip((t) => ({ ...t, destination: e.target.value }))}
                    className="inline-flex h-10 w-[220px] md:w-[260px] rounded-xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                    placeholder="e.g., Japan"
                  />
                  <MapPin className="h-5 w-5 text-slate-500" />
                </span>
              </h1>
            </div>

            <div className="flex gap-3">
              <Link to="/">
                <Button variant="secondary" className="gap-2 bg-white/70 hover:bg-white/80">
                  <ArrowLeft className="h-4 w-4" />
                  Back home
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-2">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Step {step} of 3</span>
              <span>{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="h-3 bg-slate-200" />
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6" key={step}>
            {/* Step navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                className="bg-white/70 hover:bg-white/80"
                onClick={back}
                disabled={step === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button
                variant="secondary"
                className="bg-white/70 hover:bg-white/80"
                onClick={next}
                disabled={step === 3 || loading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {step === 1 ? (
              <Card className={glassCard}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-slate-900 mb-4">
                    <CalendarDays className="h-5 w-5" />
                    <h2 className="text-xl font-semibold">Trip Details</h2>
                  </div>

                  <div className="grid gap-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-slate-800" htmlFor="startDate">
                          Start date{trip.flexibleDates ? " (optional)" : ""}
                        </label>
                        <Input
                          id="startDate"
                          type="date"
                          value={trip.startDate}
                          onChange={(e) => setTrip((t) => ({ ...t, startDate: e.target.value }))}
                          className="h-11 rounded-xl bg-white border-slate-200 text-slate-900"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-slate-800" htmlFor="endDate">
                          End date{trip.flexibleDates ? " (optional)" : ""}
                        </label>
                        <Input
                          id="endDate"
                          type="date"
                          value={trip.endDate}
                          onChange={(e) => setTrip((t) => ({ ...t, endDate: e.target.value }))}
                          className="h-11 rounded-xl bg-white border-slate-200 text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Flexible dates</div>
                        <div className="text-xs text-slate-600">
                          If enabled, we’ll optimize around your season instead of exact dates.
                        </div>
                      </div>
                      <Switch
                        checked={trip.flexibleDates}
                        onCheckedChange={(v) => setTrip((t) => ({ ...t, flexibleDates: !!v }))}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-slate-900">
                          <Users className="h-4 w-4" />
                          <div className="text-sm font-semibold">Travelers</div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <div className="grid gap-2">
                            <label className="text-xs text-slate-600">Adults</label>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="secondary"
                                className="h-9 w-9 p-0 bg-white hover:bg-slate-100"
                                onClick={() =>
                                  setTrip((t) => ({
                                    ...t,
                                    travelers: { ...t.travelers, adults: Math.max(1, t.travelers.adults - 1) },
                                  }))
                                }
                              >
                                −
                              </Button>
                              <div className="min-w-10 text-center text-slate-900 font-semibold">{trip.travelers.adults}</div>
                              <Button
                                type="button"
                                variant="secondary"
                                className="h-9 w-9 p-0 bg-white hover:bg-slate-100"
                                onClick={() =>
                                  setTrip((t) => ({
                                    ...t,
                                    travelers: { ...t.travelers, adults: t.travelers.adults + 1 },
                                  }))
                                }
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <label className="text-xs text-slate-600">Children</label>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="secondary"
                                className="h-9 w-9 p-0 bg-white hover:bg-slate-100"
                                onClick={() =>
                                  setTrip((t) => ({
                                    ...t,
                                    travelers: { ...t.travelers, children: Math.max(0, t.travelers.children - 1) },
                                  }))
                                }
                              >
                                −
                              </Button>
                              <div className="min-w-10 text-center text-slate-900 font-semibold">{trip.travelers.children}</div>
                              <Button
                                type="button"
                                variant="secondary"
                                className="h-9 w-9 p-0 bg-white hover:bg-slate-100"
                                onClick={() =>
                                  setTrip((t) => ({
                                    ...t,
                                    travelers: { ...t.travelers, children: t.travelers.children + 1 },
                                  }))
                                }
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-slate-900">
                          <Wallet className="h-4 w-4" />
                          <div className="text-sm font-semibold">Budget</div>
                        </div>
                        <div className="mt-3">
                          <Slider
                            value={[trip.budgetTier]}
                            min={1}
                            max={3}
                            step={1}
                            onValueChange={(v) => setTrip((t) => ({ ...t, budgetTier: (v[0] as 1 | 2 | 3) ?? 2 }))}
                          />
                          <div className="mt-3 flex items-center justify-between text-xs text-slate-700">
                            <span className={trip.budgetTier === 1 ? "font-semibold text-slate-900" : ""}>Budget</span>
                            <span className={trip.budgetTier === 2 ? "font-semibold text-slate-900" : ""}>Comfort</span>
                            <span className={trip.budgetTier === 3 ? "font-semibold text-slate-900" : ""}>Luxury</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <div className="text-sm font-semibold text-slate-900">Accommodation preference</div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: "Hotel", Icon: Hotel },
                            { label: "Hostel", Icon: Home },
                            { label: "Resort", Icon: Sparkles },
                            { label: "Airbnb", Icon: Home },
                          ].map(({ label, Icon }) => {
                            const selected = trip.accommodation === label;
                            return (
                              <button
                                key={label}
                                type="button"
                                onClick={() => setTrip((t) => ({ ...t, accommodation: label as any }))}
                                className={[
                                  "group rounded-2xl border p-4 text-left transition-all duration-300",
                                  selected
                                    ? "border-slate-300 bg-white shadow-elevated"
                                    : "border-slate-200 bg-slate-50 hover:bg-white",
                                ].join(" ")}
                              >
                                <div className="flex items-center gap-2 text-slate-900">
                                  <Icon className="h-4 w-4" />
                                  <span className="text-sm font-semibold">{label}</span>
                                </div>
                                <div className="mt-1 text-xs text-slate-600">
                                  {label === "Hotel"
                                    ? "Classic comfort"
                                    : label === "Hostel"
                                      ? "Budget + social"
                                      : label === "Resort"
                                        ? "All‑in vibes"
                                        : "Local stays"}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <label className="text-sm font-semibold text-slate-900" htmlFor="transport">
                          Transport preference
                        </label>
                        <Select
                          value={trip.transport}
                          onValueChange={(v) => setTrip((t) => ({ ...t, transport: v as any }))}
                        >
                          <SelectTrigger
                            id="transport"
                            className="h-11 rounded-xl bg-white border-slate-200 text-slate-900"
                          >
                            <SelectValue placeholder="Choose transport" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Flight">
                              <span className="inline-flex items-center gap-2">
                                <Plane className="h-4 w-4" /> Flight
                              </span>
                            </SelectItem>
                            <SelectItem value="Train">
                              <span className="inline-flex items-center gap-2">
                                <TrainFront className="h-4 w-4" /> Train
                              </span>
                            </SelectItem>
                            <SelectItem value="Public Transport">Public Transport</SelectItem>
                            <SelectItem value="Rental Car">Rental Car</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-600">
                          We’ll optimize routes and pacing based on your transport choice.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : step === 2 ? (
              <>
                <Card className={glassCard}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-slate-900 mb-4">
                      <Tent className="h-5 w-5" />
                      <h2 className="text-xl font-semibold">Trip Vibe</h2>
                    </div>

                    <p className="text-sm text-slate-700 mb-4">
                      Pick a few. We’ll blend popular highlights with thoughtful pacing.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {vibeCards.map(({ value, title, Icon }) => {
                        const selected = trip.vibes.includes(value);
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => toggleVibe(value)}
                            className={[
                              "rounded-2xl border p-4 text-left transition-all duration-300",
                              selected
                                ? "border-white/50 bg-white/30 shadow-elevated"
                                : "border-white/20 bg-white/10 hover:bg-white/20",
                            ].join(" ")}
                          >
                            <div className="flex items-center gap-2 text-white">
                              <Icon className="h-4 w-4" />
                              <div className="text-sm font-semibold">{title}</div>
                            </div>
                            <div className="mt-1 text-xs text-white/75">
                              {value === "Relaxing"
                                ? "Slow mornings, soft sunsets"
                                : value === "Adventure"
                                  ? "Hikes, water, adrenaline"
                                  : value === "Cultural"
                                    ? "Museums, history, local life"
                                    : value === "Food & Nightlife"
                                      ? "Markets, cafés, late nights"
                                      : value === "Luxury"
                                        ? "Elevated stays & moments"
                                        : "Scenic + share-worthy spots"}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className={glassCard}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-slate-900 mb-4">
                      <Sparkles className="h-5 w-5" />
                      <h2 className="text-xl font-semibold">Special Requests</h2>
                    </div>

                    <label className="text-sm font-medium text-slate-900" htmlFor="specialRequests">
                      Anything you want to include?
                    </label>
                    <Textarea
                      id="specialRequests"
                      value={trip.specialRequests}
                      maxLength={300}
                      onChange={(e) => setTrip((t) => ({ ...t, specialRequests: e.target.value }))}
                      placeholder="Ideas: sunset viewpoint, street food tour, hidden cafés, fewer tourist traps…"
                      className="mt-2 min-h-[120px] rounded-2xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-500"
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                      <span>Tip: mention any “must-dos” or things to avoid.</span>
                      <span>{trip.specialRequests.length}/300</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className={glassCard}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-slate-900 mb-4">
                      <Sparkles className="h-5 w-5" />
                      <h2 className="text-xl font-semibold">AI Preferences</h2>
                    </div>

                    <div className="grid gap-3">
                      {[
                        {
                          key: "hiddenGems" as const,
                          title: "Hidden gems",
                          desc: "Include lesser-known spots and local favorites.",
                        },
                        {
                          key: "avoidCrowds" as const,
                          title: "Avoid crowds",
                          desc: "Prefer quieter times/places where possible.",
                        },
                        {
                          key: "budgetOptimization" as const,
                          title: "Budget optimization",
                          desc: "Prioritize value without losing the vibe.",
                        },
                      ].map((row) => (
                        <div
                          key={row.key}
                            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{row.title}</div>
                            <div className="text-xs text-slate-600">{row.desc}</div>
                          </div>
                          <Switch
                            checked={trip.aiPreferences[row.key]}
                            onCheckedChange={(v) =>
                              setTrip((t) => ({
                                ...t,
                                aiPreferences: { ...t.aiPreferences, [row.key]: !!v },
                              }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className={glassCard}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-slate-900 mb-4">
                      <Sparkles className="h-5 w-5" />
                      <h2 className="text-xl font-semibold">Ready to generate?</h2>
                    </div>
                    <p className="text-sm text-slate-700">
                      We’ll take your preferences and generate a day-by-day plan. You can refine it afterwards.
                    </p>

                      {!requiredOk ? (
                        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                        Please fill the required fields: destination, {trip.flexibleDates ? "transport + accommodation" : "dates + transport + accommodation"}.
                      </div>
                    ) : null}

                    <Button
                      className="mt-5 w-full h-12 text-lg bg-gradient-hero text-primary-foreground hover:opacity-95"
                      disabled={!requiredOk || loading}
                      onClick={handleGenerate}
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Generating your dream trip…
                        </span>
                      ) : (
                        "Generate My Itinerary"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Live preview */}
          <div className="lg:col-span-1">
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-soft lg:sticky lg:top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-slate-900 font-semibold">Live Preview</div>
                  <span className="text-xs text-slate-600">{budgetLabel}</span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span className="font-semibold text-slate-900">Destination:</span> {trip.destination || "—"}
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-slate-500" />
                    <span className="font-semibold text-slate-900">Duration:</span> {suggestedDuration}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-500" />
                    <span className="font-semibold text-slate-900">Travelers:</span> {travelersTotal}
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-slate-500" />
                    <span className="font-semibold text-slate-900">Estimated cost:</span> {estimatedCost}
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
                  <div className="font-semibold text-slate-900">Selected vibes</div>
                  <div className="mt-2">
                    {trip.vibes.length ? trip.vibes.join(", ") : "Pick a vibe to personalize recommendations."}
                  </div>
                </div>

                <div className="mt-5 h-40 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600">
                  <span className="text-xs">Mini map placeholder</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
