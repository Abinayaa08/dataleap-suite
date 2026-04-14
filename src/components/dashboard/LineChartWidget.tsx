import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface LineChartWidgetProps {
  data: any[][];
}

export const LineChartWidget = ({ data }: LineChartWidgetProps) => {
  const chartData = data.map((r) => ({ name: r[0], users: Number(r[2]) }));

  return (
    <div className="border rounded-lg p-4 bg-background flex flex-col">
      <p className="text-xs text-muted-foreground mb-2">Users Over Time</p>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(0 0% 60%)" />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(0 0% 60%)" />
            <Tooltip contentStyle={{ fontSize: 12, border: "1px solid hsl(0 0% 90%)", borderRadius: 6 }} />
            <Line type="monotone" dataKey="users" stroke="hsl(0 0% 20%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(0 0% 20%)" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
