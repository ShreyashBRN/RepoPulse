import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight, Github } from "lucide-react";
import { cn } from "@/lib/utils";

interface RepoFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const RepoForm = ({ onSubmit, isLoading, disabled }: RepoFormProps) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const validateGitHubUrl = (input: string): boolean => {
    const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/?$/i;
    return githubPattern.test(input.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a GitHub repository URL");
      return;
    }

    if (!validateGitHubUrl(url)) {
      setError("Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)");
      return;
    }

    onSubmit(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Github className="h-5 w-5" />
        </div>
        <Input
          type="url"
          placeholder="https://github.com/owner/repository"
          value={url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setUrl(e.target.value);
            if (error) setError("");
          }}
          disabled={isLoading || disabled}
          className={cn(
            "h-14 pl-12 pr-4 text-base rounded-xl border-2 bg-background",
            "focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "transition-all duration-200",
            error && "border-destructive focus:border-destructive focus:ring-destructive/20"
          )}
          aria-label="GitHub repository URL"
          aria-describedby={error ? "url-error" : "url-helper"}
        />
      </div>

      {error ? (
        <p id="url-error" className="text-caption text-destructive flex items-center gap-1.5">
          <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
          {error}
        </p>
      ) : (
        <p id="url-helper" className="text-caption text-muted-foreground">
          Paste a public GitHub repository URL to analyze its health
        </p>
      )}

      <Button
        type="submit"
        variant="default"
        size="lg"
        disabled={isLoading || disabled}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            Analyze Repository
            <ArrowRight className="ml-1" />
          </>
        )}
      </Button>
    </form>
  );
};

export default RepoForm;
