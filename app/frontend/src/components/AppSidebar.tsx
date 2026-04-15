import { LayoutDashboard, FolderOpen, Download, Settings, Plus } from "lucide-react";
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
  return (
    <div className="w-56 border-r bg-surface flex flex-col shrink-0">
      <div className="h-14 flex items-center px-4 border-b">
        <span className="text-sm font-semibold tracking-tight">PowerAI</span>
      </div>
      <div className="p-3">
        <Button size="sm" className="w-full justify-start gap-2" onClick={onNewDashboard}>
          <Plus className="h-4 w-4" /> New Dashboard
        </Button>
      </div>
      <nav className="flex-1 px-2 py-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              currentView === id ? "bg-background text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-background"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
};
