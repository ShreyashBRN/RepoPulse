import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBannerProps {
  message: string;
  details?: string;
  onRetry?: () => void;
  onBack?: () => void;
}

const ErrorBanner = ({ message, details, onRetry, onBack }: ErrorBannerProps) => {
  return (
    <div className="flex flex-col items-center gap-6 py-12 animate-fade-in">
      <div className="p-4 rounded-full bg-destructive/10">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>

      <div className="text-center space-y-2 max-w-md">
        <h2 className="text-h2 text-foreground">Analysis Failed</h2>
        <p className="text-body text-muted-foreground">{message}</p>
        {details && (
          <p className="text-caption text-muted-foreground/70 mt-2">
            {details}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {onRetry && (
          <Button onClick={onRetry} variant="default">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        )}
        {onBack && (
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Analyze Another Repository
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorBanner;
