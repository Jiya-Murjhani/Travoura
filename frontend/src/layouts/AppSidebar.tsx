import { Fragment } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Plane,
  LayoutDashboard,
  Compass,
  Hotel,
  Car,
  CalendarDays,
  Map,
  Bookmark,
  BookOpen,
  Wallet,
  Radio,
  ShieldAlert,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/explore", label: "Explore", icon: Compass },
  { to: "/app/flights", label: "Flights", icon: Plane },
  { to: "/app/hotels", label: "Hotels", icon: Hotel },
  { to: "/app/transport", label: "Transport", icon: Car },
  { to: "/app/activities", label: "Activities & Events", icon: CalendarDays },
  { to: "/app/bookings", label: "My Bookings", icon: Bookmark },
  { to: "/app/itineraries", label: "Itineraries", icon: Map },
  { to: "/app/guide-booking", label: "Guide Booking", icon: BookOpen },
  { to: "/app/budget", label: "Budget Tracker", icon: Wallet },
  { to: "/app/updates", label: "Real-Time Updates", icon: Radio },
  { to: "/app/safety", label: "Safety Alerts", icon: ShieldAlert },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { collapsed } = useSidebar();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out",
      isActive
        ? "bg-[hsl(211,100%,65%)] text-white shadow-md"
        : "text-[hsl(210,40%,85%)] hover:bg-white/10 hover:text-white"
    );

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden border-r border-white/10 bg-[hsl(215,28%,12%)] text-[hsl(210,40%,95%)] transition-[width] duration-300 ease-in-out">
      {/* Logo + Toggle */}
      <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-2">
        {collapsed ? (
          <div className="flex w-full flex-col items-center gap-2 py-1">
            <NavLink
              to="/app/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(211,100%,65%)] text-white transition-transform duration-200 hover:scale-105"
            >
              <Plane className="h-5 w-5" />
            </NavLink>
            <SidebarToggleButton />
          </div>
        ) : (
          <>
            <NavLink to="/app/dashboard" className="flex flex-1 items-center gap-2 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[hsl(211,100%,65%)] text-white">
                <Plane className="h-5 w-5" />
              </div>
              <span className="truncate text-lg font-bold text-white">Travoura</span>
            </NavLink>
            <SidebarToggleButton />
          </>
        )}
      </div>

      <ScrollArea className="flex-1 py-3">
        <TooltipProvider delayDuration={0}>
          <nav className={cn("flex flex-col px-2", collapsed ? "items-center gap-1" : "gap-1.5")}>
            {navItems.map(({ to, label, icon: Icon }) => (
              <Fragment key={to}>
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={to}
                        end={to === "/app/dashboard"}
                        className={({ isActive }) =>
                          cn(
                            linkClass({ isActive }),
                            "justify-center px-2 py-3"
                          )
                        }
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="rounded-lg">
                      {label}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <NavLink to={to} end={to === "/app/dashboard"} className={linkClass}>
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="truncate">{label}</span>
                  </NavLink>
                )}
              </Fragment>
            ))}
          </nav>
        </TooltipProvider>
      </ScrollArea>

      {/* Logout - no chatbot in sidebar */}
      <div className="shrink-0 border-t border-white/10 p-2">
        {collapsed ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full justify-center rounded-xl px-0 py-3 text-[hsl(210,40%,85%)] transition-colors duration-200 hover:bg-red-500/20 hover:text-red-300"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="rounded-lg">
                Logout
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[hsl(210,40%,85%)] transition-colors duration-200 hover:bg-red-500/20 hover:text-red-300"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
}

function SidebarToggleButton() {
  const { collapsed, toggle } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[hsl(210,40%,85%)] transition-colors duration-200 hover:bg-white/10 hover:text-white"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? (
        <PanelLeft className="h-4 w-4" />
      ) : (
        <PanelLeftClose className="h-4 w-4" />
      )}
    </button>
  );
}
