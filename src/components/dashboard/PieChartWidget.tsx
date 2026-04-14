import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface PieChartWidgetProps {
  data: any[][];
}

const GRAYS = ["hsl(0,0%,15%)", "hsl(0,0%,30%)", "hsl(0,0%,45%)", "hsl(0,0%,60%)", "hsl(0,0%,75%)", "hsl(0,0%,85%)"];

export const PieChartWidget = ({ data }: PieChartWidgetProps) => {
  const chartData = data.slice(0, 6).map((r) => ({ name: r[0], value: Number(r[1]) }));

  return (
    <div className="border rounded-lg p-4 bg-background flex flex-col">
      <p className="text-xs text-muted-foreground mb-2">Revenue Distribution</p>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="70%" innerRadius="40%">
              {chartData.map((_, i) => (
                <Cell key={i} fill={GRAYS[i % GRAYS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ fontSize: 12, border: "1px solid hsl(0 0% 90%)", borderRadius: 6 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
