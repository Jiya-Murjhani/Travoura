import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Wallet, Star, Crown, Info, Check, ArrowRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ItineraryRequest } from "@/types/itinerary";

const formSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  origin: z.string().optional(),
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date({
    required_error: "End date is required",
  }),
  num_travelers: z.number().min(1, "At least 1 traveler required").max(20, "Maximum 20 travelers"),
  traveler_type: z.enum(["solo", "couple", "family", "group"], {
    errorMap: () => ({ message: "Select a group type" }),
  }),
  budget_level: z.enum(["budget", "moderate", "luxury"]).optional(),
  pace: z.enum(["relaxed", "moderate", "packed"]).optional(),
  accommodation_type: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  avoid: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const INTERESTS = [
  "🏖️ Beaches", "🏔️ Mountains", "🏛️ History", "🎨 Art & Culture", 
  "🍜 Food & Cuisine", "🎉 Nightlife", "🧗 Adventure Sports", 
  "🛍️ Shopping", "🦁 Wildlife", "📸 Photography", "🏗️ Architecture", 
  "🏪 Local Markets", "💆 Wellness & Spa", "🕌 Religious Sites"
];

const ACCOMMODATIONS = [
  "Hotel", "Hostel", "Airbnb", "Resort"
];

export default function ItineraryForm({ onSubmit }: { onSubmit: (data: ItineraryRequest) => void }) {
  const [step, setStep] = useState(1);
  const location = useLocation();
  const prefilledDestination = location.state?.destination || "";

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: prefilledDestination,
      origin: "",
      num_travelers: 1,
      traveler_type: "solo",
      budget_level: "moderate",
      pace: "moderate",
      accommodation_type: [],
      interests: [],
      avoid: ""
    },
    mode: "onTouched"
  });

  const formValues = watch();

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ["destination", "origin", "start_date", "end_date", "num_travelers", "traveler_type"];
    else if (step === 2) fieldsToValidate = ["budget_level", "pace", "accommodation_type"];
    else if (step === 3) fieldsToValidate = ["interests", "avoid"];

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid && step < 4) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const submitForm = (data: FormValues) => {
    let avoidArray: string[] | undefined;
    if (data.avoid && data.avoid.trim()) {
      avoidArray = data.avoid.split(",").map(v => v.trim()).filter(Boolean);
    }
    
    // Explicitly parse dates as string ISO without time portion for consistency
    const requestPayload: ItineraryRequest = {
      destination: data.destination,
      origin: data.origin,
      start_date: format(data.start_date, 'yyyy-MM-dd'),
      end_date: format(data.end_date, 'yyyy-MM-dd'),
      num_travelers: data.num_travelers,
      traveler_type: data.traveler_type,
      budget_level: data.budget_level,
      pace: data.pace,
      accommodation_type: data.accommodation_type,
      interests: data.interests,
      avoid: avoidArray,
    };
    
    onSubmit(requestPayload);
  };

  const inputCls = (hasError?: boolean) =>
    `rounded-xl border ${hasError ? "border-red-400" : "border-gray-200"} px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm transition-colors bg-white`;

  const pillCls = (selected: boolean) =>
    `px-4 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-all duration-150 select-none inline-flex items-center gap-1.5 ${
      selected
        ? "bg-indigo-100 text-indigo-700 border-indigo-300 shadow-sm"
        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
    }`;

  // Step Indicators
  const renderStepIndicators = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${
              step === i
                ? "bg-indigo-600 text-white"
                : i < step
                ? "bg-indigo-100 text-indigo-600"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {i < step ? <Check className="w-4 h-4" /> : i}
          </div>
          {i < 4 && (
            <div
              className={`w-12 h-1 ${
                i < step ? "bg-indigo-200" : "bg-gray-100"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-[680px] mx-auto px-6 py-6 pb-32 relative">
      {renderStepIndicators()}

      <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
        
        {/* STEP 1: WHERE & WHEN */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Where &amp; When</h2>
              <p className="text-sm text-gray-500">Set your destination, group size and dates.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Destination <span className="text-red-400">*</span></label>
              <input
                {...register("destination")}
                placeholder="e.g. Paris, France"
                className={inputCls(!!errors.destination)}
              />
              {errors.destination && <p className="text-xs text-red-500">{errors.destination.message as string}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Origin <span className="font-normal text-gray-400">(optional)</span></label>
              <input
                {...register("origin")}
                placeholder="e.g. Mumbai, India"
                className={inputCls(!!errors.origin)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Start Date <span className="text-red-400">*</span></label>
                <Controller
                  name="start_date"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button type="button" className={`${inputCls(!!errors.start_date)} text-left flex justify-between items-center ${!field.value ? "text-gray-400" : "text-gray-900"}`}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="w-4 h-4 opacity-50" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.start_date && <p className="text-xs text-red-500">{errors.start_date.message as string}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">End Date <span className="text-red-400">*</span></label>
                <Controller
                  name="end_date"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button type="button" className={`${inputCls(!!errors.end_date)} text-left flex justify-between items-center ${!field.value ? "text-gray-400" : "text-gray-900"}`}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="w-4 h-4 opacity-50" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => {
                          const sd = formValues.start_date;
                          return sd ? date < sd : date < new Date();
                        }} initialFocus />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.end_date && <p className="text-xs text-red-500">{errors.end_date.message as string}</p>}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Number of travelers <span className="text-red-400">*</span></label>
                <input
                  type="number"
                  {...register("num_travelers", { valueAsNumber: true })}
                  className={inputCls(!!errors.num_travelers)}
                />
                {errors.num_travelers && <p className="text-xs text-red-500">{errors.num_travelers.message as string}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Traveler Type <span className="text-red-400">*</span></label>
                <Controller
                  name="traveler_type"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {["solo", "couple", "family", "group"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => field.onChange(type)}
                          className={pillCls(field.value === type)}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                />
                {errors.traveler_type && <p className="text-xs text-red-500">{errors.traveler_type.message as string}</p>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: YOUR STYLE */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Your Style</h2>
              <p className="text-sm text-gray-500">Select how you want to experience the trip.</p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Budget Level</label>
              <Controller
                name="budget_level"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button type="button" onClick={() => field.onChange("budget")} className={`p-4 rounded-xl border text-left transition-all duration-150 ${field.value === "budget" ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 flex-1" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                      <Wallet className={`w-6 h-6 mb-2 ${field.value === "budget" ? "text-indigo-600" : "text-gray-400"}`} />
                      <div className={`font-semibold text-sm ${field.value === "budget" ? "text-indigo-900" : "text-gray-900"}`}>Budget</div>
                      <div className="text-xs text-gray-500 mt-1">Hostels, street food, public transport</div>
                    </button>
                    <button type="button" onClick={() => field.onChange("moderate")} className={`p-4 rounded-xl border text-left transition-all duration-150 ${field.value === "moderate" ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 flex-1" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                      <Star className={`w-6 h-6 mb-2 ${field.value === "moderate" ? "text-indigo-600" : "text-gray-400"}`} />
                      <div className={`font-semibold text-sm ${field.value === "moderate" ? "text-indigo-900" : "text-gray-900"}`}>Moderate</div>
                      <div className="text-xs text-gray-500 mt-1">Mid-range hotels, local restaurants</div>
                    </button>
                    <button type="button" onClick={() => field.onChange("luxury")} className={`p-4 rounded-xl border text-left transition-all duration-150 ${field.value === "luxury" ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 flex-1" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                      <Crown className={`w-6 h-6 mb-2 ${field.value === "luxury" ? "text-indigo-600" : "text-gray-400"}`} />
                      <div className={`font-semibold text-sm ${field.value === "luxury" ? "text-indigo-900" : "text-gray-900"}`}>Luxury</div>
                      <div className="text-xs text-gray-500 mt-1">Premium hotels, fine dining, privates</div>
                    </button>
                  </div>
                )}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Travel Pace</label>
              <Controller
                name="pace"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {["relaxed", "moderate", "packed"].map((pace) => (
                      <button
                        key={pace}
                        type="button"
                        onClick={() => field.onChange(pace)}
                        className={pillCls(field.value === pace)}
                      >
                        {pace.charAt(0).toUpperCase() + pace.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Accommodation Type</label>
              <Controller
                name="accommodation_type"
                control={control}
                render={({ field }) => {
                  const arr = field.value || [];
                  const toggle = (val: string) => {
                     const newArr = arr.includes(val) ? arr.filter(i => i !== val) : [...arr, val];
                     field.onChange(newArr);
                  };
                  return (
                    <div className="flex flex-wrap gap-2">
                       {ACCOMMODATIONS.map(acc => (
                         <button key={acc} type="button" onClick={() => toggle(acc.toLowerCase())} className={pillCls(arr.includes(acc.toLowerCase()))}>
                           {acc}
                         </button>
                       ))}
                    </div>
                  );
                }}
              />
            </div>
          </div>
        )}

        {/* STEP 3: YOUR INTERESTS */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Your Interests</h2>
              <p className="text-sm text-gray-500">Select what excites you the most.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Interests</label>
              <Controller
                name="interests"
                control={control}
                render={({ field }) => {
                  const arr = field.value || [];
                  const toggle = (val: string) => {
                     const valPlain = val.replace(/^[\p{Emoji}\s]+/u, '').trim();
                     const newArr = arr.includes(valPlain) ? arr.filter(i => i !== valPlain) : [...arr, valPlain];
                     field.onChange(newArr);
                  };
                  return (
                    <div className="flex flex-wrap gap-2">
                       {INTERESTS.map(interest => {
                         const valPlain = interest.replace(/^[\p{Emoji}\s]+/u, '').trim();
                         return (
                           <button key={interest} type="button" onClick={() => toggle(interest)} className={pillCls(arr.includes(valPlain))}>
                             {interest}
                           </button>
                         )
                       })}
                    </div>
                  );
                }}
              />
            </div>

            <div className="space-y-1.5 pt-4 border-t border-gray-100">
              <label className="text-sm font-medium text-gray-700">Things to avoid <span className="font-normal text-gray-400">(optional)</span></label>
              <textarea
                {...register("avoid")}
                rows={3}
                placeholder="e.g. crowded places, spicy food, early mornings"
                className={`${inputCls()} resize-none`}
              />
              <p className="text-xs text-gray-500">The AI will try to avoid these in your itinerary</p>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Review &amp; Generate</h2>
              <p className="text-sm text-gray-500">Almost ready to build your perfect trip.</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
               <div className="grid grid-cols-2 gap-y-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Destination</div>
                    <div className="font-medium text-gray-900 mt-0.5">{formValues.destination}</div>
                  </div>
                  <div>
                     <div className="text-xs text-gray-500 uppercase font-semibold">Dates</div>
                     <div className="font-medium text-gray-900 mt-0.5">
                       {formValues.start_date && format(formValues.start_date, 'MMM d')} - {formValues.end_date && format(formValues.end_date, 'MMM d, yyyy')}
                     </div>
                  </div>
                  <div>
                     <div className="text-xs text-gray-500 uppercase font-semibold">Group</div>
                     <div className="font-medium text-gray-900 flex items-center gap-2 mt-0.5">
                       {formValues.num_travelers} {formValues.num_travelers === 1 ? 'person' : 'people'} 
                       <span className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded-full uppercase">{formValues.traveler_type}</span>
                     </div>
                  </div>
                  <div>
                     <div className="text-xs text-gray-500 uppercase font-semibold">Style</div>
                     <div className="font-medium text-gray-900 flex flex-col gap-1 mt-0.5 items-start">
                       <span className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded-full uppercase">{formValues.budget_level} Budget</span>
                       <span className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded-full uppercase">{formValues.pace} Pace</span>
                     </div>
                  </div>
               </div>
               {formValues.interests && formValues.interests.length > 0 && (
                 <div className="pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1.5">Interests</div>
                    <div className="flex flex-wrap gap-1">
                      {formValues.interests.map(i => <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{i}</span>)}
                    </div>
                 </div>
               )}
            </div>

            <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
              <Info className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
              <p className="text-sm text-indigo-700 leading-relaxed">
                Your itinerary will be personalized based on these preferences. You can refine it after generation using chat.
              </p>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-4 font-bold text-lg shadow-sm transition-all duration-150 flex items-center justify-center gap-2">
               Generate My Itinerary ✨
            </button>
          </div>
        )}

        {/* BOTTOM STICKY NAVIGATION */}
        {step < 4 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-10 w-full">
            <div className="max-w-[680px] mx-auto flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Back
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-2 transition-all duration-150 shadow-sm"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
