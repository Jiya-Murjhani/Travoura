import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import Stepper from '../components/Stepper';
import TravelerCounter from '../components/TravelerCounter';
import AccommodationPreferenceCard from '../components/AccommodationPreferenceCard';
import TripVibeCard from '../components/TripVibeCard';
import LivePreviewSidebar from '../components/LivePreviewSidebar';

const TripPlannerPage = () => {
  const [destination, setDestination] = useState('');
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [budget, setBudget] = useState(0);
  const [accommodation, setAccommodation] = useState('');
  const [transport, setTransport] = useState('');
  const [tripVibes, setTripVibes] = useState([]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [aiPreferences, setAiPreferences] = useState({
    hiddenGems: false,
    avoidCrowds: false,
    budgetOptimization: false,
  });

  const history = useHistory();

  const handleSubmit = () => {
    // Simulate AI generation
    setTimeout(() => {
      history.push('/itinerary-results');
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-r from-pink-300 to-yellow-300 min-h-screen p-6">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold">Trip Planner</h1>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter your destination"
          className="mt-2 p-2 border rounded-lg w-full"
        />
        <div className="mt-4">
          <Stepper currentStep={step} totalSteps={3} />
          <ProgressBar currentStep={step} totalSteps={3} />
        </div>
      </header>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Trip Details</h2>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-2 p-2 border rounded-lg w-full"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-2 p-2 border rounded-lg w-full"
          />
        </div>
        <label className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={flexibleDates}
            onChange={() => setFlexibleDates(!flexibleDates)}
            className="mr-2"
          />
          Flexible Dates
        </label>
        <TravelerCounter adults={adults} setAdults={setAdults} children={children} setChildren={setChildren} />
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Budget</h3>
          <input
            type="range"
            min="0"
            max="3"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <AccommodationPreferenceCard selected={accommodation} setSelected={setAccommodation} />
          <select
            value={transport}
            onChange={(e) => setTransport(e.target.value)}
            className="mt-2 p-2 border rounded-lg w-full"
          >
            <option value="">Select Transport Preference</option>
            <option value="car">Car</option>
            <option value="train">Train</option>
            <option value="plane">Plane</option>
          </select>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Trip Vibe</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TripVibeCard selectedVibes={tripVibes} setSelectedVibes={setTripVibes} />
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Special Requests</h2>
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          maxLength={300}
          placeholder="Any special requests?"
          className="mt-2 p-2 border rounded-lg w-full"
        />
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">AI Preferences</h2>
        <label className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={aiPreferences.hiddenGems}
            onChange={() => setAiPreferences({ ...aiPreferences, hiddenGems: !aiPreferences.hiddenGems })}
            className="mr-2"
          />
          Hidden Gems
        </label>
        <label className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={aiPreferences.avoidCrowds}
            onChange={() => setAiPreferences({ ...aiPreferences, avoidCrowds: !aiPreferences.avoidCrowds })}
            className="mr-2"
          />
          Avoid Crowds
        </label>
        <label className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={aiPreferences.budgetOptimization}
            onChange={() => setAiPreferences({ ...aiPreferences, budgetOptimization: !aiPreferences.budgetOptimization })}
            className="mr-2"
          />
          Budget Optimization
        </label>
      </section>

      <LivePreviewSidebar
        destination={destination}
        startDate={startDate}
        endDate={endDate}
        adults={adults}
        children={children}
        budget={budget}
        accommodation={accommodation}
        transport={transport}
        tripVibes={tripVibes}
        specialRequests={specialRequests}
      />

      <footer className="mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-blue-600"
        >
          Start Planning
        </button>
      </footer>
    </div>
  );
};

export default TripPlannerPage;