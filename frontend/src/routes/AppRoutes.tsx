import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { ProtectedLayout } from "@/layouts/ProtectedLayout";
import Index from "@/pages/Index";
import BudgetTracker from "@/pages/BudgetTracker";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ItinerariesDashboard from "@/pages/ItinerariesDashboard";
import CreateItinerary from "@/pages/CreateItinerary";
import ItineraryView from "@/pages/ItineraryView";
import GeneratedItinerary from "@/pages/GeneratedItinerary";
import StartPlanning from "@/pages/startplanning";
import ItineraryResults from "@/pages/ItineraryResults";
import Dashboard from "@/pages/app/Dashboard";
import Flights from "@/pages/Flights";
import Hotels from "@/pages/Hotels";
import Transport from "@/pages/app/Transport";
import ActivitiesAndEvents from "@/pages/ActivitiesAndEvents";
import MyBookings from "@/pages/MyBookings";
import AppItineraries from "@/pages/app/AppItineraries";
import GuideBooking from "@/pages/app/GuideBooking";
import AppBudgetTracker from "@/pages/app/AppBudgetTracker";
import RealTimeUpdates from "@/pages/app/RealTimeUpdates";
import SafetyAlerts from "@/pages/app/SafetyAlerts";
import Settings from "@/pages/app/Settings";
import NotFound from "@/pages/NotFound";
import CreateTrip from "@/pages/CreateTrip";
import Trips from "@/pages/Trips";
import TripDashboard from "@/pages/TripDashboard";
import GenerateItineraryWrapper from "@/pages/GenerateItinerary";
import ExplorePage from "@/pages/ExplorePage";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
        <Route path="/budget" element={<BudgetTracker />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

        {/* Trip-based workflow (protected) */}
        <Route
          path="/create-trip"
          element={
            <ProtectedRoute>
              <CreateTrip />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips"
          element={
            <ProtectedRoute>
              <Trips />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trip/:tripId"
          element={
            <ProtectedRoute>
              <TripDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trip/:tripId/budget"
          element={
            <ProtectedRoute>
              <BudgetTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trip/:tripId/generate-itinerary"
          element={
            <ProtectedRoute>
              <GenerateItineraryWrapper />
            </ProtectedRoute>
          }
        />
        <Route
          path="/generate-itinerary"
          element={
            <ProtectedRoute>
              <GenerateItineraryWrapper />
            </ProtectedRoute>
          }
        />

        {/* Existing itineraries and app layout */}
        <Route path="/itineraries" element={<ItinerariesDashboard />} />
        <Route path="/itineraries/new" element={<CreateItinerary />} />
        <Route path="/itineraries/generated" element={<GeneratedItinerary />} />
        <Route path="/itineraries/:id" element={<ItineraryView />} />
        <Route path="/startplanning" element={<StartPlanning />} />
        <Route path="/itinerary-results" element={<ItineraryResults />} />
        <Route path="/itinerary" element={<ItineraryResults />} />
        <Route path="/itinerary/:id" element={<ItineraryView />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="flights" element={<Flights />} />
          <Route path="hotels" element={<Hotels />} />
          <Route path="transport" element={<Transport />} />
          <Route path="activities" element={<ActivitiesAndEvents />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="itineraries" element={<AppItineraries />} />
          <Route path="guide-booking" element={<GuideBooking />} />
          <Route path="budget" element={<AppBudgetTracker />} />
          <Route path="updates" element={<RealTimeUpdates />} />
          <Route path="safety" element={<SafetyAlerts />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

