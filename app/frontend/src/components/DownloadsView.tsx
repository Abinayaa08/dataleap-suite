import { Download, FileDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DownloadRecord {
  name: string;
  size: number;
  exportedAt: string;
  projectName: string;
  type: "csv" | "pdf";
  csvContent: string;
}

interface DownloadsViewProps {
  downloads: DownloadRecord[];
}

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

const formatSize = (bytes: number) => {
  if (bytes === 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const reDownloadCSV = (record: DownloadRecord) => {
  if (!record.csvContent) return;
  const blob = new Blob([record.csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = record.name;
  a.click();
  URL.revokeObjectURL(url);
};

/* Group downloads by projectName */
const groupByProject = (downloads: DownloadRecord[]) => {
  const map: Record<string, DownloadRecord[]> = {};
  downloads.forEach((d) => {
    if (!map[d.projectName]) map[d.projectName] = [];
    map[d.projectName].push(d);
  });
  return map;
};

export const DownloadsView = ({ downloads }: DownloadsViewProps) => {
  if (downloads.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
          <Download className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">No downloads yet</h3>
          <p className="text-sm text-muted-foreground">
            When you export a dashboard as CSV or PDF, your files will appear here.
          </p>
        </div>
      </div>
    );
  }

  const grouped = groupByProject(downloads);

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight">Downloads</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {downloads.length} export{downloads.length !== 1 ? "s" : ""} across {Object.keys(grouped).length} project{Object.keys(grouped).length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([projectName, records]) => (
          <div key={projectName} className="space-y-2">
            {/* Project header */}
            <div className="flex items-center gap-2">
              <FileDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">{projectName}</span>
              <span className="text-xs text-muted-foreground">
                · {records.length} export{records.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Exports under this project */}
            <div className="space-y-2 pl-6 border-l-2 border-border">
              {records.map((record, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-card border border-border/60 rounded-xl hover:border-foreground/30 hover:shadow-sm transition-all group"
                >
                  {/* Type icon */}
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    {record.type === "pdf"
                      ? <FileText className="h-5 w-5 text-muted-foreground" />
                      : <FileDown className="h-5 w-5 text-muted-foreground" />
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{record.name}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                        record.type === "pdf"
                          ? "bg-foreground/10 text-foreground"
                          : "bg-foreground/10 text-foreground"
                      }`}>
                        {record.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Exported {formatTime(record.exportedAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <p className="text-xs font-medium text-muted-foreground">{formatSize(record.size)}</p>
                    {record.type === "csv" && record.csvContent && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => reDownloadCSV(record)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 gap-1.5 text-xs font-medium border-[#D3D1C7] dark:border-[#333331]"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Re-download
                      </Button>
                    )}
                    {record.type === "pdf" && (
                      <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        Re-print via Export button
                      </span>
                    )}
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
