interface DataTableWidgetProps {
  data: any[][];
  columns: string[];
}

export const DataTableWidget = ({ data, columns }: DataTableWidgetProps) => {
  return (
    <div className="border rounded-lg p-4 bg-background flex flex-col">
      <p className="text-xs text-muted-foreground mb-2">Data Table</p>
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b">
              {columns.map((col) => (
                <th key={col} className="text-left py-1.5 px-2 font-medium text-muted-foreground">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-secondary/50 transition-colors">
                {row.map((cell: any, j: number) => (
                  <td key={j} className="py-1.5 px-2">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
