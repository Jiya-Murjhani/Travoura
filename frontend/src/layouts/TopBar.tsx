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

interface TopBarProps {
  onMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}

export function TopBar({ onMenuToggle, mobileMenuOpen }: TopBarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background/95 px-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      {/* Mobile menu button */}
      {onMenuToggle && (
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={onMenuToggle}
          aria-expanded={mobileMenuOpen}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      {/* Search - left side */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search trips, flights, hotels..."
          className="h-10 rounded-xl border-border bg-muted/50 pl-9 focus-visible:ring-2"
        />
      </div>
      {/* Notifications + Profile - top-right with spacing */}
      <div className="ml-auto flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
          <Bell className="h-5 w-5 text-muted-foreground" />
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
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.username ?? "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email ?? ""}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/app/settings">Settings</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
