import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

const MetricsCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
}: MetricsCardProps) => {
  return (
    <div
      className={cn(
        "metric-card group",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        {description && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-sm">{description}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-caption text-muted-foreground font-medium">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <span
              className={cn(
                "text-caption font-medium",
                trend === "up" && "text-success",
                trend === "down" && "text-destructive",
                trend === "neutral" && "text-muted-foreground"
              )}
            >
              {trend === "up" && "↑"}
              {trend === "down" && "↓"}
              {trend === "neutral" && "→"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
