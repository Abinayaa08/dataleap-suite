import { useState, useMemo, useRef } from "react";
import type { UploadedFile } from "@/pages/AppPage";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { BarChartWidget } from "@/components/dashboard/BarChartWidget";
import { LineChartWidget } from "@/components/dashboard/LineChartWidget";
import { PieChartWidget } from "@/components/dashboard/PieChartWidget";
import { DataTableWidget } from "@/components/dashboard/DataTableWidget";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

const quarters: Record<string, string[]> = {
  Q1: ["Jan", "Feb", "Mar"],
  Q2: ["Apr", "May", "Jun"],
  Q3: ["Jul", "Aug", "Sep"],
  Q4: ["Oct", "Nov", "Dec"],
};

interface DashboardViewProps {
  files: UploadedFile[];
}

export const DashboardView = ({ files }: DashboardViewProps) => {
  const [filter, setFilter] = useState<string>("all");
  const dashboardRef = useRef<HTMLDivElement>(null);

  const allData = useMemo(() => {
    const combined: any[][] = [];
    files.forEach((f) => { if (f.data) combined.push(...f.data); });
    return combined;
  }, [files]);

  const columns = files[0]?.columns || [];

  const filteredData = useMemo(() => {
    if (filter === "all") return allData;
    if (quarters[filter]) return allData.filter((row) => quarters[filter].includes(row[0]));
    return allData.filter((row) => row[0] === filter);
  }, [allData, filter]);

  const totalRevenue = filteredData.reduce((sum, r) => sum + Number(r[1] || 0), 0);
  const totalUsers = filteredData.reduce((sum, r) => sum + Number(r[2] || 0), 0);
  const avgConversion = filteredData.length
    ? (filteredData.reduce((sum, r) => sum + Number(r[3] || 0), 0) / filteredData.length).toFixed(1)
    : "0";
  const avgGrowth = filteredData.length
    ? (filteredData.reduce((sum, r) => sum + Number(r[4] || 0), 0) / filteredData.length).toFixed(1)
    : "0";

  const filterOptions = ["all", "Q1", "Q2", "Q3", "Q4", ...["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]];

  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    const header = columns.join(",");
    const rows = filteredData.map((r) => r.join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard-export-${filter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Dashboard exported as CSV");
  };

  return (
    <div ref={dashboardRef} className="h-full flex flex-col p-4 gap-4">
      {/* Filters + Export */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto flex-1">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs rounded-md transition-colors whitespace-nowrap ${
                filter === f ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={handleExportCSV} className="shrink-0">
          <Download className="h-3.5 w-3.5 mr-1" /> Export
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3 shrink-0">
        <KpiCard label="Revenue" value={`$${(totalRevenue / 1000).toFixed(0)}K`} />
        <KpiCard label="Users" value={totalUsers.toLocaleString()} />
        <KpiCard label="Conversion" value={`${avgConversion}%`} />
        <KpiCard label="Growth" value={`${avgGrowth}%`} />
      </div>

      {/* Charts grid */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3 min-h-0">
        <BarChartWidget data={filteredData} />
        <LineChartWidget data={filteredData} />
        <PieChartWidget data={filteredData} />
        <DataTableWidget data={filteredData} columns={columns} />
      </div>
    </div>
  );
};
