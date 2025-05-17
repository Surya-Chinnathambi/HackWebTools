
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllTools } from "@/utils/toolsData";
import { Badge } from "@/components/ui/badge";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Focus input when active
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
    
    // Close search results when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isActive]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const allTools = getAllTools();
    
    const filteredResults = allTools.filter((tool) =>
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.description.toLowerCase().includes(query.toLowerCase()) ||
      (tool.tags && tool.tags.some(tag => 
        tag.toLowerCase().includes(query.toLowerCase())
      ))
    ).slice(0, 6); // Limit to 6 results

    setResults(filteredResults);
  }, [query]);

  const handleResultClick = (toolId: string) => {
    navigate(`/tools/${toolId}`);
    setQuery("");
    setIsActive(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsActive(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search 
          className={cn(
            "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground",
            isActive && "text-primary"
          )}
        />
        <input
          ref={inputRef}
          type="search"
          placeholder="Search tools..."
          className={cn(
            "flex h-10 w-full rounded-md border bg-background px-9 py-2 text-sm ring-offset-background",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-300 ease-in-out",
            isActive && "ring-2 ring-primary"
          )}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsActive(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-2.5 top-2.5 h-5 w-5 rounded-full text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted flex items-center justify-center transition-all"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {isActive && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full z-10 bg-popover/95 backdrop-blur-sm text-popover-foreground shadow-lg rounded-md overflow-hidden border animate-fade-in">
          <ul className="py-1 max-h-[70vh] overflow-auto">
            {results.map((result) => (
              <li key={result.id}>
                <button
                  onClick={() => handleResultClick(result.id)}
                  className="flex flex-col w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors duration-200"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{result.name}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {result.description}
                  </span>
                  {result.tags && result.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs py-0 px-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
