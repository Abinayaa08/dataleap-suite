import { FolderOpen, FileText, BarChart2, ExternalLink } from "lucide-react";
import type { Project } from "@/pages/AppPage";

interface SavedFilesViewProps {
  projects: Project[];
  onOpenProject: (projectId: string) => void;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const SavedFilesView = ({ projects, onOpenProject }: SavedFilesViewProps) => {
  const totalFiles = projects.reduce((acc, p) => acc + p.files.length, 0);

  if (projects.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">No saved files yet</h3>
          <p className="text-sm text-muted-foreground">
            Create a project to upload datasets. They will appear here grouped by project.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight">Saved Files</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {projects.length} project{projects.length !== 1 ? "s" : ""} · {totalFiles} file{totalFiles !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.id} className="space-y-2">
            {/* Project header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">{project.name}</span>
                <span className="text-xs text-muted-foreground">
                  · {formatTime(project.createdAt)}
                </span>
              </div>
              <button
                onClick={() => onOpenProject(project.id)}
                className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Open Dashboard <ExternalLink className="h-3 w-3" />
              </button>
            </div>

            {/* Files under this project */}
            <div className="space-y-2 pl-6 border-l-2 border-border">
              {project.files.map((file, i) => (
                <div
                  key={i}
                  onClick={() => onOpenProject(project.id)}
                  className="flex items-center gap-4 p-4 bg-card border border-border/60 rounded-xl hover:border-foreground/30 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    {file.name.endsWith(".xlsx") || file.name.endsWith(".xls")
                      ? <BarChart2 className="h-5 w-5 text-muted-foreground" />
                      : <FileText className="h-5 w-5 text-muted-foreground" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate group-hover:text-foreground transition-colors">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {file.columns?.length ?? 0} columns · {file.data?.length ?? 0} rows
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-muted-foreground">{formatSize(file.size)}</p>
                    <p className="text-xs font-semibold mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-foreground">
                      View →
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
