import { useState, useEffect } from "react";
import { Payload } from "@/types/payload";
import { PayloadCategory } from "@/types/payload";
import { fetchPayloads, fetchPayloadCategories, fetchPayloadsByCategory } from "@/services/PayloadService";
import PayloadFilterBar from "@/components/PayloadFilterBar";
import { toast } from "@/hooks/use-toast";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { PayloadHeader } from "@/components/payloads/PayloadHeader";
import { PayloadCardView } from "@/components/payloads/PayloadCardView";
import { PayloadFileView } from "@/components/payloads/PayloadFileView";
import { PayloadEmptyState } from "@/components/payloads/PayloadEmptyState";
import { PayloadError } from "@/components/payloads/PayloadError";
import { PayloadLoading } from "@/components/payloads/PayloadLoading";
import { PayloadFooter } from "@/components/payloads/PayloadFooter";

const Payloads = () => {
  const [payloads, setPayloads] = useState<Payload[]>([]);
  const [categories, setCategories] = useState<PayloadCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"card" | "file">("file");
  const [downloading, setDownloading] = useState<boolean>(false);
  const [fetchingError, setFetchingError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setFetchingError(null);
      try {
        const allPayloads = await fetchPayloads();
        setPayloads(allPayloads);

        const allCategories = await fetchPayloadCategories();
        setCategories(allCategories);

        // Extract all unique tags from payloads
        const tags = new Set<string>();
        allPayloads.forEach(payload => {
          payload.tags.forEach(tag => tags.add(tag));
        });
        setAvailableTags(Array.from(tags));
      } catch (error) {
        console.error("Failed to fetch payloads or categories:", error);
        setFetchingError("Failed to load payload data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadPayloadsByCategory = async () => {
      if (!selectedCategory) return;
      
      setIsLoading(true);
      setFetchingError(null);
      try {
        const categoryPayloads = await fetchPayloadsByCategory(selectedCategory);
        setPayloads(categoryPayloads);
      } catch (error) {
        console.error("Failed to fetch payloads by category:", error);
        setFetchingError(`Failed to load payloads for the selected category. Please try again.`);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedCategory) {
      loadPayloadsByCategory();
    }
  }, [selectedCategory]);

  const filteredPayloads = payloads.filter(payload => {
    const searchRegex = new RegExp(searchQuery, 'i');
    const matchesSearch = searchRegex.test(payload.name) || searchRegex.test(payload.description);
    const matchesSeverity = !selectedSeverity || payload.severity === selectedSeverity;
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => payload.tags.includes(tag));

    return matchesSearch && matchesSeverity && matchesTags;
  });

  const handleDownload = (payload: Payload) => {
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
    }
  };

  const downloadAllPayloads = async () => {
    if (filteredPayloads.length === 0) {
      toast({ 
        title: "No payloads to download",
        description: "Please modify your filters to include some payloads",
        variant: "destructive"
      });
      return;
    }

    setDownloading(true);
    toast({ description: "Preparing to download all payloads..." });
    
    try {
      const zip = new JSZip();
      
      // Group payloads by category
      const categorizedPayloads: Record<string, Payload[]> = {};
      
      filteredPayloads.forEach(payload => {
        if (!categorizedPayloads[payload.category]) {
          categorizedPayloads[payload.category] = [];
        }
        categorizedPayloads[payload.category].push(payload);
      });
      
      // Add payloads to zip file by category
      Object.entries(categorizedPayloads).forEach(([category, payloads]) => {
        const categoryFolder = zip.folder(category);
        
        payloads.forEach(payload => {
          const filename = `${payload.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
          categoryFolder?.file(filename, payload.content);
        });
      });
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `security-payloads-${new Date().toISOString().slice(0, 10)}.zip`);
      
      toast({ 
        title: "Download complete",
        description: `Downloaded ${filteredPayloads.length} payloads`
      });
    } catch (error) {
      console.error('Failed to create zip file:', error);
      toast({ 
        title: "Download failed",
        description: "Could not create zip file for download", 
        variant: "destructive" 
      });
    } finally {
      setDownloading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedSeverity("");
    setSelectedTags([]);
  };

  return (
    <div className="container mx-auto py-8">
      <PayloadHeader 
        viewMode={viewMode}
        setViewMode={setViewMode}
        downloadAllPayloads={downloadAllPayloads}
        downloading={downloading}
        isLoading={isLoading}
      />

      <PayloadFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSeverity={selectedSeverity}
        setSelectedSeverity={setSelectedSeverity}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        availableTags={availableTags}
      />

      {fetchingError && <PayloadError error={fetchingError} />}

      {isLoading ? (
        <PayloadLoading />
      ) : filteredPayloads.length > 0 ? (
        viewMode === "card" ? (
          <PayloadCardView payloads={filteredPayloads} />
        ) : (
          <PayloadFileView 
            payloads={filteredPayloads} 
            handleDownload={handleDownload} 
          />
        )
      ) : (
        <PayloadEmptyState clearFilters={clearFilters} />
      )}

      {!isLoading && filteredPayloads.length > 0 && (
        <PayloadFooter count={filteredPayloads.length} />
      )}
    </div>
  );
};

export default Payloads;
