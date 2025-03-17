
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
}

const CodeBlock = ({
  code,
  language = "python",
  title,
  showLineNumbers = true,
  className,
}: CodeBlockProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const lines = code.trim().split("\n");

  return (
    <div className={cn(
      "rounded-lg overflow-hidden border bg-black/95 shadow-sm",
      className
    )}>
      {title && (
        <div className="flex items-center justify-between bg-black/95 border-b border-white/10 px-4 py-2">
          <div className="text-sm text-white/80 font-medium">{title}</div>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
      )}
      <div className="relative overflow-auto p-4 text-sm font-mono" style={{ maxHeight: '80vh' }}>
        <div className="relative flex">
          {showLineNumbers && (
            <div className="select-none text-right mr-4">
              {lines.map((_, i) => (
                <div key={i} className="text-white/30">
                  {i + 1}
                </div>
              ))}
            </div>
          )}
          <pre className="flex-1 overflow-x-auto">
            <code className="text-white">
              {lines.map((line, i) => (
                <div key={i} className="whitespace-pre">
                  {line || " "}
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
