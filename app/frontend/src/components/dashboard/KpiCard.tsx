interface KpiCardProps {
  label: string;
  value: string;
}

export const KpiCard = ({ label, value }: KpiCardProps) => (
  <div className="border border-[0.5px] rounded-lg p-4 bg-card">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-xl font-semibold mt-1">{value}</p>
  </div>
);
