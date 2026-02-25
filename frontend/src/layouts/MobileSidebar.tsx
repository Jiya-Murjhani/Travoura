import { NavLink, useNavigate } from "react-router-dom";
import {
  Plane,
  LayoutDashboard,
  Hotel,
  Car,
  CalendarDays,
  Map,
  BookOpen,
  Wallet,
  Radio,
  ShieldAlert,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/flights", label: "Flights", icon: Plane },
  { to: "/app/hotels", label: "Hotels", icon: Hotel },
  { to: "/app/transport", label: "Transport", icon: Car },
  { to: "/app/activities", label: "Activities & Events", icon: CalendarDays },
  { to: "/app/itineraries", label: "Itineraries", icon: Map },
  { to: "/app/guide-booking", label: "Guide Booking", icon: BookOpen },
  { to: "/app/budget", label: "Budget Tracker", icon: Wallet },
  { to: "/app/updates", label: "Real-Time Updates", icon: Radio },
  { to: "/app/safety", label: "Safety Alerts", icon: ShieldAlert },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

interface MobileSidebarProps {
  onClose: () => void;
}

export function MobileSidebar({ onClose }: MobileSidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-72 shrink-0 flex flex-col border-r border-border bg-[hsl(215,28%,12%)] text-[hsl(210,40%,95%)] md:hidden">
      <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
        <span className="text-lg font-bold text-white">Menu</span>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
          <X className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/app/dashboard"}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[hsl(211,100%,65%)] text-white shadow-md"
                    : "text-[hsl(210,40%,85%)] hover:bg-white/10 hover:text-white"
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t border-white/10 p-2">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[hsl(210,40%,85%)] hover:bg-red-500/20 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
