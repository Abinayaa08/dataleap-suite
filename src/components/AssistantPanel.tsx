import { useState, useRef, useEffect } from "react";
import { X, Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    { role: "assistant", content: "Hello! I can help you understand your data, explain patterns, and modify your dashboard. Try asking me something like \"Why is January revenue high?\" or type @ to reference specific files." },
  ]);
  const [input, setInput] = useState("");
  const [showFiles, setShowFiles] = useState(false);
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

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setShowFiles(false);

    // Generate a contextual response based on data
    setTimeout(() => {
      const response = generateResponse(input, files);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    }, 800);
  };

  return (
    <div className="w-80 border-l flex flex-col bg-background shrink-0">
      <div className="h-12 flex items-center justify-between px-3 border-b shrink-0">
        <span className="text-sm font-medium">Assistant</span>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`text-sm ${msg.role === "user" ? "text-right" : ""}`}>
            <div
              className={`inline-block px-3 py-2 rounded-lg max-w-[90%] ${
                msg.role === "user"
                  ? "bg-foreground text-background"
                  : "bg-secondary text-foreground"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* File selector */}
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
        />
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
          <Mic className="h-4 w-4" />
        </Button>
        <Button size="icon" onClick={handleSend} className="h-9 w-9 shrink-0">
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

function generateResponse(question: string, files: UploadedFile[]): string {
  const q = question.toLowerCase();
  const allData = files.flatMap((f) => f.data || []);

  if (allData.length === 0) return "No data loaded. Please upload files first.";

  const revenues = allData.map((r) => ({ month: r[0], value: Number(r[1]) }));
  const maxMonth = revenues.reduce((a, b) => (b.value > a.value ? b : a));
  const minMonth = revenues.reduce((a, b) => (b.value < a.value ? b : a));
  const totalRevenue = revenues.reduce((s, r) => s + r.value, 0);
  const avgRevenue = totalRevenue / revenues.length;

  if (q.includes("high") || q.includes("best") || q.includes("top")) {
    return `${maxMonth.month} had the highest revenue at $${maxMonth.value.toLocaleString()}.\n\nThis is ${((maxMonth.value / avgRevenue - 1) * 100).toFixed(0)}% above the average of $${avgRevenue.toFixed(0)}.\n\nPossible factors: seasonal demand peaks, marketing campaigns, or promotional periods.\n\nRecommendation: Analyze what activities drove this peak and replicate them in lower-performing months.`;
  }

  if (q.includes("low") || q.includes("worst") || q.includes("drop")) {
    return `${minMonth.month} had the lowest revenue at $${minMonth.value.toLocaleString()}.\n\nThis is ${((1 - minMonth.value / avgRevenue) * 100).toFixed(0)}% below the average.\n\nPossible factors: seasonal slowdown, reduced marketing spend, or market saturation.\n\nSuggestion: Consider targeted campaigns or promotions during this period.`;
  }

  if (q.includes("trend") || q.includes("pattern") || q.includes("overview")) {
    return `Data overview:\n\n• Total revenue: $${totalRevenue.toLocaleString()}\n• Average monthly: $${avgRevenue.toFixed(0)}\n• Peak: ${maxMonth.month} ($${maxMonth.value.toLocaleString()})\n• Low: ${minMonth.month} ($${minMonth.value.toLocaleString()})\n• Range: $${(maxMonth.value - minMonth.value).toLocaleString()}\n\nThe data shows variability across months suggesting seasonal patterns.`;
  }

  return `Based on your ${allData.length} data points across ${files.length} file(s):\n\n• Revenue ranges from $${minMonth.value.toLocaleString()} to $${maxMonth.value.toLocaleString()}\n• Average: $${avgRevenue.toFixed(0)}\n\nAsk me about specific trends, comparisons, or insights you'd like to explore.`;
}
