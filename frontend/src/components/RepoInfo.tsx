import { ExternalLink, Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RepoInfoProps {
  fullName: string;
  url: string;
  analyzedAt: Date;
  status: "completed" | "failed";
}

const RepoInfo = ({ fullName, url, analyzedAt, status }: RepoInfoProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="card-surface animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-h3 text-foreground font-semibold">{fullName}</h2>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-caption text-primary hover:underline"
          >
            View on GitHub
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="flex flex-col sm:items-end gap-2">
          <div className={cn(
            "status-badge",
            status === "completed" ? "status-completed" : "status-failed"
          )}>
            <CheckCircle2 className="h-4 w-4" />
            {status === "completed" ? "Completed" : "Failed"}
          </div>
          <div className="flex items-center gap-1.5 text-caption text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Analyzed {formatDate(analyzedAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepoInfo;
