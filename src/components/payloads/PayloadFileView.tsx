
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Payload } from "@/types/payload";
import { Download, File } from "lucide-react";

interface PayloadFileViewProps {
  payloads: Payload[];
  handleDownload: (payload: Payload) => void;
}

export const PayloadFileView = ({ payloads, handleDownload }: PayloadFileViewProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
      {payloads.map((payload, index) => (
        <div 
          key={payload.id} 
          className="bg-card border rounded-lg p-4 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="text-primary bg-primary/10 p-3 rounded-lg">
              <File size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{payload.name}</h3>
                  <div className="text-sm text-muted-foreground">TXT File</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                  {payload.category}
                </span>
              </div>
              <p className="text-sm mt-2 text-muted-foreground line-clamp-2">
                {payload.description || `${payload.name} payload for security testing and research purposes.`}
              </p>
              <div className="flex justify-between items-center mt-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    toast({
                      description: payload.content.substring(0, 100) + (payload.content.length > 100 ? "..." : ""),
                      title: `${payload.name} Preview`,
                    });
                  }}
                >
                  Quick Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleDownload(payload)}
                >
                  <Download size={16} />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
