import { Component, ErrorInfo, ReactNode } from "react";
import NotFound from "@/pages/NotFound";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });

        // Log to error reporting service (optional)
        // logErrorToService(error, errorInfo);
    }

    private handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
        window.location.href = "/";
    };

    public render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Determine error type based on error message
            let errorType: "500" | "network" | "permission" = "500";
            let errorMessage = this.state.error?.message || "An unexpected error occurred";

            if (this.state.error?.message.toLowerCase().includes("network")) {
                errorType = "network";
            } else if (
                this.state.error?.message.toLowerCase().includes("permission") ||
                this.state.error?.message.toLowerCase().includes("forbidden")
            ) {
                errorType = "permission";
            }

            // Render animated error page
            return <NotFound errorType={errorType} errorMessage={errorMessage} />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
