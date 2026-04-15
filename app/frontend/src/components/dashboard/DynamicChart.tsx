import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ChartConfig } from "@/lib/aggregation";

interface DynamicChartProps {
  config: ChartConfig;
  data: { name: string; value: number }[];
}

export const DynamicChart = ({ config, data }: DynamicChartProps) => {
  const mainColor = "hsl(var(--chart-bar))";
  const mutedColor = "hsl(var(--chart-muted))";
  const lineColor = "hsl(var(--chart-line))";
  const colors = [mainColor, mutedColor, "hsl(var(--chart-bar) / 0.8)", "hsl(var(--chart-muted) / 0.8)"];

  const tooltipStyle = {
    contentStyle: {
      borderRadius: "8px",
      border: "1px solid hsl(var(--border))",
      backgroundColor: "hsl(var(--card))",
      color: "hsl(var(--card-foreground))",
    },
    itemStyle: { color: "hsl(var(--foreground))" },
    labelStyle: { color: "hsl(var(--foreground))" },
  };

  const renderChartType = () => {
    switch (config.type) {
      case "bar":
        return (
          <BarChart data={data}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="value" fill={mainColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case "horizontal_bar":
        return (
          <BarChart data={data} layout="vertical">
            <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} width={80} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="value" fill={mainColor} radius={[0, 4, 4, 0]} />
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={data}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip {...tooltipStyle} />
            <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2} dot={false} />
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={data}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip {...tooltipStyle} />
            <Area type="monotone" dataKey="value" fill={mutedColor} stroke={lineColor} />
          </AreaChart>
        );
      case "donut":
      case "pie":
        return (
          <PieChart>
            <Tooltip {...tooltipStyle} />
            <Legend />
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        );
      case "scatter":
        return (
          <ScatterChart>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="value" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip {...tooltipStyle} cursor={{ strokeDasharray: "3 3" }} />
            <Scatter name={config.title} data={data} fill={mainColor} />
          </ScatterChart>
        );
      case "funnel":
        return (
          <BarChart data={data} layout="vertical" barCategoryGap="10%">
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} width={80} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="value" fill={mainColor} radius={[0, 4, 4, 0]} />
          </BarChart>
        );
      default:
        return (
          <BarChart data={data}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="value" fill={mainColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  const colSpanClass = config.width === "full" ? "min-[1025px]:col-span-2" : "min-[1025px]:col-span-1";
  const rowSpanClass = config.height === "medium" ? "row-span-2" : "row-span-1";

  return (
    <div className={`bg-card border border-[0.5px] rounded-xl shadow-sm p-4 flex flex-col w-full min-[481px]:min-h-[280px] max-[480px]:min-h-[240px] col-span-1 ${colSpanClass} ${rowSpanClass}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-sm">{config.title}</h3>
          <p className="text-xs text-muted-foreground mr-2">
            {(config.aggregation || "").toUpperCase()} of {config.y_column} by {config.x_column}
          </p>
        </div>
      </div>
      <div className="flex-1 min-h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChartType()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
