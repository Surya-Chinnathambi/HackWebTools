
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  title?: string;
  className?: string;
}

const CodeBlock = ({ 
  code, 
  language = "bash", 
  showLineNumbers = true, 
  title,
  className 
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className={cn("relative overflow-hidden rounded-lg border bg-code", className)}>
      {title && (
        <div className="flex items-center justify-between border-b bg-muted px-4 py-1.5">
          <span className="text-xs font-medium">{title}</span>
          <div className="flex space-x-1">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </div>
        </div>
      )}
      
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute right-3 top-3 z-10 rounded-md border bg-muted p-1.5 text-code-foreground opacity-70 hover:opacity-100"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>

        <div className="p-4 overflow-x-auto text-code-foreground">
          <pre className="bg-transparent p-0">
            <code>
              {showLineNumbers ? (
                <table className="border-collapse">
                  <tbody>
                    {lines.map((line, i) => (
                      <tr key={i} className="leading-loose">
                        <td className="pr-4 text-right select-none opacity-50 text-xs">{i + 1}</td>
                        <td className="whitespace-pre font-mono">{line}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="leading-loose whitespace-pre font-mono">{code}</div>
              )}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
