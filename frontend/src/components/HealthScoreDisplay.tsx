import { cn } from "@/lib/utils";

interface HealthScoreDisplayProps {
  score: number;
  maxScore?: number;
}

const HealthScoreDisplay = ({ score, maxScore = 100 }: HealthScoreDisplayProps) => {
  const percentage = (score / maxScore) * 100;
  
  const getScoreColor = () => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-secondary";
    if (percentage >= 40) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = () => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Fair";
    return "Needs Attention";
  };

  const getProgressColor = () => {
    if (percentage >= 80) return "bg-success";
    if (percentage >= 60) return "bg-secondary";
    if (percentage >= 40) return "bg-warning";
    return "bg-destructive";
  };

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6 p-8 card-surface animate-slide-up">
      <h3 className="text-h3 text-foreground">Health Score</h3>
      
      <div className="relative w-52 h-52">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn(getScoreColor(), "transition-all duration-1000 ease-out")}
            style={{
              filter: "drop-shadow(0 0 8px currentColor)",
            }}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-5xl font-bold", getScoreColor())}>
            {score}
          </span>
          <span className="text-muted-foreground text-caption">/ {maxScore}</span>
        </div>
      </div>

      {/* Score label */}
      <div className="flex flex-col items-center gap-2">
        <span className={cn(
          "status-badge",
          percentage >= 80 && "status-completed",
          percentage >= 60 && percentage < 80 && "bg-secondary/10 text-secondary",
          percentage >= 40 && percentage < 60 && "bg-warning/10 text-warning",
          percentage < 40 && "status-failed"
        )}>
          {getScoreLabel()}
        </span>
        <p className="text-caption text-muted-foreground text-center max-w-xs">
          {percentage >= 80 && "This repository shows strong activity and maintenance."}
          {percentage >= 60 && percentage < 80 && "This repository is in good shape with room for improvement."}
          {percentage >= 40 && percentage < 60 && "This repository has moderate activity and could use more attention."}
          {percentage < 40 && "This repository may need immediate attention and maintenance."}
        </p>
      </div>

      {/* Progress bar alternative */}
      <div className="w-full mt-2">
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-1000 ease-out", getProgressColor())}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default HealthScoreDisplay;
