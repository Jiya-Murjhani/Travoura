import type { Itinerary } from "./types";

// Mock data for static UI. Shape mirrors what an AI-backed backend would eventually return.
export const mockItineraries: Itinerary[] = [
  {
    id: "iti_001",
    destination: "Kyoto, Japan",
    startDateISO: "2026-03-12",
    endDateISO: "2026-03-18",
    pace: "Balanced",
    budget: "Comfort",
    status: "Final",
    interests: ["Culture", "Food", "Nature"],
    createdAtISO: "2026-01-10T09:12:00.000Z",
  },
  {
    id: "iti_002",
    destination: "Lisbon, Portugal",
    startDateISO: "2026-02-06",
    endDateISO: "2026-02-10",
    pace: "Chill",
    budget: "Budget",
    status: "Draft",
    interests: ["Food", "Shopping"],
    createdAtISO: "2026-01-14T18:30:00.000Z",
  },
  {
    id: "iti_003",
    destination: "Reykjavík, Iceland",
    startDateISO: "2026-11-02",
    endDateISO: "2026-11-08",
    pace: "Packed",
    budget: "Luxury",
    status: "Final",
    interests: ["Nature", "Adventure"],
    createdAtISO: "2026-01-02T14:05:00.000Z",
  },
  {
    id: "iti_004",
    destination: "Marrakesh, Morocco",
    startDateISO: "2025-10-10",
    endDateISO: "2025-10-14",
    pace: "Balanced",
    budget: "Comfort",
    status: "Final",
    interests: ["Culture", "Food", "Shopping"],
    createdAtISO: "2025-09-01T11:40:00.000Z",
  },
  {
    id: "iti_005",
    destination: "Banff, Canada",
    startDateISO: "2025-12-20",
    endDateISO: "2025-12-26",
    pace: "Chill",
    budget: "Comfort",
    status: "Draft",
    interests: ["Nature"],
    createdAtISO: "2025-12-01T08:22:00.000Z",
  },
];


