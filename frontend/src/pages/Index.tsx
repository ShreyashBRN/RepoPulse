import { useState } from "react";
import Header from "@/components/Header";
import RepoForm from "@/components/RepoForm";
import RepoStatus, { type StatusType } from "@/components/RepoStatus";
import RepoInfo from "@/components/RepoInfo";
import HealthScoreDisplay from "@/components/HealthScoreDisplay";
import MetricsCard from "@/components/MetricsCard";
import ResultActions from "@/components/ResultActions";
import ErrorBanner from "@/components/ErrorBanner";
import { GitCommit, AlertCircle, CheckCircle, Users } from "lucide-react";

interface RepoMetrics {
  fullName: string;
  url: string;
  healthScore: number;
  commits30Days: number;
  openIssues: number;
  closedIssues: number;
  contributors: number;
  analyzedAt: Date;
}

const Index = () => {
  const [status, setStatus] = useState<StatusType>("idle");
  const [repoUrl, setRepoUrl] = useState("");
  const [repoName, setRepoName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<RepoMetrics | null>(null);

  const extractRepoName = (url: string): string => {
    const match = url.match(/github\.com\/([^/]+\/[^/]+)/i);
    return match ? match[1] : url;
  };

  const simulateAnalysis = async (url: string) => {
    setRepoUrl(url);
    setRepoName(extractRepoName(url));
    setError(null);
    setStatus("submitting");

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("pending");

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("processing");

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // 90% success rate simulation
    if (Math.random() > 0.1) {
      const mockMetrics: RepoMetrics = {
        fullName: extractRepoName(url),
        url: url,
        healthScore: Math.floor(Math.random() * 40) + 60, // 60-100 range
        commits30Days: Math.floor(Math.random() * 150) + 10,
        openIssues: Math.floor(Math.random() * 50),
        closedIssues: Math.floor(Math.random() * 200) + 50,
        contributors: Math.floor(Math.random() * 100) + 5,
        analyzedAt: new Date(),
      };
      setMetrics(mockMetrics);
      setStatus("completed");
    } else {
      setError("Unable to fetch repository data. Please ensure the repository is public and try again.");
      setStatus("failed");
    }
  };

  const handleSubmit = (url: string) => {
    simulateAnalysis(url);
  };

  const handleRetry = () => {
    if (repoUrl) {
      simulateAnalysis(repoUrl);
    }
  };

  const handleNewAnalysis = () => {
    setStatus("idle");
    setRepoUrl("");
    setRepoName("");
    setMetrics(null);
    setError(null);
  };

  const isProcessing = status === "submitting" || status === "pending" || status === "processing";

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <main className="container-main section-padding">
        {/* Landing / Input State */}
        {status === "idle" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 animate-fade-in">
            <div className="text-center space-y-4 max-w-2xl">
              <h1 className="text-h1 md:text-display text-foreground">
                Analyze Your Repository Health
              </h1>
              <p className="text-body md:text-lg text-muted-foreground">
                Get instant insights into your GitHub repository's activity, issues, and contributor engagement. No signup required.
              </p>
            </div>
            <RepoForm onSubmit={handleSubmit} isLoading={false} />
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <RepoStatus status={status} repoName={repoName} />
          </div>
        )}

        {/* Failed State */}
        {status === "failed" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <ErrorBanner
              message={error || "An unexpected error occurred."}
              details="This could be due to rate limiting or the repository being private."
              onRetry={handleRetry}
              onBack={handleNewAnalysis}
            />
          </div>
        )}

        {/* Results State */}
        {status === "completed" && metrics && (
          <div className="space-y-8 py-8">
            {/* Section A: Repository Info */}
            <RepoInfo
              fullName={metrics.fullName}
              url={metrics.url}
              analyzedAt={metrics.analyzedAt}
              status="completed"
            />

            {/* Section B & C: Health Score + Metrics */}
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Health Score - Takes 2 columns on large screens */}
              <div className="lg:col-span-2">
                <HealthScoreDisplay score={metrics.healthScore} />
              </div>

              {/* Metrics Grid - Takes 3 columns */}
              <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
                <MetricsCard
                  title="Commits (Last 30 Days)"
                  value={metrics.commits30Days}
                  icon={GitCommit}
                  description="Number of commits pushed to the default branch in the last 30 days."
                  trend="up"
                />
                <MetricsCard
                  title="Open Issues"
                  value={metrics.openIssues}
                  icon={AlertCircle}
                  description="Current number of open issues in the repository."
                  trend={metrics.openIssues > 30 ? "down" : "neutral"}
                />
                <MetricsCard
                  title="Closed Issues"
                  value={metrics.closedIssues}
                  icon={CheckCircle}
                  description="Total number of issues that have been resolved and closed."
                  trend="up"
                />
                <MetricsCard
                  title="Contributors"
                  value={metrics.contributors}
                  icon={Users}
                  description="Number of unique contributors who have committed to the repository."
                  trend="up"
                />
              </div>
            </div>

            {/* Section D: Actions */}
            <ResultActions
              onNewAnalysis={handleNewAnalysis}
              onReanalyze={handleRetry}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container-main text-center">
          <p className="text-caption text-muted-foreground">
            RepoPulse — Instant GitHub repository health analysis
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
