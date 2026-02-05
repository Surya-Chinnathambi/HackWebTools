
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
import { motion } from "framer-motion";

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
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-orange-600 to-rose-600 p-2xl md:p-3xl text-white shadow-2xl"
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.div
          className="absolute inset-0 bg-black/10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative z-10 flex flex-col gap-lg">
          <div className="flex items-center gap-md">
            <motion.div
              className="p-md bg-white/20 backdrop-blur-sm rounded-xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 500, damping: 20 }}
              whileHover={{
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.5 }
              }}
            >
              <Wrench className="h-8 w-8" />
            </motion.div>
            <div>
              <motion.h1
                className="text-4xl md:text-5xl font-bold tracking-tight leading-tight bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                Security Tools Arsenal
              </motion.h1>
              <motion.p
                className="text-lg text-white/90 mt-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                Professional-grade penetration testing and security assessment tools
              </motion.p>
            </div>
          </div>
          <motion.div
            className="flex flex-wrap gap-lg mt-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { value: getAllTools().length, label: "Total Tools" },
              { value: toolsCategories.length, label: "Categories" },
              { value: filteredTools.length, label: "Showing" }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="bg-white/10 backdrop-blur-md rounded-lg px-lg py-md border border-white/20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1, type: "spring", stiffness: 400, damping: 20 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Filters with Icons */}
      <div className="flex flex-col gap-xl">
        <motion.div
          className="flex items-center gap-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            animate={{
              rotate: [0, -5, 5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Shield className="h-5 w-5 text-red-600" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight leading-snug">Filter by Category</h2>
          <InfoTooltip content="Browse tools by security testing category. Each category contains specialized tools for different phases of penetration testing." />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
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
        </motion.div>

        <motion.div
          className="relative w-full md:w-96"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
          <motion.div whileFocus={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
            <Input
              type="search"
              placeholder="Search by name, description, or tags..."
              className="pl-11 pr-12 h-12 text-base border-2 focus:border-red-600 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
          {searchQuery && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-10 w-10 text-muted-foreground hover:text-red-600 transition-colors"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Enhanced Results summary */}
      <motion.div
        className="flex items-center justify-between bg-muted/30 rounded-lg px-lg py-md border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <div className="flex items-center gap-sm">
          <motion.div
            className="p-sm bg-red-600/10 rounded-lg"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Target className="h-4 w-4 text-red-600" />
          </motion.div>
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
      </motion.div>

      {/* Enhanced Tools grid with animations */}
      {filteredTools.length > 0 ? (
        <motion.div
          className={cn(
            "grid gap-xl",
            "grid-cols-1",
            "sm:grid-cols-2",
            "lg:grid-cols-3",
            "2xl:grid-cols-4"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          {isLoading ? (
            // Show skeleton loaders while loading
            [...Array(8)].map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <ToolCardSkeleton />
              </motion.div>
            ))
          ) : (
            // Show actual tool cards when loaded
            filteredTools.map((tool, index) => (
              <ToolCard
                key={tool.id}
                id={tool.id}
                name={tool.name}
                description={tool.description}
                category={tool.category}
                tags={tool.tags}
                githubUrl={tool.githubUrl}
                index={index}
              />
            ))
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 20 }}
        >
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
        </motion.div>
      )}
    </div>
  );
};

export default Tools;
