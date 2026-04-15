import { useState, useMemo, useRef } from "react";
import type { UploadedFile } from "@/pages/AppPage";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DynamicChart } from "@/components/dashboard/DynamicChart";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { aggregateData, computeKpi } from "@/lib/aggregation";
import type { DownloadRecord } from "@/components/DownloadsView";

interface DashboardViewProps {
  files: UploadedFile[];
  onExport: (record: DownloadRecord) => void;
}

export const DashboardView = ({ files, onExport }: DashboardViewProps) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const dashboardRef = useRef<HTMLDivElement>(null);

  const file = files.find((f) => f.dashboard_config) || files[0];
  const config = file?.dashboard_config;
  const rawData = file?.data || [];
  const columns = file?.columns || [];

  const handleExportCSV = () => {
    if (rawData.length === 0) return;
    const header = columns.join(",");
    const rows = rawData.map((r) => r.join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const fileName = `exported_data_${Date.now()}.csv`;
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);

    // Report to parent so Downloads view can track it
    const sizeBytes = new Blob([csv]).size;
    onExport({
      name: fileName,
      size: sizeBytes,
      exportedAt: new Date().toISOString(),
      csvContent: csv,
    });

    toast.success("Data exported as CSV");
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
    setActiveFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
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
        <Button variant="outline" size="sm" onClick={handleExportCSV} className="shrink-0 max-[480px]:self-start min-[481px]:self-end border-[#D3D1C7] text-[#2C2C2A] dark:border-[#333331] dark:text-[#F1EFE8]">
          <Download className="h-3.5 w-3.5 mr-1" /> Export Data
        </Button>
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
