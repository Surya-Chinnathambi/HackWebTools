import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeedbackMessageProps {
    type: "success" | "error" | "warning" | "info";
    message: string;
    className?: string;
}

const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

const variants = {
    success: "border-green-600/50 bg-green-600/10 text-green-600",
    error: "border-red-600/50 bg-red-600/10 text-red-600",
    warning: "border-amber-600/50 bg-amber-600/10 text-amber-600",
    info: "border-blue-600/50 bg-blue-600/10 text-blue-600",
};

export const FeedbackMessage = ({ type, message, className }: FeedbackMessageProps) => {
    const Icon = icons[type];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={className}
        >
            <Alert className={cn("border-2", variants[type])}>
                <Icon className="h-4 w-4" />
                <AlertDescription className="body-normal font-medium">
                    {message}
                </AlertDescription>
            </Alert>
        </motion.div>
    );
};

export default FeedbackMessage;
