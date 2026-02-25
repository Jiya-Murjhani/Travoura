import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BudgetProvider } from "@/contexts/BudgetContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProtectedLayout } from "@/layouts/ProtectedLayout";
import Index from "./pages/Index";
import BudgetTracker from "./pages/BudgetTracker";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import ItinerariesDashboard from "./pages/ItinerariesDashboard";
import CreateItinerary from "./pages/CreateItinerary";
import ItineraryView from "./pages/ItineraryView";
import GeneratedItinerary from "./pages/GeneratedItinerary";
import StartPlanning from "./pages/startplanning";
import ItineraryResults from "./pages/ItineraryResults";
import Dashboard from "./pages/app/Dashboard";
import Flights from "./pages/app/Flights";
import Hotels from "./pages/app/Hotels";
import Transport from "./pages/app/Transport";
import ActivitiesAndEvents from "./pages/app/ActivitiesAndEvents";
import AppItineraries from "./pages/app/AppItineraries";
import GuideBooking from "./pages/app/GuideBooking";
import AppBudgetTracker from "./pages/app/AppBudgetTracker";
import RealTimeUpdates from "./pages/app/RealTimeUpdates";
import SafetyAlerts from "./pages/app/SafetyAlerts";
import Settings from "./pages/app/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BudgetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/budget" element={<BudgetTracker />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/itineraries" element={<ItinerariesDashboard />} />
              <Route path="/itineraries/new" element={<CreateItinerary />} />
              <Route path="/itineraries/generated" element={<GeneratedItinerary />} />
              <Route path="/itineraries/:id" element={<ItineraryView />} />
              <Route path="/startplanning" element={<StartPlanning />} />
              <Route path="/itinerary-results" element={<ItineraryResults />} />
              <Route path="/itinerary" element={<ItineraryResults />} />
              {/* Protected app layout: sidebar + topbar + nested routes (no page reload) */}
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
                <Route path="flights" element={<Flights />} />
                <Route path="hotels" element={<Hotels />} />
                <Route path="transport" element={<Transport />} />
                <Route path="activities" element={<ActivitiesAndEvents />} />
                <Route path="itineraries" element={<AppItineraries />} />
                <Route path="guide-booking" element={<GuideBooking />} />
                <Route path="budget" element={<AppBudgetTracker />} />
                <Route path="updates" element={<RealTimeUpdates />} />
                <Route path="safety" element={<SafetyAlerts />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </BudgetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
