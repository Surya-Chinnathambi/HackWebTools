
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download, Loader } from "lucide-react";

interface PayloadHeaderProps {
  viewMode: "card" | "file";
  setViewMode: (mode: "card" | "file") => void;
  downloadAllPayloads: () => void;
  downloading: boolean;
  isLoading: boolean;
}

export const PayloadHeader = ({
  viewMode,
  setViewMode,
  downloadAllPayloads,
  downloading,
  isLoading,
}: PayloadHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Payloads</h1>
        <p className="text-muted-foreground mt-1">
          Security testing payloads collection from GitHub
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2", viewMode === "card" && "bg-secondary")}
          onClick={() => setViewMode("card")}
        >
          Card View
        </Button>
        <Button
          variant="outline"
          size="sm" 
          className={cn("gap-2", viewMode === "file" && "bg-secondary")}
          onClick={() => setViewMode("file")}
        >
          File View
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={downloadAllPayloads}
          disabled={downloading || isLoading}
        >
          {downloading ? <Loader className="h-4 w-4 animate-spin" /> : <Download size={16} />}
          {downloading ? "Downloading..." : "Download All"}
        </Button>
      </div>
    </div>
  );
};
