import { cn } from "@/lib/utils";
import { Loader2, CheckCircle2, XCircle, Clock, Zap } from "lucide-react";

export type StatusType = "idle" | "submitting" | "pending" | "processing" | "completed" | "failed";

interface RepoStatusProps {
  status: StatusType;
  repoName?: string;
  errorMessage?: string;
}

const RepoStatus = ({ status, repoName, errorMessage }: RepoStatusProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "submitting":
        return {
          icon: Loader2,
          label: "Submitting",
          color: "status-processing",
          animate: true,
        };
      case "pending":
        return {
          icon: Clock,
          label: "Pending",
          color: "status-pending",
          animate: false,
        };
      case "processing":
        return {
          icon: Zap,
          label: "Processing",
          color: "status-processing",
          animate: true,
        };
      case "completed":
        return {
          icon: CheckCircle2,
          label: "Completed",
          color: "status-completed",
          animate: false,
        };
      case "failed":
        return {
          icon: XCircle,
          label: "Failed",
          color: "status-failed",
          animate: false,
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();

  if (!config || status === "idle") return null;

  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center gap-6 py-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-h2 text-foreground">
          {status === "completed" ? "Analysis Complete" : "Analyzing Repository"}
        </h2>
        {repoName && (
          <p className="text-body text-muted-foreground font-medium">{repoName}</p>
        )}
      </div>

      <div className={cn("status-badge", config.color)}>
        <Icon className={cn("h-4 w-4", config.animate && "animate-spin")} />
        {config.label}
      </div>

      {(status === "processing" || status === "pending" || status === "submitting") && (
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-muted" />
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-body text-foreground">
              Fetching GitHub data and computing health metrics…
            </p>
            <p className="text-caption text-muted-foreground">
              This usually takes 10–30 seconds
            </p>
          </div>
        </div>
      )}

      {status === "failed" && errorMessage && (
        <div className="card-surface border-destructive/20 bg-destructive/5 max-w-md text-center">
          <p className="text-body text-destructive">{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default RepoStatus;
