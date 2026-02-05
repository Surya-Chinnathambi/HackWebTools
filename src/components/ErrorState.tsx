import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    className?: string;
}

export const ErrorState = ({
    title = "Something went wrong",
    message,
    onRetry,
    className = ""
}: ErrorStateProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={className}
        >
            <Alert variant="destructive" className="card-base">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="text-lg font-semibold mb-sm">{title}</AlertTitle>
                <AlertDescription className="space-y-md">
                    <p className="body-normal">{message}</p>
                    {onRetry && (
                        <Button
                            onClick={onRetry}
                            variant="outline"
                            size="sm"
                            className="gap-sm"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try Again
                        </Button>
                    )}
                </AlertDescription>
            </Alert>
        </motion.div>
    );
};

export default ErrorState;
