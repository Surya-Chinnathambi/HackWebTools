import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { ReactNode } from "react";

interface InfoTooltipProps {
    content: string;
    children?: ReactNode;
    side?: "top" | "right" | "bottom" | "left";
}

export const InfoTooltip = ({ content, children, side = "top" }: InfoTooltipProps) => {
    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children || (
                        <button
                            type="button"
                            className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="More information"
                        >
                            <HelpCircle className="h-4 w-4" />
                        </button>
                    )}
                </TooltipTrigger>
                <TooltipContent side={side} className="max-w-xs">
                    <p className="text-sm">{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default InfoTooltip;
