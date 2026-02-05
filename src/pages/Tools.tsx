
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Shield, Zap, Lock, Target, Globe, Code, Wrench, GraduationCap, Layers } from "lucide-react";
import ToolCard from "@/components/ToolCard";
import ToolCardSkeleton from "@/components/ToolCardSkeleton";
import EnhancedEmptyState from "@/components/EnhancedEmptyState";
import InfoTooltip from "@/components/InfoTooltip";
import { getAllTools, toolsCategories, getToolsByCategory } from "@/utils/toolsData";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

const Tools = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredTools, setFilteredTools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Debounce search query to reduce filtering operations
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Simulate loading (in real app, this would be actual data fetching)
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  // Update URL when category changes
  useEffect(() => {
    if (activeCategory === "all") {
      navigate("/tools", { replace: true });
    } else {
      navigate(`/tools?category=${activeCategory}`, { replace: true });
    }
  }, [activeCategory, navigate]);

  // Filter tools based on category and debounced search query
  useEffect(() => {
    let tools = activeCategory === "all"
      ? getAllTools()
      : getToolsByCategory(activeCategory);

    if (debouncedSearchQuery) {
      tools = tools.filter((tool) =>
        tool.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (tool.tags && tool.tags.some(tag =>
          tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        ))
      );
    }

    setFilteredTools(tools);
    setIsLoading(false);
  }, [activeCategory, debouncedSearchQuery]);

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
    setSearchQuery("");
  };

  const getCategoryIcon = (categoryId: string) => {
    const icons: Record<string, any> = {
      "information-gathering": Globe,
      "vulnerability-analysis": Shield,
      "web-application-analysis": Code,
      "database-assessment": Layers,
      "password-attacks": Lock,
      "wireless-attacks": Zap,
      "exploitation-tools": Target,
      "sniffing-spoofing": Wrench,
      "all": GraduationCap
    };
    return icons[categoryId] || Shield;
  };

  return (
    <div className="flex flex-col gap-2xl pb-4xl">
      {/* Enhanced Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-orange-600 to-rose-600 p-2xl md:p-3xl text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col gap-lg">
          <div className="flex items-center gap-md">
            <div className="p-md bg-white/20 backdrop-blur-sm rounded-xl">
              <Wrench className="h-8 w-8" />
            </div>
            <div>
              <h1 className="heading-1 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                Security Tools Arsenal
              </h1>
              <p className="body-large text-white/90 mt-sm">
                Professional-grade penetration testing and security assessment tools
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-lg mt-lg">
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-lg py-md border border-white/20">
              <div className="text-2xl font-bold">{getAllTools().length}</div>
              <div className="text-xs text-white/80">Total Tools</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-lg py-md border border-white/20">
              <div className="text-2xl font-bold">{toolsCategories.length}</div>
              <div className="text-xs text-white/80">Categories</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-lg py-md border border-white/20">
              <div className="text-2xl font-bold">{filteredTools.length}</div>
              <div className="text-xs text-white/80">Showing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters with Icons */}
      <div className="flex flex-col gap-xl">
        <div className="flex items-center gap-sm">
          <Shield className="h-5 w-5 text-red-600" />
          <h2 className="heading-3">Filter by Category</h2>
          <InfoTooltip content="Browse tools by security testing category. Each category contains specialized tools for different phases of penetration testing." />
        </div>
        <Tabs
          defaultValue={activeCategory}
          value={activeCategory}
          onValueChange={handleCategoryChange}
          className="w-full"
        >
          <TabsList className="w-full overflow-x-auto flex-wrap h-auto gap-2 bg-muted/50 p-2">
            <TabsTrigger
              value="all"
              className="whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              All Categories
            </TabsTrigger>
            {toolsCategories.map((category) => {
              const Icon = getCategoryIcon(category.id);
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, description, or tags..."
            className="pl-11 pr-12 h-12 text-base border-2 focus:border-red-600 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-10 w-10 text-muted-foreground hover:text-red-600 transition-colors"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced Results summary */}
      <div className="flex items-center justify-between bg-muted/30 rounded-lg px-lg py-md border">
        <div className="flex items-center gap-sm">
          <div className="p-sm bg-red-600/10 rounded-lg">
            <Target className="h-4 w-4 text-red-600" />
          </div>
          <p className="body-normal font-medium">
            Showing <span className="text-red-600 font-bold">{filteredTools.length}</span> {filteredTools.length === 1 ? 'tool' : 'tools'}
            {searchQuery && (
              <span className="text-muted-foreground"> matching "<strong className="text-foreground">{searchQuery}</strong>"</span>
            )}
            {activeCategory !== "all" && (
              <span className="text-muted-foreground"> in <strong className="text-foreground">{toolsCategories.find(cat => cat.id === activeCategory)?.name || activeCategory}</strong></span>
            )}
          </p>
        </div>
      </div>

      {/* Enhanced Tools grid with animations */}
      {filteredTools.length > 0 ? (
        <div className={cn(
          "grid gap-xl",
          "grid-cols-1",
          "sm:grid-cols-2",
          "lg:grid-cols-3",
          "2xl:grid-cols-4",
          "animate-fade-in"
        )}>
          {isLoading ? (
            // Show skeleton loaders while loading
            [...Array(8)].map((_, index) => (
              <div
                key={`skeleton-${index}`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'backwards'
                }}
                className="animate-fade-in"
              >
                <ToolCardSkeleton />
              </div>
            ))
          ) : (
            // Show actual tool cards when loaded
            filteredTools.map((tool, index) => (
              <div
                key={tool.id}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'backwards'
                }}
                className="animate-fade-in content-visibility-auto"
              >
                <ToolCard
                  id={tool.id}
                  name={tool.name}
                  description={tool.description}
                  category={tool.category}
                  tags={tool.tags}
                  githubUrl={tool.githubUrl}
                />
              </div>
            ))
          )}
        </div>
      ) : (
        <EnhancedEmptyState
          icon={Search}
          title="No tools found"
          description="We couldn't find any tools that match your search criteria. Try adjusting your filters or search query."
          action={{
            label: "Show All Tools",
            onClick: () => {
              setSearchQuery("");
              setActiveCategory("all");
            },
          }}
          secondaryAction={{
            label: "Clear Search",
            onClick: () => setSearchQuery(""),
          }}
        />
      )}
    </div>
  );
};

export default Tools;
