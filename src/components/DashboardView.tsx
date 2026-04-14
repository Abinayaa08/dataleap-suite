import { useState, useMemo } from "react";
import type { UploadedFile } from "@/pages/AppPage";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { BarChartWidget } from "@/components/dashboard/BarChartWidget";
import { LineChartWidget } from "@/components/dashboard/LineChartWidget";
import { PieChartWidget } from "@/components/dashboard/PieChartWidget";
import { DataTableWidget } from "@/components/dashboard/DataTableWidget";

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

  return (
    <div className="h-full flex flex-col p-4 gap-4">
      {/* Filters */}
      <div className="flex items-center gap-1 overflow-x-auto shrink-0">
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
