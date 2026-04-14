import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface BarChartWidgetProps {
  data: any[][];
}

export const BarChartWidget = ({ data }: BarChartWidgetProps) => {
  const chartData = data.map((r) => ({ name: r[0], revenue: Number(r[1]) }));

  return (
    <div className="border rounded-lg p-4 bg-background flex flex-col">
      <p className="text-xs text-muted-foreground mb-2">Revenue by Period</p>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(0 0% 60%)" />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(0 0% 60%)" />
            <Tooltip contentStyle={{ fontSize: 12, border: "1px solid hsl(0 0% 90%)", borderRadius: 6 }} />
            <Bar dataKey="revenue" fill="hsl(0 0% 20%)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
