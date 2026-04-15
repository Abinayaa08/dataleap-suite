import { useState, useRef, useEffect } from "react";
import { X, Send, Mic, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import type { UploadedFile } from "@/pages/AppPage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AssistantPanelProps {
  files: UploadedFile[];
  onClose: () => void;
}

export const AssistantPanel = ({ files, onClose }: AssistantPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I can help you " },
  ]);
  const [input, setInput] = useState("");
  const [showFiles, setShowFiles] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (value: string) => {
    setInput(value);
    setShowFiles(value.includes("@"));
  };

  const selectFile = (fileName: string) => {
    setInput((prev) => prev.replace(/@\S*$/, `@${fileName} `));
    setShowFiles(false);
  };

  const buildDataContext = (): string => {
    if (files.length === 0) return "No data uploaded yet.";
    
    const parts: string[] = [];
    files.forEach((f) => {
      parts.push(`File: ${f.name}`);
      parts.push(`Columns: ${f.columns.join(", ")}`);
      if (f.data && f.data.length > 0) {
        const header = f.columns.join(" | ");
        parts.push(header);
        // Include all data rows (or limit for very large datasets)
        const rows = f.data.slice(0, 50).map((r) => r.join(" | "));
        parts.push(rows.join("\n"));
        
        // Add basic stats for numeric columns
        f.columns.forEach((col, idx) => {
          const values = f.data!.map((r) => Number(r[idx])).filter((n) => !isNaN(n));
          if (values.length > 0) {
            const sum = values.reduce((a, b) => a + b, 0);
            const avg = sum / values.length;
            const max = Math.max(...values);
            const min = Math.min(...values);
            parts.push(`${col} stats: min=${min}, max=${max}, avg=${avg.toFixed(2)}, total=${sum.toFixed(2)}`);
          }
        });
      }
    });
    return parts.join("\n");
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    const question = input;
    setInput("");
    setShowFiles(false);
    setLoading(true);

    try {
      const dataContext = buildDataContext();
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, dataContext }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Sorry, I couldn't process that request. ${err.message || "Please try again."}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 border-l flex flex-col bg-card shrink-0 max-[480px]:w-full max-[480px]:fixed max-[480px]:inset-0 max-[480px]:z-50">
      <div className="h-12 flex items-center px-3 border-b shrink-0">
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 mr-2 hidden max-[480px]:flex">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium flex-1">Assistant</span>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 text-muted-foreground hover:text-foreground flex max-[480px]:hidden">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`text-sm ${msg.role === "user" ? "text-right" : ""}`}>
            <div
              className={`inline-block px-3 py-2 rounded-lg max-w-[90%] whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-foreground text-background"
                  : "bg-secondary text-foreground"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-sm">
            <div className="inline-block px-3 py-2 rounded-lg bg-secondary text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showFiles && files.length > 0 && (
        <div className="border-t p-2 space-y-1">
          {files.map((f) => (
            <button
              key={f.name}
              onClick={() => selectFile(f.name)}
              className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-secondary transition-colors truncate"
            >
              @{f.name}
            </button>
          ))}
        </div>
      )}

      <div className="border-t p-3 flex gap-2 shrink-0">
        <Input
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about your data..."
          className="text-sm h-9"
          disabled={loading}
        />
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
          <Mic className="h-4 w-4" />
        </Button>
        <Button size="icon" onClick={handleSend} className="h-9 w-9 shrink-0" disabled={loading}>
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
