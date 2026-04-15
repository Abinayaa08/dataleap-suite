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
  ComposedChart,
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

const COLOR_SCHEMES: Record<string, string[]> = {
  emerald: ["hsl(var(--foreground))", "hsl(var(--foreground) / 0.8)", "hsl(var(--foreground) / 0.6)", "hsl(var(--foreground) / 0.4)", "hsl(var(--foreground) / 0.2)"],
  neutral: ["hsl(var(--foreground))", "hsl(var(--foreground) / 0.8)", "hsl(var(--foreground) / 0.6)", "hsl(var(--foreground) / 0.4)", "hsl(var(--foreground) / 0.2)"],
  warm: ["hsl(var(--foreground))", "hsl(var(--foreground) / 0.8)", "hsl(var(--foreground) / 0.6)", "hsl(var(--foreground) / 0.4)", "hsl(var(--foreground) / 0.2)"],
};

export const DynamicChart = ({ config, data }: DynamicChartProps) => {
  const colors = COLOR_SCHEMES[config.color_scheme] || COLOR_SCHEMES.emerald;
  const mainColor = colors[0];

  const renderChartType = () => {
    switch (config.type) {
      case "bar":
        return (
          <BarChart data={data}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
            />
            <Bar dataKey="value" fill={mainColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case "horizontal_bar":
        return (
          <BarChart data={data} layout="vertical">
            <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} width={80} />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
            />
            <Bar dataKey="value" fill={mainColor} radius={[0, 4, 4, 0]} />
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={data}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
            />
            <Line type="monotone" dataKey="value" stroke={mainColor} strokeWidth={2} dot={false} />
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={data}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
            />
            <Area type="monotone" dataKey="value" fill={colors[1]} stroke={mainColor} />
          </AreaChart>
        );
      case "donut":
      case "pie":
        return (
          <PieChart>
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
            />
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
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
              cursor={{ strokeDasharray: "3 3" }}
            />
            <Scatter name={config.title} data={data} fill={mainColor} />
          </ScatterChart>
        );
      case "funnel":
        // simple simulation since strictly funnel requires FunnelChart which isn't imported from raw root usually (it is part of recharts though)
        // using a horizontal bar chart disguised as funnel since standard recharts funnel can be flaky
        return (
          <BarChart data={data} layout="vertical" barCategoryGap="10%">
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} width={80} />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
            />
            <Bar dataKey="value" fill={mainColor} radius={[0, 4, 4, 0]} />
          </BarChart>
        );
      default:
        // fallback
        return (
          <BarChart data={data}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
            />
            <Bar dataKey="value" fill={mainColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  const colSpanClass = config.width === "full" ? "col-span-2" : "col-span-1";
  const rowSpanClass = config.height === "medium" ? "row-span-2" : "row-span-1";

  return (
    <div className={`bg-background border rounded-xl shadow-sm p-4 flex flex-col ${colSpanClass} ${rowSpanClass}`}>
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
