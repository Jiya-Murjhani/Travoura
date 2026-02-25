import { createContext, useContext, useState, useCallback, ReactNode } from "react";

const SIDEBAR_EXPANDED_WIDTH = "16rem";
const SIDEBAR_COLLAPSED_WIDTH = "5rem"; // 80px – comfortable icon-only width

interface SidebarContextType {
  collapsed: boolean;
  toggle: () => void;
  width: string;
  expandedWidth: string;
  collapsedWidth: string;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = useCallback(() => setCollapsed((c) => !c), []);
  const width = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        toggle,
        width,
        expandedWidth: SIDEBAR_EXPANDED_WIDTH,
        collapsedWidth: SIDEBAR_COLLAPSED_WIDTH,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (ctx === undefined) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return ctx;
}

export { SIDEBAR_EXPANDED_WIDTH, SIDEBAR_COLLAPSED_WIDTH };
