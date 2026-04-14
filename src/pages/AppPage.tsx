import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { AppSidebar } from "@/components/AppSidebar";
import { AppTopBar } from "@/components/AppTopBar";
import { EmptyState } from "@/components/EmptyState";
import { FileUploadModal } from "@/components/FileUploadModal";
import { DashboardView } from "@/components/DashboardView";
import { AssistantPanel } from "@/components/AssistantPanel";

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  data: any[][] | null;
  columns: string[];
}

const AppPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [hasDashboard, setHasDashboard] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState<string>("dashboards");
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) navigate("/login");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) navigate("/login");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleFilesUploaded = (uploadedFiles: UploadedFile[]) => {
    setFiles(uploadedFiles);
    setHasDashboard(true);
    setShowUpload(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <AppSidebar currentView={sidebarView} onViewChange={setSidebarView} onNewDashboard={() => setShowUpload(true)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AppTopBar user={user} onToggleAssistant={() => setAssistantOpen(!assistantOpen)} />
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-auto">
            {!hasDashboard ? (
              <EmptyState onCreateNew={() => setShowUpload(true)} />
            ) : (
              <DashboardView files={files} />
            )}
          </main>
          {assistantOpen && (
            <AssistantPanel files={files} onClose={() => setAssistantOpen(false)} />
          )}
        </div>
      </div>
      {showUpload && (
        <FileUploadModal onClose={() => setShowUpload(false)} onFilesUploaded={handleFilesUploaded} />
      )}
    </div>
  );
};

export default AppPage;
