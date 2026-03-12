import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CreateTrip = () => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreateTrip = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!destination.trim() || !startDate || !endDate || !budget) {
      setError("Please fill in all fields.");
      return;
    }

    const parsedBudget = Number(budget);
    if (Number.isNaN(parsedBudget) || parsedBudget <= 0) {
      setError("Please enter a valid budget amount.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          destination: destination.trim(),
          startDate,
          endDate,
          budget: parsedBudget,
        }),
      });

      const data = await response.json();

      if (response.ok && data?.success) {
        navigate("/trips", { replace: true });
      } else {
        setError(data?.message || "Failed to create trip. Please try again.");
      }
    } catch (err) {
      console.error("Create trip failed:", err);
      setError("Failed to create trip. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-light px-4 py-10">
      <div className="mx-auto max-w-3xl pt-16">
        <Card className="border-border/60 bg-card/95 shadow-elevated">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">Plan a New Trip</CardTitle>
            <CardDescription>
              Set up the basics for your next adventure – you can refine the details later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTrip} className="space-y-4">
              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Destination</label>
                <Input
                  type="text"
                  placeholder="Where are you going?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Total Budget (₹)</label>
                <Input
                  type="number"
                  min={0}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full h-11 text-base font-semibold">
                  Create Trip
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTrip;

