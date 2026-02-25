import { Plane, MapPin, TrainFront, CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Travoura
            </h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#flights"
              className="flex items-center gap-2 text-gray-800 hover:text-primary transition-colors"
            >
              <Plane className="h-4 w-4 text-gray-800" />
              <span>Flights + Hotels</span>
            </a>
            <a
              href="#destinations"
              className="flex items-center gap-2 text-gray-800 hover:text-primary transition-colors"
            >
              <MapPin className="h-4 w-4 text-gray-800" />
              <span>Destinations</span>
            </a>
            <a
              href="#transport"
              className="flex items-center gap-2 text-gray-800 hover:text-primary transition-colors"
            >
              <TrainFront className="h-4 w-4 text-gray-800" />
              <span>Transport</span>
            </a>
            <a
              href="#activities"
              className="flex items-center gap-2 text-gray-800 hover:text-primary transition-colors"
            >
              <CalendarClock className="h-4 w-4 text-gray-800" />
              <span>Activities + Events</span>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
