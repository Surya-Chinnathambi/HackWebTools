
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PayloadCategory } from "@/types/payload";
import { motion, AnimatePresence } from "framer-motion";

interface PayloadFilterBarProps {
  categories: PayloadCategory[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSeverity: string;
  setSelectedSeverity: (severity: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  availableTags: string[];
}

const PayloadFilterBar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  selectedSeverity,
  setSelectedSeverity,
  selectedTags,
  setSelectedTags,
  availableTags
}: PayloadFilterBarProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [tagInput, setTagInput] = useState("");
  
  const toggleFilters = () => setShowFilters(!showFilters);
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };
  
  const handleSeverityChange = (value: string) => {
    setSelectedSeverity(value);
  };
  
  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagInput("");
  };
  
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };
  
  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedSeverity("");
    setSelectedTags([]);
    setSearchQuery("");
  };

  const filterVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" }
  };
  
  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Input
            placeholder="Search payloads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={showFilters ? "default" : "outline"} 
            onClick={toggleFilters}
            className="gap-2"
          >
            <Filter className="h-4 w-4" /> Filters
          </Button>
          
          {(selectedCategory || selectedSeverity || selectedTags.length > 0) && (
            <Button variant="ghost" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" /> Clear
            </Button>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={filterVariants}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2"
          >
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Severity</label>
              <Select value={selectedSeverity} onValueChange={handleSeverityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Severities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Tags</label>
              <div className="relative">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tags..."
                  onKeyDown={(e) => e.key === 'Enter' && addTag(tagInput)}
                  list="available-tags"
                />
                <datalist id="available-tags">
                  {availableTags
                    .filter(tag => !selectedTags.includes(tag))
                    .map(tag => (
                      <option key={tag} value={tag} />
                    ))}
                </datalist>
              </div>
              
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {(selectedCategory || selectedSeverity || selectedTags.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedCategory && (
            <Badge variant="outline" className="gap-1">
              Category: {categories.find(c => c.id === selectedCategory)?.name}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => setSelectedCategory("")}
              />
            </Badge>
          )}
          {selectedSeverity && (
            <Badge variant="outline" className="gap-1">
              Severity: {selectedSeverity}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => setSelectedSeverity("")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default PayloadFilterBar;
