import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Keyboard } from "lucide-react";

const KeyboardShortcuts = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Show keyboard shortcuts dialog: Shift + ?
            if (e.shiftKey && e.key === "?") {
                e.preventDefault();
                setOpen(true);
            }
            // Close on Escape
            if (e.key === "Escape" && open) {
                setOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open]);

    const shortcuts = [
        { keys: ["Shift", "?"], description: "Show keyboard shortcuts" },
        { keys: ["Tab"], description: "Navigate between elements" },
        { keys: ["Shift", "Tab"], description: "Navigate backwards" },
        { keys: ["Enter"], description: "Activate focused element" },
        { keys: ["Escape"], description: "Close modals/menus" },
        { keys: ["/"], description: "Focus search (on most pages)" },
    ];

    return (
        <>
            {/* Floating keyboard shortcut hint */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-4 right-4 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40"
                aria-label="View keyboard shortcuts"
                title="Keyboard shortcuts (Shift + ?)"
            >
                <Keyboard className="h-5 w-5" aria-hidden="true" />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Keyboard className="h-5 w-5" aria-hidden="true" />
                            Keyboard Shortcuts
                        </DialogTitle>
                        <DialogDescription>
                            Use these shortcuts to navigate faster
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 mt-4">
                        {shortcuts.map((shortcut, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between py-2 border-b last:border-0"
                            >
                                <span className="text-sm">{shortcut.description}</span>
                                <div className="flex gap-1">
                                    {shortcut.keys.map((key, i) => (
                                        <Badge
                                            key={i}
                                            variant="outline"
                                            className="font-mono text-xs px-2 py-1"
                                        >
                                            {key}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                        Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Shift + ?</kbd> anytime to view shortcuts
                    </p>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default KeyboardShortcuts;
