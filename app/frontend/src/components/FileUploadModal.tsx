import { useState, useCallback } from "react";
import { X, Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UploadedFile } from "@/pages/AppPage";
import { supabase } from "@/integrations/supabase/client";
import * as xlsx from "xlsx";

interface FileUploadModalProps {
  onClose: () => void;
  onFilesUploaded: (files: UploadedFile[]) => void;
}

export const FileUploadModal = ({ onClose, onFilesUploaded }: FileUploadModalProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const extractSchemaPayload = (columns: string[], data: any[][]) => {
    const sampleRows = data.slice(0, 20);
    const cardinality: Record<string, number> = {};
    const stats: Record<string, any> = {};
    const dtypes: Record<string, string> = {};

    columns.forEach((col, idx) => {
      const values = data.map((r) => r[idx]).filter((v) => v !== "" && v !== null && v !== undefined);
      
      const isNumeric = values.every((v) => !isNaN(Number(v)));
      if (isNumeric && values.length > 0) {
        dtypes[col] = "numeric";
        const nums = values.map(Number);
        stats[col] = {
          min: Math.min(...nums),
          max: Math.max(...nums),
          mean: nums.reduce((a, b) => a + b, 0) / nums.length
        };
      } else {
        const uniqueValues = new Set(values);
        cardinality[col] = uniqueValues.size;
        dtypes[col] = "categorical";
      }
    });

    return { columns, dtypes, sampleRows, cardinality, stats };
  };

  const processFiles = async () => {
    setProcessing(true);
    setStatusText("Parsing data...");
    
    try {
      const processed: UploadedFile[] = [];

      const file = files[0] || null;
      let data: any[][] = [];
      let columns: string[] = ["Month", "Revenue", "Users", "Conversion", "Growth"];
      let name = "sample_data.csv";
      let size = 1024;
      let type = "text/csv";

      if (file && (file.name.endsWith(".csv") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
        name = file.name;
        size = file.size;
        type = file.type;
        
        if (file.name.endsWith(".csv")) {
          const text = await file.text();
          const lines = text.split("\n").map((l) => l.split(",").map((c) => c.trim()));
          columns = lines[0] || columns;
          data = lines.slice(1).filter((r) => r.length > 1);
        } else {
          const buffer = await file.arrayBuffer();
          const wb = xlsx.read(buffer, { type: "array" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const parsedData = xlsx.utils.sheet_to_json(ws, { header: 1 }) as any[][];
          if (parsedData.length > 0) {
            columns = parsedData[0].map(String);
            data = parsedData.slice(1).filter((r) => r.length > 0);
          }
        }
      } else {
        setStatusText("Loading sample dataset...");
        const res = await fetch("/sample_sales_dataset.xlsx");
        if (!res.ok) throw new Error("Failed to load sample dataset from public folder");
        const actBuffer = await res.arrayBuffer();
        const wb = xlsx.read(actBuffer, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const parsedData = xlsx.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        if (parsedData.length > 0) {
          columns = parsedData[0].map(String);
          data = parsedData.slice(1).filter((r) => r.length > 0);
        }
        name = "sample_sales_dataset.xlsx";
        size = Number(res.headers.get("content-length")) || 5441;
        type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      }

      let schemaAnalysis: any = null;
      let dashboardConfig: any = null;

      if (file) {
        setStatusText("Analyzing schema with AI...");
        const schemaPayload = extractSchemaPayload(columns, data);
        
        const schemaRes = await fetch("http://localhost:5000/api/ai/schema-analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(schemaPayload)
        });
        if (!schemaRes.ok) throw new Error("Failed to analyze schema");
        schemaAnalysis = await schemaRes.json();

        setStatusText("Generating Dashboard Layout...");
        const configRes = await fetch("http://localhost:5000/api/ai/dashboard-config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(schemaAnalysis)
        });
        if (!configRes.ok) throw new Error("Failed to generate config");
        dashboardConfig = await configRes.json();
      } else {
        schemaAnalysis = extractSchemaPayload(columns, data);
        dashboardConfig = {
          kpis: [
            { label: "Total Sales", aggregation: "sum", column: "Sales", format: "currency" },
            { label: "Total Profit", aggregation: "sum", column: "Profit", format: "currency" },
            { label: "Avg Quantity", aggregation: "avg", column: "Quantity", format: "number" }
          ],
          charts: [
            { id: "c1", type: "bar", title: "Sales by Region", aggregation: "sum", y_column: "Sales", x_column: "Region", color_scheme: "emerald" },
            { id: "c2", type: "line", title: "Profit over Time", aggregation: "sum", y_column: "Profit", x_column: "Date", color_scheme: "emerald" },
            { id: "c3", type: "pie", title: "Sales by Category", aggregation: "sum", y_column: "Sales", x_column: "Category", color_scheme: "emerald" },
            { id: "c4", type: "bar", title: "Quantity by Product", aggregation: "sum", y_column: "Quantity", x_column: "Product", color_scheme: "emerald" }
          ],
          filters: [
            { column: "Region", label: "Region" },
            { column: "Category", label: "Category" },
            { column: "Product", label: "Product" }
          ]
        };
      }

      setStatusText("Saving to Database...");
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user) {
        const userId = sessionData.session.user.id;
        await supabase.from("dashboards").insert([{
          user_id: userId,
          title: name.replace(".csv", "") + " Dashboard",
          layout_config: dashboardConfig
        }]);
      }

      processed.push({
        name,
        size,
        type,
        data,
        columns,
        schema_analysis: schemaAnalysis,
        dashboard_config: dashboardConfig
      });

      onFilesUploaded(processed);
    } catch (err) {
      console.error(err);
      alert("AI layout generation failed. Please ensure AI routes are running on localhost:5000");
      setProcessing(false);
      setStatusText("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/20 flex flex-col items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-background border rounded-lg w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">Create Dynamic Dashboard</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7" disabled={processing}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-5 space-y-5">
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-secondary/50 rounded-md border text-sm">
                  <FileText className="h-4 w-4 text-foreground shrink-0" />
                  <span className="flex-1 truncate font-medium">{file.name}</span>
                  <span className="text-xs text-muted-foreground mr-2">{(file.size / 1024).toFixed(0)}KB</span>
                  <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-foreground" disabled={processing}><X className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
          )}

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ${
              dragOver ? "border-foreground bg-foreground/5" : "border-border hover:bg-secondary/50"
            } ${processing ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <Upload className={`h-10 w-10 mx-auto mb-4 ${dragOver ? 'text-foreground' : 'text-muted-foreground'}`} />
            <p className="text-sm font-medium mb-1">Drag and drop file here</p>
            <p className="text-xs text-muted-foreground mb-4">Upload a dataset to auto-generate a dashboard.</p>
            <label>
              <input type="file" accept=".csv, .xlsx, .xls" onChange={handleFileSelect} className="hidden" disabled={processing} />
              <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md cursor-pointer">
                Browse Files
              </span>
            </label>
          </div>

          <Button className="w-full text-sm font-semibold shadow-sm h-11" onClick={processFiles} disabled={processing}>
            {processing ? (
              <span className="flex items-center justify-center gap-2 w-full animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                {statusText}
              </span>
            ) : files.length > 0 ? "Generate Dashboard" : "Use Sample Demo Data"}
          </Button>
        </div>
      </div>
    </div>
  );
};


