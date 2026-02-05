
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight, Github, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  tags?: string[];
  className?: string;
  githubUrl?: string;
}

const ToolCard = ({
  id,
  name,
  description,
  category,
  tags = [],
  className,
  githubUrl
}: ToolCardProps) => {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border-2 border-border bg-card p-6 transition-all duration-300",
        "hover:shadow-2xl hover:shadow-red-600/10 hover:border-red-600/50 hover:-translate-y-2",
        "backdrop-blur-sm bg-gradient-to-br from-card to-card/50",
        "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-red-600/0 before:to-orange-600/0",
        "hover:before:from-red-600/5 hover:before:to-orange-600/5 before:transition-all before:duration-300",
        className
      )}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{category}</span>
            </div>
            <h3 className="font-bold text-xl group-hover:text-red-600 transition-colors duration-300 mb-2">
              {name}
            </h3>
          </div>
          <div className="p-2 rounded-lg bg-red-600/10 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
            <BookOpen className="h-5 w-5 text-red-600 group-hover:text-white transition-colors" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
          {description}
        </p>
      </div>

      <div className="relative z-10 space-y-3">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs font-medium transition-all group-hover:bg-red-600/10 group-hover:text-red-600 group-hover:border-red-600/30"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 4 && (
              <Badge
                variant="secondary"
                className="text-xs font-medium text-muted-foreground"
              >
                +{tags.length - 4}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <Link
            to={`/tools/${id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:gap-3 transition-all group/link"
            aria-label={`View documentation for ${name}`}
          >
            View Details
            <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>

          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-600/10 transition-all"
              onClick={(e) => e.stopPropagation()}
              aria-label={`View ${name} on GitHub (opens in new tab)`}
            >
              <Github className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
