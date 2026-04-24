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
        className="flex h-16 shrink-0 items-center gap-4 px-4 md:px-6"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: isScrolled ? "rgba(253,252,250,0.92)" : "transparent",
          backdropFilter: isScrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: isScrolled ? "blur(16px)" : "none",
          boxShadow: isScrolled ? "0 1px 0 rgba(232,220,200,0.4)" : "none",
          transition: "background 350ms ease, backdrop-filter 350ms ease, box-shadow 350ms ease",
          color: isScrolled ? "#1A1A1A" : "rgba(247,245,240,0.85)",
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
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "inherit", opacity: 0.7 }} />
        <Input
          placeholder="Search trips, flights, hotels..."
          className="h-10 rounded-xl border-border bg-muted/50 pl-9 focus-visible:ring-2"
        />
      </div>
      {/* Notifications + Profile - top-right with spacing */}
      <div className="ml-auto flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full" style={{ color: "inherit" }}>
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 rounded-full border-2 border-border">
                <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {showIncompleteBadge && (
                <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-background" />
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
