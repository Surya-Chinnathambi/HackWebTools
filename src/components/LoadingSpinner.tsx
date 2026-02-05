import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    className?: string;
}

const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
};

export const LoadingSpinner = ({ size = "md", text, className }: LoadingSpinnerProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn("flex flex-col items-center justify-center gap-md", className)}
        >
            <Loader2 className={cn(sizes[size], "animate-spin text-red-600")} />
            {text && (
                <p className="body-normal text-muted-foreground animate-pulse">{text}</p>
            )}
        </motion.div>
    );
};

export default LoadingSpinner;
