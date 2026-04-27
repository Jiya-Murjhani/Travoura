import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { MobileSidebar } from "./MobileSidebar";
import { FloatingChatbot } from "@/components/FloatingChatbot";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";

function ProtectedLayoutContent() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { width: sidebarWidth } = useSidebar();
  const location = useLocation();
  const isHomePage = location.pathname === '/home';

  return (
    <div className="flex min-h-screen bg-[var(--app-bg-primary)] text-[var(--app-text-primary)]">
      {/* Fixed full-height collapsible sidebar - desktop only */}
      {!isHomePage && (
        <div
          className="fixed left-0 top-0 z-30 hidden h-screen overflow-hidden transition-[width] duration-300 ease-in-out md:block"
          style={{ width: sidebarWidth }}
          aria-hidden={isMobile}
        >
          <AppSidebar />
        </div>
      )}

      {/* Main area: margin-left matches sidebar width (dynamic for expand/collapse) */}
      <div className="flex flex-1 min-w-0 transition-[margin-left] duration-300 ease-in-out" style={{ marginLeft: (isMobile || isHomePage) ? 0 : sidebarWidth }}>
        {isMobile && mobileMenuOpen && (
          <MobileSidebar onClose={() => setMobileMenuOpen(false)} />
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          {!isHomePage && (
            <TopBar
              onMenuToggle={() => setMobileMenuOpen((o) => !o)}
              mobileMenuOpen={mobileMenuOpen}
            />
          )}
          <main className="flex-1 overflow-auto" style={{ paddingTop: isHomePage ? 0 : undefined }}>
            <Outlet />
          </main>
        </div>
      </div>
      <FloatingChatbot />
    </div>
  );
}

export function ProtectedLayout() {
  return (
    <SidebarProvider>
      <ProtectedLayoutContent />
    </SidebarProvider>
  );
}
