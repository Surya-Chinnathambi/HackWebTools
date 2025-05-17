
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import ToolCard from "@/components/ToolCard";
import { getAllTools, toolsCategories, getToolsByCategory } from "@/utils/toolsData";
import { cn } from "@/lib/utils";

const Tools = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category") || "all";
  
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredTools, setFilteredTools] = useState<any[]>([]);

  // Update URL when category changes
  useEffect(() => {
    if (activeCategory === "all") {
      navigate("/tools", { replace: true });
    } else {
      navigate(`/tools?category=${activeCategory}`, { replace: true });
    }
  }, [activeCategory, navigate]);

  // Filter tools based on category and search query
  useEffect(() => {
    let tools = activeCategory === "all" 
      ? getAllTools()
      : getToolsByCategory(activeCategory);
    
    if (searchQuery) {
      tools = tools.filter((tool) =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tool.tags && tool.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
    }
    
    setFilteredTools(tools);
  }, [activeCategory, searchQuery]);

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      <div className="flex flex-col gap-4 border-b pb-8">
        <h1 className="font-bold text-3xl">Tools Documentation</h1>
        <p className="text-muted-foreground max-w-3xl">
          Browse through our collection of penetration testing and security tools.
          Find detailed documentation, usage examples, and command references.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <Tabs 
          defaultValue={activeCategory} 
          value={activeCategory}
          onValueChange={handleCategoryChange}
          className="w-full max-w-xl"
        >
          <TabsList className="w-full overflow-x-auto">
            <TabsTrigger value="all" className="whitespace-nowrap">All Categories</TabsTrigger>
            {toolsCategories.map((category) => (
              <TabsTrigger 
                key={category.id}
                value={category.id}
                className="whitespace-nowrap"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filter tools..."
            className="pl-9 pr-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Results summary */}
      <div>
        <p className="text-sm text-muted-foreground">
          Showing {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
          {searchQuery && (
            <span> for "<strong>{searchQuery}</strong>"</span>
          )}
          {activeCategory !== "all" && (
            <span> in <strong>{toolsCategories.find(cat => cat.id === activeCategory)?.name || activeCategory}</strong></span>
          )}
        </p>
      </div>

      {/* Tools grid */}
      {filteredTools.length > 0 ? (
        <div className={cn(
          "grid gap-6",
          "grid-cols-1",
          "sm:grid-cols-2",
          "lg:grid-cols-3",
          "xl:grid-cols-4"
        )}>
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              id={tool.id}
              name={tool.name}
              description={tool.description}
              category={tool.category}
              tags={tool.tags}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 text-5xl">🔍</div>
          <h2 className="text-xl font-medium">No tools found</h2>
          <p className="text-muted-foreground mt-2 max-w-lg">
            We couldn't find any tools that match your search criteria.
            Try adjusting your filters or search query.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
          >
            Show all tools
          </Button>
        </div>
      )}
    </div>
  );
};

export default Tools;
