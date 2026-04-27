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
  Plus,
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

const navGroups = [
  {
    label: "MAIN",
    items: [
      { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/app/explore", label: "Explore", icon: Compass },
    ],
  },
  {
    label: "PLAN",
    items: [
      { to: "/app/flights", label: "Flights", icon: Plane },
      { to: "/app/hotels", label: "Hotels", icon: Hotel },
      { to: "/app/transport", label: "Transport", icon: Car },
      { to: "/app/activities", label: "Activities & Events", icon: CalendarDays },
      { to: "/app/guide-booking", label: "Guide Booking", icon: BookOpen },
    ],
  },
  {
    label: "TRACK",
    items: [
      { to: "/app/bookings", label: "My Bookings", icon: Bookmark },
      { to: "/app/itineraries", label: "Itineraries", icon: Map },
      { to: "/app/budget", label: "Budget Tracker", icon: Wallet },
      { to: "/app/updates", label: "Real-Time Updates", icon: Radio },
      { to: "/app/safety", label: "Safety Alerts", icon: ShieldAlert },
      { to: "/app/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const { logout, displayName } = useAuth();
  const { collapsed } = useSidebar();
  const initials = displayName.slice(0, 2).toUpperCase() || "U";

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-[9px] text-[13px] font-medium transition-colors duration-150 border-l-2",
      isActive
        ? "bg-[var(--app-accent-soft)] text-[var(--app-accent-primary)] border-[var(--app-accent-primary)]"
        : "text-[var(--app-text-secondary)] border-transparent hover:bg-[var(--app-accent-glow)] hover:text-[var(--app-accent-light)] hover:border-[var(--app-accent-primary)]"
    );

  return (
    <aside 
      className={cn(
        "flex h-full flex-col overflow-hidden transition-[width] duration-300 ease-in-out shrink-0",
        collapsed ? "w-[60px]" : "w-[220px]"
      )}
      style={{ background: "var(--app-bg-primary)", borderRight: "0.5px solid var(--app-border-default)" }}
    >
      {/* Logo + Toggle */}
      <div className="flex shrink-0 items-center border-b px-4 py-5" style={{ minHeight: "80px", borderColor: "var(--app-border-default)" }}>
        {collapsed ? (
          <div className="flex w-full flex-col items-center gap-4">
            <NavLink
              to="/app/dashboard"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--app-accent-primary)] transition-transform duration-200 hover:scale-105 bg-[var(--app-accent-soft)]"
            >
              <Plane className="h-4 w-4" />
            </NavLink>
            <SidebarToggleButton />
          </div>
        ) : (
          <div className="flex flex-1 flex-col">
            <div className="flex items-center justify-between">
              <NavLink to="/app/dashboard" className="flex items-center gap-2 overflow-hidden" style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "var(--app-text-primary)", fontWeight: 700 }}>
                Trav<span style={{ color: "var(--app-accent-primary)" }}>o</span>ura
              </NavLink>
              <SidebarToggleButton />
            </div>
            <p style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--app-text-tertiary)", marginTop: 4 }}>
              Your journey, perfected
            </p>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 py-4">
        <TooltipProvider delayDuration={0}>
          <nav className={cn("flex flex-col px-3 gap-6")}>
            {navGroups.map((group, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                {!collapsed && (
                  <p style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "rgba(200,192,176,0.4)", paddingLeft: 12, marginBottom: 4, fontWeight: 600 }}>
                    {group.label}
                  </p>
                )}
                {group.items.map(({ to, label, icon: Icon }) => (
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
                                "justify-center px-0 py-3 mx-1"
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
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                      </NavLink>
                    )}
                  </Fragment>
                ))}
              </div>
            ))}
          </nav>
        </TooltipProvider>
      </ScrollArea>

      {/* New Trip Button */}
      <div className="shrink-0 p-4 pt-0">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate("/create-trip")}
                className={cn(
                  "flex items-center justify-center rounded-[4px] bg-[var(--app-accent-primary)] text-[#0f0e17] transition-all hover:bg-[var(--app-accent-light)] font-semibold",
                  collapsed ? "h-10 w-10 mx-auto rounded-full" : "w-full py-2.5 px-4 gap-2"
                )}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                <Plus className="h-4 w-4 shrink-0" />
                {!collapsed && <span>New Trip</span>}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="rounded-lg">
                New Trip
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* User Footer */}
      <div className="shrink-0 border-t p-4" style={{ borderColor: "var(--app-border-default)" }}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-[var(--app-accent-light)] shadow-sm border border-[var(--app-border-hover)]" style={{ background: "var(--app-accent-soft)" }}>
              {initials}
            </div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex justify-center rounded-lg p-2 text-[var(--app-text-secondary)] transition-colors hover:bg-[var(--app-accent-glow)] hover:text-[var(--app-accent-light)]"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="rounded-lg">
                  Logout
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-[var(--app-accent-light)] shadow-sm border border-[var(--app-border-hover)]" style={{ background: "var(--app-accent-soft)" }}>
                {initials}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-[13px] font-semibold text-[var(--app-text-primary)]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{displayName}</span>
                <span className="truncate text-[11px] text-[var(--app-text-secondary)]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Pro traveller</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[12px] font-medium text-[var(--app-text-secondary)] transition-colors hover:bg-[var(--app-accent-glow)] hover:text-[var(--app-accent-light)]"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span style={{ fontFamily: "'DM Sans', sans-serif" }}>Logout</span>
            </button>
          </div>
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
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[#C8C0B0] transition-colors hover:bg-[rgba(255,255,255,0.1)] hover:text-white"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? (
        <PanelLeft className="h-3 w-3" />
      ) : (
        <PanelLeftClose className="h-3 w-3" />
      )}
    </button>
  );
}
