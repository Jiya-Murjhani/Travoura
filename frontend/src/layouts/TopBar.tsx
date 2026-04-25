import { useState, useEffect } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { usePreferences } from "@/hooks/usePreferences";
import { Settings as SettingsIcon } from "lucide-react";
import { PreferencesSlideOver } from "@/components/preferences/PreferencesSlideOver";
import { PreferencesWizard } from "@/components/preferences/PreferencesWizard";

interface TopBarProps {
  onMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}

export function TopBar({ onMenuToggle, mobileMenuOpen }: TopBarProps) {
  const { user, displayName, logout } = useAuth();
  const navigate = useNavigate();
  const { preferences, isLoading } = usePreferences();
  const initials = displayName.slice(0, 2).toUpperCase() ?? "U";
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showIncompleteBadge = preferences && !preferences.completed && !isLoading;

  return (
    <>
      <PreferencesWizard />
      <PreferencesSlideOver open={isSlideOverOpen} onOpenChange={setIsSlideOverOpen} />
      <header 
        className="flex shrink-0 items-center gap-4 px-4 md:px-6"
        style={{
          height: "52px",
          background: "var(--sand)",
          borderBottom: "1px solid rgba(26,24,20,0.08)",
          zIndex: 100,
          position: "sticky",
          top: 0
        }}
      >
      {/* Mobile menu button */}
      {onMenuToggle && (
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
          style={{ color: "inherit", borderColor: isScrolled ? undefined : "rgba(247,245,240,0.2)" }}
          onClick={onMenuToggle}
          aria-expanded={mobileMenuOpen}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      {/* Search - left side */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" style={{ color: "var(--ink-muted)" }} />
        <Input
          placeholder="Search trips, flights, hotels..."
          style={{ height: 36, borderRadius: 24, background: "var(--sand-dark)", border: "1px solid rgba(26,24,20,0.1)", paddingLeft: 36, fontSize: 13, color: "var(--ink)" }}
          className="focus-visible:ring-1 focus-visible:ring-[#C8973A] shadow-none"
        />
      </div>
      {/* Notifications + Profile - top-right with spacing */}
      <div className="ml-auto flex items-center gap-3">
        <Button variant="ghost" size="icon" style={{ height: 36, width: 36, borderRadius: "50%", background: "var(--sand-dark)", position: "relative" }}>
          <Bell className="h-4 w-4" style={{ color: "var(--ink-light)" }} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full" style={{ background: "#C05A5A" }} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" style={{ height: 36, width: 36, borderRadius: "50%", padding: 0, overflow: "hidden", position: "relative" }}>
              <div className="flex h-full w-full items-center justify-center text-[11px] font-bold text-white" style={{ background: "linear-gradient(135deg, #C8973A, #A07020)" }}>
                {initials}
              </div>
              {showIncompleteBadge && (
                <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-[var(--sand)]" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">{user?.email ?? ""}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/app/settings">Settings</a>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsSlideOverOpen(true)} className="flex items-center gap-2 cursor-pointer">
              <SettingsIcon className="w-4 h-4" />
              <span>Edit Preferences</span>
              {showIncompleteBadge && <span className="ml-auto h-2 w-2 rounded-full bg-red-500" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                void logout();
                navigate("/login", { replace: true });
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    </>
  );
}
