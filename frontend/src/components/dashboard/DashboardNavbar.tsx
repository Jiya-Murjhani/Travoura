import { Plane } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

/**
 * Dashboard navbar is intentionally simpler than the marketing navbar:
 * - less navigation noise
 * - quick access to profile actions (static for now)
 * - keeps focus on itinerary management/creation
 */
export function DashboardNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Plane className="h-7 w-7 text-primary" />
            <span className="text-xl font-semibold tracking-tight">Travoura</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/itineraries/new">
              <Button variant="secondary" className="hidden sm:inline-flex">
                Create itinerary
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-hero text-primary-foreground">A</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>Profile</DropdownMenuItem>
                <DropdownMenuItem disabled>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}


