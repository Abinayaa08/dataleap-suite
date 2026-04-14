import { Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateNew: () => void;
}

export const EmptyState = ({ onCreateNew }: EmptyStateProps) => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold mb-1">No dashboards yet</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Upload your data files to generate an analytical dashboard automatically.
        </p>
        <Button onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-1" /> Create New Dashboard
        </Button>
      </div>
    </div>
  );
};
