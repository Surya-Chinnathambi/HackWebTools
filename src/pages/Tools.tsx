
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Shield, Zap, Lock, Target, Globe, Code, Wrench, GraduationCap, Layers } from "lucide-react";
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
    <div className="flex flex-col gap-8 pb-16">
      {/* Enhanced Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-orange-600 to-rose-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Wrench className="h-8 w-8" />
            </div>
            <div>
              <h1 className="font-bold text-4xl md:text-5xl bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                Security Tools Arsenal
              </h1>
              <p className="text-white/90 mt-2 text-sm md:text-base">
                Professional-grade penetration testing and security assessment tools
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
              <div className="text-2xl font-bold">{getAllTools().length}</div>
              <div className="text-xs text-white/80">Total Tools</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
              <div className="text-2xl font-bold">{toolsCategories.length}</div>
              <div className="text-xs text-white/80">Categories</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
              <div className="text-2xl font-bold">{filteredTools.length}</div>
              <div className="text-xs text-white/80">Showing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters with Icons */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-600" />
          <h2 className="text-xl font-semibold">Filter by Category</h2>
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
      <div className="flex items-center justify-between bg-muted/30 rounded-lg px-4 py-3 border">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-600/10 rounded-lg">
            <Target className="h-4 w-4 text-red-600" />
          </div>
          <p className="text-sm font-medium">
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
          "grid gap-6",
          "grid-cols-1",
          "sm:grid-cols-2",
          "lg:grid-cols-3",
          "2xl:grid-cols-4",
          "animate-fade-in"
        )}>
          {filteredTools.map((tool, index) => (
            <div
              key={tool.id}
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'backwards'
              }}
              className="animate-fade-in"
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
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border-2 border-dashed bg-muted/20">
          <div className="p-6 bg-red-600/10 rounded-full mb-6">
            <Search className="h-16 w-16 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No tools found</h2>
          <p className="text-muted-foreground mt-2 max-w-lg mb-6">
            We couldn't find any tools that match your search criteria.
            Try adjusting your filters or search query.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </Button>
            <Button
              className="bg-gradient-to-r from-red-600 to-orange-600 text-white hover:shadow-lg"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
            >
              Show All Tools
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tools;
