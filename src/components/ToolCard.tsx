
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
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
    <Link
      to={`/tools/${id}`}
      className={cn(
        "group relative flex flex-col justify-between rounded-lg border border-border p-5 transition-all hover:shadow-md hover:border-primary/50",
        "hover:-translate-y-1 duration-300 backdrop-blur-sm hover:bg-card/80",
        className
      )}
    >
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {name}
              <span className="absolute inset-0 z-10" aria-hidden="true" />
            </h3>
            <p className="text-xs text-muted-foreground mb-2">{category}</p>
          </div>
          <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>
      </div>

      <div className="mt-4">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs font-semibold transition-colors group-hover:border-primary/30"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge 
                variant="outline"
                className="text-xs font-semibold transition-colors text-muted-foreground"
              >
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {githubUrl && (
          <div className="flex justify-end">
            <a 
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 transition-all hover:gap-2 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ToolCard;
