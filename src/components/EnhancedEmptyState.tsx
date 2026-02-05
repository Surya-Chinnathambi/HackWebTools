import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface EnhancedEmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
    children?: ReactNode;
}

export const EnhancedEmptyState = ({
    icon: Icon,
    title,
    description,
    action,
    secondaryAction,
    children,
}: EnhancedEmptyStateProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-4xl text-center rounded-2xl border-2 border-dashed bg-muted/20"
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="p-xl bg-red-600/10 rounded-full mb-xl"
            >
                <Icon className="h-16 w-16 text-red-600" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-2">{title}</h2>
            <p className="text-lg text-muted-foreground max-w-lg mb-6">
                {description}
            </p>

            {children}

            {(action || secondaryAction) && (
                <div className="flex gap-md flex-wrap justify-center">
                    {secondaryAction && (
                        <Button
                            variant="outline"
                            onClick={secondaryAction.onClick}
                        >
                            {secondaryAction.label}
                        </Button>
                    )}
                    {action && (
                        <Button
                            className="btn-primary"
                            onClick={action.onClick}
                        >
                            {action.label}
                        </Button>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default EnhancedEmptyState;
