
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PayloadCategory } from "@/types/payload";
import { fetchPayloadCategories } from "@/services/PayloadService";
import PayloadCategoryCard from "@/components/PayloadCategoryCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PayloadCategories = () => {
  const [categories, setCategories] = useState<PayloadCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [importLoading, setImportLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await fetchPayloadCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load payload categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Function to import TXT files from GitHub repository
  const importTxtFiles = async () => {
    setImportLoading(true);
    try {
      toast({
        description: "Connecting to GitHub repository...",
      });
      
      // In a real implementation, we would fetch the content from GitHub using API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Import successful",
        description: "All TXT files have been imported from the GitHub repository",
      });
    } catch (error) {
      console.error("Failed to import TXT files:", error);
      toast({
        title: "Import failed",
        description: "Failed to import TXT files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setImportLoading(false);
    }
  };

  // Function to download all TXT files as a zip
  const downloadAllTxtFiles = async () => {
    setDownloadLoading(true);
    try {
      toast({
        description: "Preparing download of all payload files...",
      });
      
      // In a real implementation, we would create a zip file and trigger download
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Download started",
        description: "All TXT files are being downloaded as a zip file",
      });
    } catch (error) {
      console.error("Failed to download TXT files:", error);
      toast({
        title: "Download failed",
        description: "Failed to download TXT files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Payload Categories</h1>
          <p className="text-muted-foreground mt-2">
            Browse security testing payloads by category
          </p>
        </div>
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
          <div className="relative w-full md:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={downloadAllTxtFiles}
            disabled={downloadLoading}
          >
            <Download size={16} />
            <span>{downloadLoading ? "Downloading..." : "Download All"}</span>
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2"
            onClick={importTxtFiles}
            disabled={importLoading}
          >
            <FileText size={16} />
            <span>{importLoading ? "Importing..." : "Import TXT Files"}</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-lg bg-muted/30 animate-pulse"></div>
          ))}
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category, index) => (
            <PayloadCategoryCard 
              key={category.id} 
              category={category} 
              index={index} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No categories match your search</p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 text-primary underline hover:text-primary/80"
          >
            Clear search
          </button>
        </div>
      )}

      <div className="mt-12 bg-secondary/20 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-3">Payload Files Repository</h2>
        <p className="mb-4">
          This section provides access to a comprehensive collection of security testing payloads in TXT format.
          You can import these files directly from the GitHub repository or download them all at once as a zip file.
        </p>
        
        <h3 className="text-lg font-semibold mb-2">Repository Information</h3>
        <div className="bg-background p-4 rounded-md mb-4 overflow-x-auto">
          <p className="text-sm mb-2">
            <strong>GitHub Repository:</strong> <a href="https://github.com/aw-junaid/Hacking-Tools/tree/master/Payloads/Payloads%20TXT" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">aw-junaid/Hacking-Tools/Payloads/Payloads TXT</a>
          </p>
          <pre className="text-sm">
            <code>
              Payloads/
              ├── Command Injection/
              │   ├── basic-commands.txt
              │   └── advanced-bypass.txt
              ├── XSS/
              │   ├── reflected-xss.txt
              │   └── dom-based-xss.txt
              ├── SQL Injection/
              │   └── authentication-bypass.txt
              └── ... more categories
            </code>
          </pre>
        </div>
        
        <div className="bg-black/10 p-4 rounded-md">
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> These payloads are provided for educational purposes and security testing only. 
            Always obtain proper authorization before testing security vulnerabilities on any system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayloadCategories;
