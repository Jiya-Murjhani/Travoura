import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Plus, Minus, Loader2, Info, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════ */

const COUNTRIES = [
  "🇦🇫 Afghanistan", "🇦🇱 Albania", "🇩🇿 Algeria", "🇦🇩 Andorra", "🇦🇴 Angola",
  "🇦🇬 Antigua and Barbuda", "🇦🇷 Argentina", "🇦🇲 Armenia", "🇦🇺 Australia",
  "🇦🇹 Austria", "🇦🇿 Azerbaijan", "🇧🇸 Bahamas", "🇧🇭 Bahrain", "🇧🇩 Bangladesh",
  "🇧🇧 Barbados", "🇧🇾 Belarus", "🇧🇪 Belgium", "🇧🇿 Belize", "🇧🇯 Benin",
  "🇧🇹 Bhutan", "🇧🇴 Bolivia", "🇧🇦 Bosnia and Herzegovina", "🇧🇼 Botswana",
  "🇧🇷 Brazil", "🇧🇳 Brunei", "🇧🇬 Bulgaria", "🇧🇫 Burkina Faso", "🇧🇮 Burundi",
  "🇨🇻 Cabo Verde", "🇰🇭 Cambodia", "🇨🇲 Cameroon", "🇨🇦 Canada",
  "🇨🇫 Central African Republic", "🇹🇩 Chad", "🇨🇱 Chile", "🇨🇳 China",
  "🇨🇴 Colombia", "🇰🇲 Comoros", "🇨🇬 Congo", "🇨🇩 DR Congo", "🇨🇷 Costa Rica",
  "🇨🇮 Côte d'Ivoire", "🇭🇷 Croatia", "🇨🇺 Cuba", "🇨🇾 Cyprus", "🇨🇿 Czech Republic",
  "🇩🇰 Denmark", "🇩🇯 Djibouti", "🇩🇲 Dominica", "🇩🇴 Dominican Republic",
  "🇪🇨 Ecuador", "🇪🇬 Egypt", "🇸🇻 El Salvador", "🇬🇶 Equatorial Guinea",
  "🇪🇷 Eritrea", "🇪🇪 Estonia", "🇸🇿 Eswatini", "🇪🇹 Ethiopia",
  "🇫🇯 Fiji", "🇫🇮 Finland", "🇫🇷 France",
  "🇬🇦 Gabon", "🇬🇲 Gambia", "🇬🇪 Georgia", "🇩🇪 Germany", "🇬🇭 Ghana",
  "🇬🇷 Greece", "🇬🇩 Grenada", "🇬🇹 Guatemala", "🇬🇳 Guinea", "🇬🇼 Guinea-Bissau",
  "🇬🇾 Guyana", "🇭🇹 Haiti", "🇭🇳 Honduras", "🇭🇺 Hungary",
  "🇮🇸 Iceland", "🇮🇳 India", "🇮🇩 Indonesia", "🇮🇷 Iran", "🇮🇶 Iraq",
  "🇮🇪 Ireland", "🇮🇱 Israel", "🇮🇹 Italy",
  "🇯🇲 Jamaica", "🇯🇵 Japan", "🇯🇴 Jordan",
  "🇰🇿 Kazakhstan", "🇰🇪 Kenya", "🇰🇮 Kiribati", "🇰🇼 Kuwait", "🇰🇬 Kyrgyzstan",
  "🇱🇦 Laos", "🇱🇻 Latvia", "🇱🇧 Lebanon", "🇱🇸 Lesotho", "🇱🇷 Liberia",
  "🇱🇾 Libya", "🇱🇮 Liechtenstein", "🇱🇹 Lithuania", "🇱🇺 Luxembourg",
  "🇲🇬 Madagascar", "🇲🇼 Malawi", "🇲🇾 Malaysia", "🇲🇻 Maldives", "🇲🇱 Mali",
  "🇲🇹 Malta", "🇲🇭 Marshall Islands", "🇲🇷 Mauritania", "🇲🇺 Mauritius",
  "🇲🇽 Mexico", "🇫🇲 Micronesia", "🇲🇩 Moldova", "🇲🇨 Monaco", "🇲🇳 Mongolia",
  "🇲🇪 Montenegro", "🇲🇦 Morocco", "🇲🇿 Mozambique", "🇲🇲 Myanmar",
  "🇳🇦 Namibia", "🇳🇷 Nauru", "🇳🇵 Nepal", "🇳🇱 Netherlands", "🇳🇿 New Zealand",
  "🇳🇮 Nicaragua", "🇳🇪 Niger", "🇳🇬 Nigeria", "🇰🇵 North Korea",
  "🇲🇰 North Macedonia", "🇳🇴 Norway",
  "🇴🇲 Oman", "🇵🇰 Pakistan", "🇵🇼 Palau", "🇵🇸 Palestine", "🇵🇦 Panama",
  "🇵🇬 Papua New Guinea", "🇵🇾 Paraguay", "🇵🇪 Peru", "🇵🇭 Philippines",
  "🇵🇱 Poland", "🇵🇹 Portugal", "🇶🇦 Qatar",
  "🇷🇴 Romania", "🇷🇺 Russia", "🇷🇼 Rwanda",
  "🇰🇳 Saint Kitts and Nevis", "🇱🇨 Saint Lucia",
  "🇻🇨 Saint Vincent and the Grenadines", "🇼🇸 Samoa", "🇸🇲 San Marino",
  "🇸🇹 São Tomé and Príncipe", "🇸🇦 Saudi Arabia", "🇸🇳 Senegal", "🇷🇸 Serbia",
  "🇸🇨 Seychelles", "🇸🇱 Sierra Leone", "🇸🇬 Singapore", "🇸🇰 Slovakia",
  "🇸🇮 Slovenia", "🇸🇧 Solomon Islands", "🇸🇴 Somalia", "🇿🇦 South Africa",
  "🇰🇷 South Korea", "🇸🇸 South Sudan", "🇪🇸 Spain", "🇱🇰 Sri Lanka",
  "🇸🇩 Sudan", "🇸🇷 Suriname", "🇸🇪 Sweden", "🇨🇭 Switzerland", "🇸🇾 Syria",
  "🇹🇼 Taiwan", "🇹🇯 Tajikistan", "🇹🇿 Tanzania", "🇹🇭 Thailand",
  "🇹🇱 Timor-Leste", "🇹🇬 Togo", "🇹🇴 Tonga", "🇹🇹 Trinidad and Tobago",
  "🇹🇳 Tunisia", "🇹🇷 Turkey", "🇹🇲 Turkmenistan", "🇹🇻 Tuvalu",
  "🇺🇬 Uganda", "🇺🇦 Ukraine", "🇦🇪 United Arab Emirates", "🇬🇧 United Kingdom",
  "🇺🇸 United States", "🇺🇾 Uruguay", "🇺🇿 Uzbekistan",
  "🇻🇺 Vanuatu", "🇻🇦 Vatican City", "🇻🇪 Venezuela", "🇻🇳 Vietnam",
  "🇾🇪 Yemen", "🇿🇲 Zambia", "🇿🇼 Zimbabwe",
];

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "AUD", symbol: "$", name: "Australian Dollar" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "SGD", symbol: "$", name: "Singapore Dollar" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "HKD", symbol: "$", name: "Hong Kong Dollar" },
  { code: "NZD", symbol: "$", name: "New Zealand Dollar" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
];

const GROUP_TYPE_OPTIONS = [
  { value: "solo", label: "Solo", emoji: "🧍" },
  { value: "couple", label: "Couple", emoji: "💑" },
  { value: "family", label: "Family", emoji: "👨‍👩‍👧" },
  { value: "friends", label: "Friends", emoji: "🧑‍🤝‍🧑" },
  { value: "work", label: "Work group", emoji: "💼" },
];

const BUDGET_TIER_OPTIONS = [
  { value: "budget", label: "Budget", emoji: "🎒" },
  { value: "mid-range", label: "Mid-range", emoji: "✈️" },
  { value: "luxury", label: "Luxury", emoji: "🌟" },
  { value: "ultra-luxury", label: "Ultra-luxury", emoji: "💎" },
];

const TRIP_TYPE_OPTIONS = [
  { value: "adventure", label: "Adventure", emoji: "🏔️" },
  { value: "cultural", label: "Cultural", emoji: "🏛️" },
  { value: "nature", label: "Nature", emoji: "🌿" },
  { value: "food-drink", label: "Food & Drink", emoji: "🍜" },
  { value: "relaxation", label: "Relaxation", emoji: "🏖️" },
  { value: "nightlife", label: "Nightlife", emoji: "🎉" },
  { value: "romantic", label: "Romantic", emoji: "💕" },
  { value: "family-fun", label: "Family fun", emoji: "🎠" },
  { value: "business", label: "Business", emoji: "💼" },
  { value: "spiritual", label: "Spiritual", emoji: "🕌" },
  { value: "shopping", label: "Shopping", emoji: "🛍️" },
  { value: "road-trip", label: "Road trip", emoji: "🚗" },
  { value: "volunteer", label: "Volunteer", emoji: "🤝" },
  { value: "festival", label: "Festival", emoji: "🎭" },
];

const INTEREST_OPTIONS = [
  "Hiking", "Museums", "Street food", "Photography", "Beaches",
  "Architecture", "Wildlife", "Yoga & wellness", "Scuba diving",
  "Skiing", "Cycling", "Cooking classes", "Local markets",
  "Nightlife", "Temples & ruins", "Desert safaris", "Cruises",
  "Backpacking", "Theme parks", "Stargazing",
];

const PACE_LABELS = ["Very relaxed", "Leisurely", "Balanced", "Active", "Packed"];

const ACCOMMODATION_OPTIONS = [
  { value: "hotel", label: "Hotel", emoji: "🏨" },
  { value: "hostel", label: "Hostel", emoji: "🛏️" },
  { value: "airbnb", label: "Airbnb", emoji: "🏠" },
  { value: "resort", label: "Resort", emoji: "🏝️" },
  { value: "camping", label: "Camping", emoji: "⛺" },
  { value: "boutique", label: "Boutique hotel", emoji: "🏡" },
  { value: "ryokan", label: "Ryokan", emoji: "🎎" },
];

const TRANSPORT_OPTIONS = [
  { value: "flight", label: "Flight", emoji: "✈️" },
  { value: "train", label: "Train", emoji: "🚆" },
  { value: "bus", label: "Bus", emoji: "🚌" },
  { value: "car", label: "Car rental", emoji: "🚗" },
  { value: "ferry", label: "Ferry", emoji: "⛴️" },
  { value: "motorbike", label: "Motorbike", emoji: "🛵" },
  { value: "bicycle", label: "Bicycle", emoji: "🚲" },
];

const DIETARY_OPTIONS = [
  "None", "Vegetarian", "Vegan", "Halal", "Kosher",
  "Gluten-free", "Dairy-free", "Nut allergy", "Pescatarian",
];

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

interface TripFormData {
  title: string;
  country: string;
  destination: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  num_travelers: number;
  group_type: string;
  total_budget: number | "";
  currency: string;
  budget_tier: string;
  trip_type: string[];
  interests: string[];
  pace: number;
  accommodation_type: string[];
  transport_pref: string[];
  dietary_needs: string[];
  accessibility_notes: string;
  notes: string;
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */

const CreateTrip = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  /* ── state ────────────────────────────────────────────────── */
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TripFormData>({
    title: "",
    country: "",
    destination: "",
    start_date: "",
    end_date: "",
    duration_days: 0,
    num_travelers: 1,
    group_type: "",
    total_budget: "",
    currency: "USD",
    budget_tier: "",
    trip_type: [],
    interests: [],
    pace: 3,
    accommodation_type: [],
    transport_pref: [],
    dietary_needs: [],
    accessibility_notes: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [customInterest, setCustomInterest] = useState("");

  const today = new Date().toISOString().split("T")[0];

  /* ── auto-compute duration ────────────────────────────────── */
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const diffDays = Math.round((end.getTime() - start.getTime()) / 86400000);
      setFormData((prev) => ({ ...prev, duration_days: diffDays > 0 ? diffDays + 1 : 0 }));
    } else {
      setFormData((prev) => ({ ...prev, duration_days: 0 }));
    }
  }, [formData.start_date, formData.end_date]);

  const minEndDate = formData.start_date
    ? new Date(new Date(formData.start_date).getTime() + 86400000).toISOString().split("T")[0]
    : "";

  /* ── helpers ──────────────────────────────────────────────── */
  const updateField = <K extends keyof TripFormData>(key: K, value: TripFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  type ArrayKey = "trip_type" | "interests" | "accommodation_type" | "transport_pref" | "dietary_needs";
  const toggleArrayItem = (key: ArrayKey, item: string) => {
    setFormData((prev) => {
      const arr = prev[key] as string[];
      return { ...prev, [key]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item] };
    });
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const inputCls = (hasError?: boolean) =>
    `rounded-xl border ${hasError ? "border-red-400" : "border-gray-200"} px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm transition-colors bg-white`;

  const pillCls = (selected: boolean) =>
    `px-4 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-all duration-150 select-none inline-flex items-center gap-1.5 ${
      selected
        ? "bg-indigo-100 text-indigo-700 border-indigo-300 shadow-sm"
        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
    }`;

  const currencySymbol = CURRENCIES.find((c) => c.code === formData.currency)?.symbol || formData.currency;

  /* ── validation ───────────────────────────────────────────── */
  const validateStep1 = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.country.trim()) e.country = "Please select a country";
    if (!formData.destination.trim()) e.destination = "City / Region is required";
    if (!formData.start_date) e.start_date = "Departure date is required";
    if (!formData.end_date) e.end_date = "Return date is required";
    else if (formData.start_date && formData.end_date <= formData.start_date)
      e.end_date = "Return date must be after departure date";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: Record<string, string> = {};
    if (formData.num_travelers < 1) e.num_travelers = "At least 1 traveler required";
    if (!formData.group_type) e.group_type = "Please select a group type";
    if (formData.total_budget === "" || Number(formData.total_budget) <= 0)
      e.total_budget = "Please enter a valid budget amount";
    if (!formData.currency.trim()) e.currency = "Please select a currency";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = (): boolean => {
    const e: Record<string, string> = {};
    if (formData.trip_type.length === 0) e.trip_type = "Select at least one trip type";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── navigation ───────────────────────────────────────────── */
  const handleNext = () => {
    let valid = false;
    if (step === 1) valid = validateStep1();
    else if (step === 2) valid = validateStep2();
    else if (step === 3) valid = validateStep3();
    else valid = true;
    if (valid && step < 4) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (step > 1) { setErrors({}); setStep(step - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  /* ── submit ───────────────────────────────────────────────── */
  const handleSubmit = async (overrideData?: Partial<TripFormData>) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      const token = session?.access_token;
      if (!token) { setApiError("You need to be logged in to create a trip."); setIsSubmitting(false); return; }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const payload = { ...formData, ...overrideData };

      const response = await fetch(`${apiUrl}/api/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        navigate(`/trip/${data.trip.id || data.trip.trip_id}`);
      } else {
        setApiError(data.message || "Something went wrong. Please try again.");
        setIsSubmitting(false);
      }
    } catch (_err) {
      setApiError("Network error. Check your connection.");
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    handleSubmit({ accommodation_type: [], transport_pref: [], dietary_needs: [], accessibility_notes: "", notes: "" });
  };

  /* ═══════════════════════════════════════════════════════════
     STEP RENDERERS
     ═══════════════════════════════════════════════════════════ */

  /* ── Step 1 — Where & When ────────────────────────────────── */
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Where &amp; When</h2>
        <p className="text-sm text-gray-500">Set your destination and travel dates.</p>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Trip title <span className="text-gray-400 font-normal">(optional)</span></label>
        <input
          type="text"
          placeholder="e.g. Summer in Japan"
          value={formData.title}
          onChange={(e) => updateField("title", e.target.value)}
          className={inputCls()}
        />
        <p className="text-xs text-gray-400 flex items-center gap-1"><Info className="w-3 h-3" />Leave blank to auto-generate from destination + date</p>
      </div>

      {/* Country */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Country <span className="text-red-400">*</span></label>
        <input
          list="country-list"
          placeholder="Search country..."
          value={formData.country}
          onChange={(e) => updateField("country", e.target.value)}
          className={inputCls(!!errors.country)}
        />
        <datalist id="country-list">
          {COUNTRIES.map((c) => <option key={c} value={c} />)}
        </datalist>
        {errors.country && <p className="text-xs text-red-500">{errors.country}</p>}
      </div>

      {/* City / Region */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">City / Region <span className="text-red-400">*</span></label>
        <input
          type="text"
          placeholder="e.g. Kyoto, Amalfi Coast, Scottish Highlands"
          value={formData.destination}
          onChange={(e) => updateField("destination", e.target.value)}
          className={inputCls(!!errors.destination)}
        />
        {errors.destination && <p className="text-xs text-red-500">{errors.destination}</p>}
      </div>

      {/* Dates */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Departure date <span className="text-red-400">*</span></label>
          <input
            type="date"
            min={today}
            value={formData.start_date}
            onChange={(e) => updateField("start_date", e.target.value)}
            className={inputCls(!!errors.start_date)}
          />
          {errors.start_date && <p className="text-xs text-red-500">{errors.start_date}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Return date <span className="text-red-400">*</span></label>
          <input
            type="date"
            min={minEndDate}
            value={formData.end_date}
            onChange={(e) => updateField("end_date", e.target.value)}
            className={inputCls(!!errors.end_date)}
          />
          {errors.end_date && <p className="text-xs text-red-500">{errors.end_date}</p>}
        </div>
      </div>

      {/* Duration pill */}
      {formData.duration_days > 0 && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
          🗓️ {formData.duration_days - 1} night{formData.duration_days - 1 !== 1 ? "s" : ""} · {formData.duration_days} day{formData.duration_days !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );

  /* ── Step 2 — Who & Budget ────────────────────────────────── */
  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Who &amp; Budget</h2>
        <p className="text-sm text-gray-500">Tell us about your group and spending plan.</p>
      </div>

      {/* Number of travelers */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Number of travelers <span className="text-red-400">*</span></label>
        <div className="flex items-center justify-center gap-6 py-2">
          <button
            type="button"
            onClick={() => updateField("num_travelers", Math.max(1, formData.num_travelers - 1))}
            disabled={formData.num_travelers <= 1}
            className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="text-4xl font-bold text-gray-900 w-16 text-center tabular-nums">{formData.num_travelers}</span>
          <button
            type="button"
            onClick={() => updateField("num_travelers", Math.min(50, formData.num_travelers + 1))}
            disabled={formData.num_travelers >= 50}
            className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {errors.num_travelers && <p className="text-xs text-red-500 text-center">{errors.num_travelers}</p>}
      </div>

      {/* Group type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Group type <span className="text-red-400">*</span></label>
        <div className="flex flex-wrap gap-2">
          {GROUP_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateField("group_type", formData.group_type === opt.value ? "" : opt.value)}
              className={pillCls(formData.group_type === opt.value)}
            >
              <span>{opt.emoji}</span> {opt.label}
            </button>
          ))}
        </div>
        {errors.group_type && <p className="text-xs text-red-500">{errors.group_type}</p>}
      </div>

      {/* Total budget */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Total budget <span className="text-red-400">*</span></label>
        <div className="flex">
          <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-sm font-medium text-gray-500 min-w-[60px] justify-center">
            {currencySymbol}
          </span>
          <input
            type="number"
            placeholder="0.00"
            min={0}
            step="0.01"
            value={formData.total_budget}
            onChange={(e) => updateField("total_budget", e.target.value === "" ? "" : Number(e.target.value))}
            className={`flex-1 rounded-r-xl rounded-l-none border ${errors.total_budget ? "border-red-400" : "border-gray-200"} px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm transition-colors bg-white`}
          />
        </div>
        {errors.total_budget && <p className="text-xs text-red-500">{errors.total_budget}</p>}
      </div>

      {/* Currency */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Currency <span className="text-red-400">*</span></label>
        <input
          list="currency-list"
          placeholder="Search currency..."
          value={formData.currency}
          onChange={(e) => {
            const raw = e.target.value;
            const match = CURRENCIES.find((c) => c.code === raw || raw.startsWith(c.code + " ·"));
            updateField("currency", match ? match.code : raw);
          }}
          className={inputCls(!!errors.currency)}
        />
        <datalist id="currency-list">
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} · {c.name} ({c.symbol})
            </option>
          ))}
        </datalist>
        {errors.currency && <p className="text-xs text-red-500">{errors.currency}</p>}
      </div>

      {/* Budget tier */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Budget tier <span className="text-gray-400 font-normal">(optional)</span></label>
        <div className="flex flex-wrap gap-2">
          {BUDGET_TIER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateField("budget_tier", formData.budget_tier === opt.value ? "" : opt.value)}
              className={pillCls(formData.budget_tier === opt.value)}
            >
              <span>{opt.emoji}</span> {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── Step 3 — Style & Vibe ────────────────────────────────── */
  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Style &amp; Vibe</h2>
        <p className="text-sm text-gray-500">What kind of trip are you looking for?</p>
      </div>

      {/* Trip type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Trip type <span className="text-red-400">*</span></label>
        <div className="flex flex-wrap gap-2">
          {TRIP_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleArrayItem("trip_type", opt.value)}
              className={pillCls(formData.trip_type.includes(opt.value))}
            >
              <span>{opt.emoji}</span> {opt.label}
            </button>
          ))}
        </div>
        {errors.trip_type && <p className="text-xs text-red-500">{errors.trip_type}</p>}
      </div>

      {/* Interests */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Interests <span className="text-gray-400 font-normal">(optional)</span></label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleArrayItem("interests", interest)}
              className={pillCls(formData.interests.includes(interest))}
            >
              {interest}
            </button>
          ))}
          {/* Custom interests */}
          {formData.interests
            .filter((i) => !INTEREST_OPTIONS.includes(i))
            .map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleArrayItem("interests", interest)}
                className="px-4 py-2 rounded-xl border border-dashed border-indigo-300 bg-indigo-50 text-indigo-600 text-sm font-medium inline-flex items-center gap-1.5 transition-all duration-150 hover:bg-indigo-100"
              >
                {interest} <X className="w-3 h-3" />
              </button>
            ))}
        </div>
        {/* Custom interest input */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            placeholder="Type a custom interest & press Enter"
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const trimmed = customInterest.trim();
                if (trimmed && !formData.interests.includes(trimmed)) {
                  updateField("interests", [...formData.interests, trimmed]);
                }
                setCustomInterest("");
              }
            }}
            className={`${inputCls()} max-w-xs`}
          />
        </div>
      </div>

      {/* Travel pace */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Travel pace</label>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={formData.pace}
          onChange={(e) => updateField("pace", Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between px-0.5">
          {PACE_LABELS.map((label, i) => (
            <span
              key={label}
              className={`text-xs text-center ${formData.pace === i + 1 ? "text-indigo-600 font-bold" : "text-gray-400"}`}
              style={{ width: "20%" }}
            >
              {label}
            </span>
          ))}
        </div>
        <p className="text-center text-sm font-bold text-indigo-600">{PACE_LABELS[formData.pace - 1]}</p>
      </div>
    </div>
  );

  /* ── Step 4 — Preferences ─────────────────────────────────── */
  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Preferences</h2>
        <p className="text-sm text-gray-500">Almost there! Fine-tune your trip.</p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
        <Info className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
        <p className="text-sm text-indigo-700">
          These are optional but help us (and the AI) make better recommendations for you.
        </p>
      </div>

      {/* Accommodation type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Accommodation type</label>
        <div className="flex flex-wrap gap-2">
          {ACCOMMODATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleArrayItem("accommodation_type", opt.value)}
              className={pillCls(formData.accommodation_type.includes(opt.value))}
            >
              <span>{opt.emoji}</span> {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transport preference */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Transport preference</label>
        <div className="flex flex-wrap gap-2">
          {TRANSPORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleArrayItem("transport_pref", opt.value)}
              className={pillCls(formData.transport_pref.includes(opt.value))}
            >
              <span>{opt.emoji}</span> {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dietary needs */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Dietary needs</label>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => toggleArrayItem("dietary_needs", opt)}
              className={pillCls(formData.dietary_needs.includes(opt))}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility needs */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Accessibility needs</label>
        <textarea
          rows={2}
          placeholder="e.g. wheelchair access, visual or hearing impairments..."
          value={formData.accessibility_notes}
          onChange={(e) => updateField("accessibility_notes", e.target.value)}
          className={inputCls() + " resize-none"}
        />
      </div>

      {/* Additional notes */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Additional notes</label>
        <textarea
          rows={3}
          placeholder="Anything you'd like to include or avoid on this trip..."
          value={formData.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          className={inputCls() + " resize-none"}
        />
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════
     MAIN RENDER
     ═══════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .step-animate { animation: fadeSlideUp 0.3s ease-out forwards; }
      `}</style>

      <div className="min-h-screen bg-white flex flex-col">
        {/* ── Sticky header ──────────────────────────────────── */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100">
          <div className="max-w-[680px] mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate("/trips")}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-base font-semibold text-gray-900">Plan your trip</h1>
            <span className="text-sm font-medium text-gray-400">Step {step} of 4</span>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-gray-100">
            <div
              className="h-1 bg-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </header>

        {/* ── Content area ───────────────────────────────────── */}
        <main className="flex-1 pb-28 md:pb-10">
          <div className="max-w-[680px] mx-auto px-6 py-8">
            {/* API error banner */}
            {apiError && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <span className="text-red-500 text-sm font-medium">{apiError}</span>
                <button onClick={() => setApiError(null)} className="ml-auto text-red-400 hover:text-red-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step content — key forces remount for animation */}
            <div key={step} className="step-animate">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
            </div>
          </div>
        </main>

        {/* ── Bottom action bar ──────────────────────────────── */}
        <div className="fixed bottom-0 left-0 right-0 md:static bg-white border-t border-gray-100 z-10">
          <div className="max-w-[680px] mx-auto px-6 py-4 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {step === 4 && (
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isSubmitting}
                  className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  Skip
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? "Creating..." : "Create Trip"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTrip;
