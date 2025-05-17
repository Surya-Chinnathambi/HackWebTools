
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toolsCategories } from "@/utils/toolsData";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Expand the category of the current path
    const currentPath = location.pathname;
    if (currentPath.startsWith("/tools/")) {
      const toolId = currentPath.split("/").pop();
      
      for (const category of toolsCategories) {
        if (category.tools.some(tool => tool.id === toolId)) {
          setExpandedCategories(prev => ({ ...prev, [category.id]: true }));
          break;
        }
      }
    }
  }, [location.pathname]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  return (
    <aside className={cn(
      "pb-12 w-full md:w-64 flex-shrink-0 overflow-y-auto",
      className
    )}>
      <div className="space-y-4 py-4 sticky top-0">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold tracking-tight">Documentation</h2>
          </div>
          <div className="space-y-1">
            <Link
              to="/tools"
              className={cn(
                "flex w-full items-center py-2 text-sm font-medium rounded-md",
                location.pathname === "/tools"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <span className="ml-3">All Tools</span>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Categories
          </h2>
          <div className="space-y-1">
            {toolsCategories.map((category) => (
              <div key={category.id} className="mb-2">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md p-2 text-left text-sm font-medium hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    expandedCategories[category.id] && "bg-sidebar-accent/30"
                  )}
                >
                  <span>{category.name}</span>
                  {expandedCategories[category.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedCategories[category.id] && (
                  <div className="mt-1 pl-4 space-y-1">
                    {category.tools.map((tool) => (
                      <Link
                        key={tool.id}
                        to={`/tools/${tool.id}`}
                        className={cn(
                          "flex items-center rounded-md py-2 pl-4 text-sm font-medium",
                          location.pathname === `/tools/${tool.id}`
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                        )}
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
