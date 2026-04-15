import { useState, useCallback } from "react";
import { X, Upload, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UploadedFile } from "@/pages/AppPage";

interface FileUploadModalProps {
  onClose: () => void;
  onFilesUploaded: (files: UploadedFile[]) => void;
}

export const FileUploadModal = ({ onClose, onFilesUploaded }: FileUploadModalProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

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

  const processFiles = async () => {
    setProcessing(true);
    const processed: UploadedFile[] = [];

    for (const file of files) {
      if (file.name.endsWith(".csv")) {
        const text = await file.text();
        const lines = text.split("\n").map((l) => l.split(",").map((c) => c.trim()));
        const columns = lines[0] || [];
        const data = lines.slice(1).filter((r) => r.length > 1);
        processed.push({ name: file.name, size: file.size, type: file.type, data, columns });
      } else {
        // For non-CSV, create mock structured data
        processed.push({
          name: file.name,
          size: file.size,
          type: file.type,
          data: generateSampleData(),
          columns: ["Month", "Revenue", "Users", "Conversion", "Growth"],
        });
      }
    }

    if (processed.length === 0) {
      processed.push({
        name: "sample_data.csv",
        size: 1024,
        type: "text/csv",
        data: generateSampleData(),
        columns: ["Month", "Revenue", "Users", "Conversion", "Growth"],
      });
    }

    onFilesUploaded(processed);
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/20 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background border rounded-lg w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Upload Files</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded border text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)}KB</span>
                  <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
          )}

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? "border-foreground bg-secondary" : "border-border"
            }`}
          >
            <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">Drag and drop files here</p>
            <p className="text-xs text-muted-foreground mb-3">Excel, CSV, PDF, Images, Text</p>
            <label>
              <input type="file" multiple accept=".csv,.xlsx,.xls,.pdf,.png,.jpg,.jpeg,.txt" onChange={handleFileSelect} className="hidden" />
              <span className="text-sm text-foreground underline cursor-pointer">Browse files</span>
            </label>
          </div>

          <Button className="w-full" onClick={processFiles} disabled={processing}>
            {processing ? "Processing..." : files.length > 0 ? `Generate Dashboard (${files.length} files)` : "Use Sample Data"}
          </Button>
        </div>
      </div>
    </div>
  );
};

function generateSampleData(): any[][] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((m) => [
    m,
    String(Math.floor(Math.random() * 50000 + 30000)),
    String(Math.floor(Math.random() * 3000 + 1000)),
    String((Math.random() * 5 + 2).toFixed(1)),
    String((Math.random() * 30 - 5).toFixed(1)),
  ]);
}
