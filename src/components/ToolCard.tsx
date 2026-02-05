
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight, Github, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  tags?: string[];
  className?: string;
  githubUrl?: string;
  index?: number;
}

const ToolCard = ({
  id,
  name,
  description,
  category,
  tags = [],
  className,
  githubUrl,
  index = 0
}: ToolCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1]
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "card-interactive group relative flex flex-col justify-between p-xl",
        "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-red-600/0 before:to-orange-600/0",
        "hover:before:from-red-600/5 hover:before:to-orange-600/5 before:transition-all before:duration-500",
        "will-change-transform",
        className
      )}
    >
      <motion.div
        className="relative z-10"
        style={{ transform: "translateZ(30px)" }}
      >
        <div className="flex items-start justify-between mb-md">
          <div className="flex-1">
            <motion.div
              className="flex items-center gap-sm mb-sm"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 + 0.1 }}
            >
              <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse-glow"></div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{category}</span>
            </motion.div>
            <motion.h3
              className="font-bold text-xl group-hover:text-red-600 transition-colors duration-300 mb-sm"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {name}
            </motion.h3>
          </div>
          <motion.div
            className="p-sm rounded-lg bg-red-600/10 group-hover:bg-red-600 group-hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: 12 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            style={{ transform: "translateZ(40px)" }}
          >
            <BookOpen className="h-5 w-5 text-red-600 group-hover:text-white transition-colors" />
          </motion.div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-lg">
          {description}
        </p>
      </motion.div>

      <motion.div
        className="relative z-10 space-y-md"
        style={{ transform: "translateZ(20px)" }}
      >
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-sm">
            {tags.slice(0, 4).map((tag, i) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 + i * 0.05 + 0.2 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Badge
                  variant="secondary"
                  className="text-xs font-medium transition-all duration-300 group-hover:bg-red-600/10 group-hover:text-red-600 group-hover:border-red-600/30"
                >
                  {tag}
                </Badge>
              </motion.div>
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

        <div className="flex items-center justify-between pt-md border-t">
          <Link
            to={`/tools/${id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:gap-3 transition-all duration-300 group/link"
            aria-label={`View documentation for ${name}`}
          >
            View Details
            <motion.div
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </motion.div>
          </Link>

          {githubUrl && (
            <motion.a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-600/10 transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
              aria-label={`View ${name} on GitHub (opens in new tab)`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Github className="h-4 w-4" aria-hidden="true" />
            </motion.a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ToolCard;
