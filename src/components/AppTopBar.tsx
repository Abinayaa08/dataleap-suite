import { MessageSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

interface AppTopBarProps {
  user: User | null;
  onToggleAssistant: () => void;
}

export const AppTopBar = ({ user, onToggleAssistant }: AppTopBarProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="h-14 border-b flex items-center justify-between px-4 shrink-0">
      <div />
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToggleAssistant}>
          <MessageSquare className="h-4 w-4 mr-1" /> Assistant
        </Button>
        <div className="flex items-center gap-2 pl-2 border-l">
          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="h-7 w-7">
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
