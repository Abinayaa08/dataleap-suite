import { useState, useCallback } from "react";
import { X, Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UploadedFile } from "@/pages/AppPage";
import { supabase } from "@/integrations/supabase/client";
import * as xlsx from "xlsx";

interface FileUploadModalProps {
  onClose: () => void;
  onFilesUploaded: (projectName: string, files: UploadedFile[]) => void;
}

export const FileUploadModal = ({ onClose, onFilesUploaded }: FileUploadModalProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [projectName, setProjectName] = useState("");
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
          mean: nums.reduce((a, b) => a + b, 0) / nums.length,
        };
      } else {
        cardinality[col] = new Set(values).size;
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
          const ws = wb.Sheets[wb.SheetNames[0]];
          const parsedData = xlsx.utils.sheet_to_json(ws, { header: 1 }) as any[][];
          if (parsedData.length > 0) {
            columns = parsedData[0].map(String);
            data = parsedData.slice(1).filter((r) => r.length > 0);
          }
        }
      } else {
        setStatusText("Loading sample dataset...");
        const res = await fetch("/sample_sales_dataset.xlsx");
        if (!res.ok) throw new Error("Failed to load sample dataset");
        const actBuffer = await res.arrayBuffer();
        const wb = xlsx.read(actBuffer, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const parsedData = xlsx.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        if (parsedData.length > 0) {
          columns = parsedData[0].map(String);
          data = parsedData.slice(1).filter((r) => r.length > 0);
        }
        name = "sample_sales_dataset.xlsx";
        size = Number(res.headers.get("content-length")) || 5441;
        type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      }

      // Derive a default project name from the filename if user left it blank
      const resolvedProjectName = projectName.trim() || name.replace(/\.(csv|xlsx|xls)$/i, "");

      let schemaAnalysis: any = null;
      let dashboardConfig: any = null;

      if (file) {
        setStatusText("Analyzing schema with AI...");
        const schemaPayload = extractSchemaPayload(columns, data);
        const schemaRes = await fetch("http://localhost:5000/api/ai/schema-analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(schemaPayload),
        });
        if (!schemaRes.ok) throw new Error("Failed to analyze schema");
        schemaAnalysis = await schemaRes.json();

        setStatusText("Generating Dashboard Layout...");
        const configRes = await fetch("http://localhost:5000/api/ai/dashboard-config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(schemaAnalysis),
        });
        if (!configRes.ok) throw new Error("Failed to generate config");
        dashboardConfig = await configRes.json();
      } else {
        schemaAnalysis = extractSchemaPayload(columns, data);
        dashboardConfig = {
          kpis: [
            { label: "Total Sales", aggregation: "sum", column: "Sales", format: "currency" },
            { label: "Total Profit", aggregation: "sum", column: "Profit", format: "currency" },
            { label: "Avg Quantity", aggregation: "avg", column: "Quantity", format: "number" },
          ],
          charts: [
            { id: "c1", type: "bar",  title: "Sales by Region",    aggregation: "sum", y_column: "Sales",    x_column: "Region",   color_scheme: "warm" },
            { id: "c2", type: "line", title: "Profit over Time",   aggregation: "sum", y_column: "Profit",   x_column: "Date",     color_scheme: "warm" },
            { id: "c3", type: "pie",  title: "Sales by Category",  aggregation: "sum", y_column: "Sales",    x_column: "Category", color_scheme: "warm" },
            { id: "c4", type: "bar",  title: "Quantity by Product", aggregation: "sum", y_column: "Quantity", x_column: "Product",  color_scheme: "warm" },
          ],
          filters: [
            { column: "Region",   label: "Region" },
            { column: "Category", label: "Category" },
            { column: "Product",  label: "Product" },
          ],
        };
      }

      setStatusText("Saving to database...");
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user) {
        await supabase.from("dashboards").insert([{
          user_id: sessionData.session.user.id,
          title: resolvedProjectName,
          layout_config: dashboardConfig,
        }]);
      }

      processed.push({ name, size, type, data, columns, schema_analysis: schemaAnalysis, dashboard_config: dashboardConfig });
      onFilesUploaded(resolvedProjectName, processed);
    } catch (err) {
      console.error(err);
      alert("AI layout generation failed. Please ensure AI routes are running on localhost:5000");
      setProcessing(false);
      setStatusText("");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/20 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border rounded-xl w-full max-w-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-base">New Dashboard</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7" disabled={processing}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-5 space-y-4">
          {/* ── Drag-and-drop zone ── */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              dragOver ? "border-foreground bg-foreground/5" : "border-border hover:bg-secondary/50"
            } ${processing ? "opacity-50 pointer-events-none" : ""}`}
          >
            <Upload className={`h-8 w-8 mx-auto mb-3 ${dragOver ? "text-foreground" : "text-muted-foreground"}`} />
            <p className="text-sm font-medium mb-1">Drag & drop a file here</p>
            <p className="text-xs text-muted-foreground mb-4">CSV, XLSX or XLS — or use the sample dataset</p>
            <label>
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileSelect}
                className="hidden"
                disabled={processing}
              />
              <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md cursor-pointer">
                Browse Files
              </span>
            </label>
          </div>

          {/* Attached files list */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg border text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="flex-1 truncate font-medium">{file.name}</span>
                  <span className="text-xs text-muted-foreground mr-2">{(file.size / 1024).toFixed(0)} KB</span>
                  <button
                    onClick={() => removeFile(i)}
                    className="text-muted-foreground hover:text-foreground"
                    disabled={processing}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── Project name ── */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Project Name
            </label>
            <Input
              id="project-name-input"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !processing && processFiles()}
              className="h-9 text-sm"
              disabled={processing}
            />
          </div>

          {/* ── Generate button ── */}
          <Button
            className="w-full text-sm font-semibold h-11"
            onClick={processFiles}
            disabled={processing}
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2 w-full animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                {statusText}
              </span>
            ) : files.length > 0 ? "Generate Dashboard" : "Use Sample Demo Data"}
          </Button>
        </div>
      </div>
    </div>
  );
};
