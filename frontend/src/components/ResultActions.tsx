import { RefreshCw, Plus, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ResultActionsProps {
  onNewAnalysis: () => void;
  onReanalyze: () => void;
  shareUrl?: string;
}

const ResultActions = ({ onNewAnalysis, onReanalyze, shareUrl }: ResultActionsProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = async () => {
    const urlToCopy = shareUrl || window.location.href;
    
    try {
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The analysis link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-8 animate-fade-in">
      <Button onClick={onNewAnalysis} variant="default" size="default">
        <Plus className="h-4 w-4" />
        Analyze Another Repository
      </Button>
      <Button onClick={onReanalyze} variant="outline" size="default">
        <RefreshCw className="h-4 w-4" />
        Re-analyze This Repository
      </Button>
      <Button onClick={handleCopyLink} variant="outline" size="default">
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        {copied ? "Copied!" : "Copy Link"}
      </Button>
    </div>
  );
};

export default ResultActions;
