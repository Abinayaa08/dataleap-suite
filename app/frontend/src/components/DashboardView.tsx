import { useState, useMemo, useRef } from "react";
import type { UploadedFile } from "@/pages/AppPage";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DynamicChart } from "@/components/dashboard/DynamicChart";
import { Button } from "@/components/ui/button";
import { Download, FileText, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { aggregateData, computeKpi } from "@/lib/aggregation";
import type { DownloadRecord } from "@/components/DownloadsView";

interface DashboardViewProps {
  files: UploadedFile[];
  projectName: string;
  onExport: (record: DownloadRecord) => void;
}

export const DashboardView = ({ files, projectName, onExport }: DashboardViewProps) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const file = files.find((f) => f.dashboard_config) || files[0];
  const config = file?.dashboard_config;
  const rawData = file?.data || [];
  const columns = file?.columns || [];

  /* ── CSV Export ── */
  const handleExportCSV = () => {
    if (rawData.length === 0) return;
    const header = columns.join(",");
    const rows = rawData.map((r) => r.join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const fileName = `${projectName}_${Date.now()}.csv`;
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);

    const sizeBytes = new Blob([csv]).size;
    onExport({
      name: fileName,
      size: sizeBytes,
      exportedAt: new Date().toISOString(),
      projectName,
      type: "csv",
      csvContent: csv,
    });
    setExportMenuOpen(false);
    toast.success("Data exported as CSV");
  };

  /* ── PDF Export ── */
  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank", "width=1200,height=900");
    if (!printWindow || !dashboardRef.current) return;

    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules).map((r) => r.cssText).join("\n");
        } catch {
          return "";
        }
      })
      .join("\n");

    const isDark = document.documentElement.classList.contains("dark");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html class="${isDark ? "dark" : ""}">
      <head>
        <meta charset="UTF-8" />
        <title>${projectName} — Dashboard</title>
        <style>
          ${styles}
          @page { margin: 16mm; }
          body {
            background: ${isDark ? "#141413" : "#F7F6F3"};
            color: ${isDark ? "#F1EFE8" : "#2C2C2A"};
            font-family: Inter, -apple-system, sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print { display: none !important; }
          .print-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid ${isDark ? "#333331" : "#E2E0D8"};
            color: ${isDark ? "#F1EFE8" : "#2C2C2A"};
          }
        </style>
      </head>
      <body>
        <div class="print-title">${projectName} Dashboard</div>
        ${dashboardRef.current.innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 600);

    const fileName = `${projectName}_dashboard_${Date.now()}.pdf`;
    onExport({
      name: fileName,
      size: 0,
      exportedAt: new Date().toISOString(),
      projectName,
      type: "pdf",
      csvContent: "",
    });
    setExportMenuOpen(false);
    toast.success("Dashboard opened for PDF export");
  };

  if (!config) {
    return (
      <div className="h-full flex items-center justify-center p-4 text-muted-foreground flex-col gap-2">
        <p>No dashboard configuration available.</p>
        <p className="text-sm">Please upload a valid dataset.</p>
      </div>
    );
  }

  const kpis = config.kpis || [];
  const charts = config.charts || [];
  const filtersConfig = config.filters || [];

  const setFilterValue = (column: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [column]: value }));
  };

  const uniqueFilterValues = useMemo(() => {
    const vals: Record<string, string[]> = {};
    filtersConfig.forEach((f: any) => {
      const idx = columns.indexOf(f.column);
      if (idx !== -1) {
        const unique = Array.from(new Set(rawData.map((r) => String(r[idx]))));
        vals[f.column] = unique.filter((v) => v !== "" && v !== "null" && v !== "undefined").slice(0, 10);
      }
    });
    return vals;
  }, [filtersConfig, columns, rawData]);

  return (
    <div ref={dashboardRef} className="h-full flex flex-col p-4 gap-4 bg-background/50 overflow-auto">

      {/* Project name heading */}
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-base font-bold tracking-tight truncate">{projectName}</h1>
      </div>

      {/* Filters + Export */}
      <div className="flex flex-col min-[481px]:flex-row min-[481px]:items-start justify-between gap-3 shrink-0">
        <div className="flex flex-col gap-2 w-full min-w-0">
          {filtersConfig.map((f: any) => (
            <div key={f.column} className="flex items-center gap-1.5 w-full">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0 w-20">
                {f.label}:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 pb-1">
                <button
                  onClick={() => setFilterValue(f.column, "all")}
                  className={`px-3 py-1 text-xs max-[480px]:text-[13px] rounded-full transition-colors whitespace-nowrap border shrink-0 ${
                    !activeFilters[f.column] || activeFilters[f.column] === "all"
                      ? "bg-foreground text-background border-foreground shadow-sm"
                      : "bg-card text-muted-foreground hover:border-foreground/50 border-[#D3D1C7] dark:border-[#333331]"
                  }`}
                >
                  All
                </button>
                {(uniqueFilterValues[f.column] || []).map((val) => (
                  <button
                    key={val}
                    onClick={() => setFilterValue(f.column, val)}
                    className={`px-3 py-1 text-xs max-[480px]:text-[13px] rounded-full transition-colors whitespace-nowrap border shrink-0 ${
                      activeFilters[f.column] === val
                        ? "bg-foreground text-background border-foreground shadow-sm"
                        : "bg-card text-muted-foreground hover:border-foreground/50 border-[#D3D1C7] dark:border-[#333331]"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Export dropdown */}
        <div className="relative shrink-0 max-[480px]:self-start min-[481px]:self-end no-print">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportMenuOpen((o) => !o)}
            className="border-[#D3D1C7] text-[#2C2C2A] dark:border-[#333331] dark:text-[#F1EFE8] gap-1"
          >
            <Download className="h-3.5 w-3.5" />
            Export
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${exportMenuOpen ? "rotate-180" : ""}`} />
          </Button>
          {exportMenuOpen && (
            <>
              {/* click-away backdrop */}
              <div className="fixed inset-0 z-10" onClick={() => setExportMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 z-20 bg-card border border-[#E2E0D8] dark:border-[#333331] rounded-lg shadow-lg overflow-hidden min-w-[140px]">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm hover:bg-secondary transition-colors"
                >
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Export as CSV
                </button>
                <div className="h-px bg-border" />
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm hover:bg-secondary transition-colors"
                >
                  <Download className="h-4 w-4 text-muted-foreground" />
                  Export as PDF
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* KPIs */}
      {kpis.length > 0 && (
        <div className="grid grid-cols-1 min-[481px]:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
          {kpis.map((kpi: any, idx: number) => {
            const val = computeKpi(rawData, columns, kpi, activeFilters);
            let displayVal = val.toLocaleString();
            if (kpi.format === "currency") displayVal = `$${val.toLocaleString()}`;
            if (kpi.format === "percentage") displayVal = `${val}%`;
            return <KpiCard key={idx} label={kpi.label} value={displayVal} />;
          })}
        </div>
      )}

      {/* Charts grid */}
      {charts.length > 0 && (
        <div className="flex-1 min-h-0 grid grid-cols-1 min-[1025px]:grid-cols-2 gap-3 pb-2">
          {charts.map((chart: any, i: number) => {
            const chartData = aggregateData(rawData, columns, chart, activeFilters);
            return (
              <DynamicChart
                key={chart.id || `chart-${i}`}
                config={chart}
                data={chartData}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
