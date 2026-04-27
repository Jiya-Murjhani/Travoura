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
          background: "var(--app-bg-primary)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "0.5px solid var(--app-border-default)",
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
          style={{ color: "var(--app-text-primary)", borderColor: isScrolled ? undefined : "rgba(240,236,228,0.2)" }}
          onClick={onMenuToggle}
          aria-expanded={mobileMenuOpen}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      {/* Search - center */}
      <div className="relative flex-1 max-w-[200px] mx-auto hidden md:block">
        <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" style={{ color: "var(--app-text-secondary)" }} />
        <Input
          placeholder="Search trips, destinations..."
          style={{ height: 32, borderRadius: 4, background: "var(--app-bg-secondary)", border: "0.5px solid var(--app-border-default)", paddingLeft: 36, fontSize: 13, color: "var(--app-text-primary)" }}
          className="focus-visible:ring-1 focus-visible:ring-[var(--app-accent-primary)] shadow-none placeholder:text-[var(--app-text-secondary)]"
        />
      </div>
      {/* Notifications + Profile - top-right with spacing */}
      <div className="ml-auto flex items-center gap-3">
        <Button variant="ghost" size="icon" style={{ height: 36, width: 36, borderRadius: "50%", background: "var(--app-bg-glass)", position: "relative" }}>
          <Bell className="h-4 w-4" style={{ color: "var(--app-text-primary)" }} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full" style={{ background: "var(--app-accent-primary)" }} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" style={{ height: 36, width: 36, borderRadius: "50%", padding: 0, overflow: "hidden", position: "relative", border: "1px solid var(--app-border-hover)" }}>
              <div className="flex h-full w-full items-center justify-center text-[11px] font-bold" style={{ background: "var(--app-accent-soft)", color: "var(--app-accent-light)" }}>
                {initials}
              </div>
              {showIncompleteBadge && (
                <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-[var(--app-bg-primary)]" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border border-[#8b78dd]/20 bg-[#1a1826] text-[#8b78dd]">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-[#8b78dd]">{displayName}</p>
                <p className="text-xs text-[#8b78dd]/70">{user?.email ?? ""}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#8b78dd]/20" />
            <DropdownMenuItem className="text-[#8b78dd] focus:bg-[#8b78dd]/10 focus:text-[#8b78dd]">Profile</DropdownMenuItem>
            <DropdownMenuItem asChild className="text-[#8b78dd] focus:bg-[#8b78dd]/10 focus:text-[#8b78dd]">
              <a href="/app/settings">Settings</a>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsSlideOverOpen(true)} className="flex items-center gap-2 cursor-pointer text-[#8b78dd] focus:bg-[#8b78dd]/10 focus:text-[#8b78dd]">
              <SettingsIcon className="w-4 h-4 text-[#8b78dd]" />
              <span>Edit Preferences</span>
              {showIncompleteBadge && <span className="ml-auto h-2 w-2 rounded-full bg-red-500" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#8b78dd]/20" />
            <DropdownMenuItem
              className="text-[#8b78dd] focus:bg-[#8b78dd]/10 focus:text-[#8b78dd]"
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
