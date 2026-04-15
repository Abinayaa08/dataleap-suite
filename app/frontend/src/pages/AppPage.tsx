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
import { SavedFilesView } from "@/components/SavedFilesView";
import { DownloadsView } from "@/components/DownloadsView";
import type { DownloadRecord } from "@/components/DownloadsView";

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  data: any[][] | null;
  columns: string[];
  schema_analysis?: any;
  dashboard_config?: any;
}

/** A project groups a name, its uploaded files, and when it was created. */
export interface Project {
  id: string;
  name: string;
  files: UploadedFile[];
  createdAt: string;
}

const AppPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState<string>("dashboards");
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);

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

    const saved = localStorage.getItem("PowerAI-dark-mode");
    if (saved === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    return () => subscription.unsubscribe();
  }, [navigate]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("PowerAI-dark-mode", String(next));
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleFilesUploaded = (projectName: string, uploadedFiles: UploadedFile[]) => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: projectName,
      files: uploadedFiles,
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    setShowUpload(false);
    setSidebarView("dashboards");
    setMobileMenuOpen(false);
  };

  const handleExport = (record: DownloadRecord) => {
    setDownloads((prev) => [record, ...prev]);
  };

  const activeProject = projects.find((p) => p.id === activeProjectId) ?? projects[0] ?? null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const renderMainContent = () => {
    switch (sidebarView) {
      case "files":
        return (
          <SavedFilesView
            projects={projects}
            onOpenProject={(id) => {
              setActiveProjectId(id);
              setSidebarView("dashboards");
            }}
          />
        );
      case "downloads":
        return <DownloadsView downloads={downloads} />;
      case "settings":
        return (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p>Settings coming soon.</p>
          </div>
        );
      case "dashboards":
      default:
        return !activeProject ? (
          <EmptyState onCreateNew={() => setShowUpload(true)} />
        ) : (
          <DashboardView
            files={activeProject.files}
            projectName={activeProject.name}
            onExport={handleExport}
          />
        );
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <AppSidebar
        currentView={sidebarView}
        onViewChange={(v) => { setSidebarView(v); setMobileMenuOpen(false); }}
        onNewDashboard={() => { setShowUpload(true); setMobileMenuOpen(false); }}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AppTopBar
          user={user}
          onToggleAssistant={() => setAssistantOpen(!assistantOpen)}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-auto">
            {renderMainContent()}
          </main>
          {assistantOpen && (
            <AssistantPanel
              files={activeProject?.files ?? []}
              onClose={() => setAssistantOpen(false)}
            />
          )}
        </div>
      </div>
      {showUpload && (
        <FileUploadModal
          onClose={() => setShowUpload(false)}
          onFilesUploaded={handleFilesUploaded}
        />
      )}
    </div>
  );
};

export default AppPage;
