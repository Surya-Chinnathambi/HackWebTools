
import { useState } from "react";
import { Payload } from "@/types/payload";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download, File } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "high":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    case "medium":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "low":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    default:
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  }
};

interface PayloadCardProps {
  payload: Payload;
  index: number;
}

const PayloadCard = ({ payload, index }: PayloadCardProps) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(payload.content);
    setCopied(true);
    toast({ description: "Payload copied to clipboard" });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const downloadPayload = () => {
    setDownloading(true);
    
    try {
      // Create a blob with the payload content
      const blob = new Blob([payload.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${payload.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      toast({ description: "Payload downloaded successfully" });
    } catch (error) {
      console.error('Download failed:', error);
      toast({ 
        title: "Download failed",
        description: "Could not download the payload file", 
        variant: "destructive" 
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-2">
              <File className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-lg font-bold line-clamp-1">{payload.name}</CardTitle>
            </div>
            <Badge className={`${getSeverityColor(payload.severity)} capitalize`}>
              {payload.severity}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">{payload.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="pb-0">
          <div className="max-h-[200px] overflow-y-auto scrollbar-hide mb-4">
            <CodeBlock 
              code={payload.content} 
              showLineNumbers 
              language="plaintext" 
              className="text-xs" 
            />
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {payload.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="pt-4 flex justify-between">
          <Badge variant="outline">{payload.category}</Badge>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={downloadPayload}
              disabled={downloading}
            >
              <Download className="h-4 w-4" />
              {downloading ? "Downloading..." : "Download"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PayloadCard;
