import { useState } from "react";
import { LayoutDashboard, FolderOpen, Download, Settings, Plus, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onNewDashboard: () => void;
}

const navItems = [
  { id: "dashboards", label: "Dashboards", icon: LayoutDashboard },
  { id: "files", label: "Saved Files", icon: FolderOpen },
  { id: "downloads", label: "Downloads", icon: Download },
  { id: "settings", label: "Settings", icon: Settings },
];

export const AppSidebar = ({ currentView, onViewChange, onNewDashboard }: AppSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`
        relative border-r bg-surface flex flex-col shrink-0 overflow-hidden
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[64px]" : "w-56"}
      `}
    >
      {/* Header: Logo + Collapse Toggle */}
      <div className={`h-14 flex items-center border-b shrink-0 ${collapsed ? "justify-center px-0" : "justify-between px-4"}`}>
        {!collapsed && (
          <span className="text-sm font-bold tracking-tight whitespace-nowrap overflow-hidden">
            PowerAI
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background transition-all duration-200"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed
            ? <PanelLeftOpen className="h-4 w-4" />
            : <PanelLeftClose className="h-4 w-4" />
          }
        </button>
      </div>

      {/* New Dashboard Button */}
      <div className={`p-2 shrink-0 ${collapsed ? "flex justify-center" : ""}`}>
        {collapsed ? (
          <button
            onClick={onNewDashboard}
            title="New Dashboard"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 shrink-0"
          >
            <Plus className="h-4 w-4" />
          </button>
        ) : (
          <Button size="sm" className="w-full justify-start gap-2" onClick={onNewDashboard}>
            <Plus className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap overflow-hidden">New Dashboard</span>
          </Button>
        )}
      </div>

      {/* Nav Items */}
      <nav className={`flex-1 px-2 py-1 flex flex-col gap-0.5 ${collapsed ? "items-center" : ""}`}>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            title={collapsed ? label : undefined}
            className={`
              flex items-center gap-2.5 rounded-lg text-sm transition-all duration-200 shrink-0
              ${collapsed ? "w-10 h-10 justify-center" : "w-full px-3 py-2.5 justify-start"}
              ${currentView === id
                ? "bg-background text-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background"
              }
            `}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && (
              <span className="whitespace-nowrap overflow-hidden transition-opacity duration-200">
                {label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Collapsed indicator line at bottom */}
      {collapsed && (
        <div className="h-1 w-6 mx-auto mb-3 rounded-full bg-border" />
      )}
    </div>
  );
};
