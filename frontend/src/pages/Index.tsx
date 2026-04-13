import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { GitCommit, AlertCircle, CheckCircle2, Users, ArrowUpRight, Sparkles } from "lucide-react";
import Starfield from "@/components/Starfield";
import FloatingOrbs from "@/components/FloatingOrbs";
import RepoForm from "@/components/RepoForm";
import ErrorBanner from "@/components/ErrorBanner";
import ResultActions from "@/components/ResultActions";

type HealthLabel = "Critical" | "Needs Work" | "Fair" | "Good" | "Excellent";

interface AnalyzeResponse {
  repoName: string;
  description: string;
  stars: number;
  commits: number;
  openIssues: number;
  closedIssues: number;
  contributors: number;
  healthScore: number;
  healthLabel: HealthLabel;
  analyzedAt: string;
}

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyzeResponse | null>(null);

  const shareUrl = useMemo(() => {
    if (!data?.repoName) return undefined;
    const url = new URL(window.location.href);
    url.searchParams.set("repo", data.repoName);
    return url.toString();
  }, [data?.repoName]);

  const scoreMv = useMotionValue(0);
  const [scoreDisplay, setScoreDisplay] = useState(0);

  const scoreColor = (score: number) => {
    if (score < 30) return "text-red-400";
    if (score < 50) return "text-orange-400";
    if (score < 70) return "text-yellow-300";
    if (score < 85) return "text-emerald-300";
    return "text-cyan-300";
  };

  const analyze = async (url: string) => {
    setRepoUrl(url);
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // const resp = await fetch("/api/v1/analyze", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ repoUrl: url }),
      // });
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: url }),
      });
      const payload = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(payload?.message || "Something went wrong. Please try again.");
      }

      setData(payload as AnalyzeResponse);
      setSearchParams({ repo: (payload as AnalyzeResponse).repoName }, { replace: true });
      requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (url: string) => analyze(url);
  const handleRetry = () => repoUrl && analyze(repoUrl);
  const handleNewAnalysis = () => {
    setRepoUrl("");
    setError(null);
    setData(null);
    setSearchParams({}, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!data) return;
    scoreMv.set(0);
    const controls = animate(scoreMv, data.healthScore, { duration: 1.1, ease: "easeOut" });
    const unsub = scoreMv.on("change", (v) => setScoreDisplay(Math.round(v)));
    return () => {
      controls.stop();
      unsub();
    };
  }, [data, scoreMv]);

  useEffect(() => {
    const repo = searchParams.get("repo");
    if (!repo) return;
    const url = `https://github.com/${repo}`;
    setRepoUrl(url);
    analyze(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const score = data?.healthScore ?? 0;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, score / 100));
  const dashOffset = circumference - progress * circumference;

  return (
    <div className="min-h-screen text-white">
      <section className="relative min-h-[100vh] flex items-center justify-center px-6">
        <FloatingOrbs />
        <Starfield />

        <div className="relative z-10 w-full max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur"
          >
            <Sparkles className="h-4 w-4 text-cyan-300" />
            ✦ Free · No signup · Instant
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-7 text-5xl md:text-7xl font-bold tracking-tight"
          >
            Diagnose Your Repo&apos;s{" "}
            <span className="text-shimmer">Health</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 text-lg md:text-xl text-white/70"
          >
            Paste any public GitHub URL. Get a full health report in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-10"
          >
            <div className="mx-auto max-w-2xl">
              <RepoForm onSubmit={handleSubmit} isLoading={loading} disabled={loading} />
              {repoUrl && (
                <p className="mt-3 text-sm text-white/50 font-mono-stats">
                  {repoUrl}
                </p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-14 grid gap-4 md:grid-cols-3"
          >
            {[
              { title: "Instant Analysis", desc: "No waiting, no queues", icon: "⚡" },
              { title: "No Signup Needed", desc: "Just paste and go", icon: "🔒" },
              { title: "Real GitHub Data", desc: "Direct from the GitHub API", icon: "📊" },
            ].map((f) => (
              <motion.div
                key={f.title}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 12 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 0.45 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <div className="text-2xl">{f.icon}</div>
                <div className="mt-3 font-semibold">{f.title}</div>
                <div className="mt-1 text-sm text-white/65">{f.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section ref={resultsRef} className="px-6 pb-20">
        <div className="mx-auto max-w-5xl">
          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
              <ErrorBanner
                message={error}
                details="This could be due to rate limiting, a private repo, or a network issue."
                onRetry={handleRetry}
                onBack={handleNewAnalysis}
              />
            </motion.div>
          )}

          {data && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-10 rounded-3xl border border-cyan-300/20 bg-white/5 p-6 md:p-8 backdrop-blur-xl shadow-[0_0_0_1px_rgba(0,245,255,0.08),0_20px_60px_rgba(0,0,0,0.6)]"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl md:text-3xl font-bold">{data.repoName}</div>
                    <a
                      href={`https://github.com/${data.repoName}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 transition-colors"
                    >
                      View on GitHub <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                  {data.description && <p className="mt-2 text-white/70 max-w-2xl">{data.description}</p>}
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/60">
                    <span className="font-mono-stats">⭐ {data.stars.toLocaleString()}</span>
                    <span className="font-mono-stats">Analyzed {new Date(data.analyzedAt).toLocaleString()}</span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-emerald-200">
                      ✓ Completed
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-black/20 p-6">
                  <div className="text-sm text-white/60">Health Score</div>
                  <div className="mt-5 relative w-[180px] h-[180px] mx-auto">
                    <svg className="absolute inset-0 -rotate-90" viewBox="0 0 160 160">
                      <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        className={`${scoreColor(score)} transition-[stroke-dashoffset] duration-700 ease-out`}
                        style={{ filter: "drop-shadow(0 0 10px currentColor)" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className={`text-5xl font-bold font-mono-stats ${scoreColor(score)}`}>{scoreDisplay}</div>
                      <div className="text-sm text-white/55 font-mono-stats">/ 100</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className={`text-lg font-semibold ${scoreColor(score)}`}>{data.healthLabel}</div>
                    <div className="mt-1 text-sm text-white/60">
                      {data.healthLabel === "Excellent" && "Active, responsive, and collaborative."}
                      {data.healthLabel === "Good" && "Solid activity with healthy maintenance."}
                      {data.healthLabel === "Fair" && "Some momentum, but could use attention."}
                      {data.healthLabel === "Needs Work" && "Maintenance signals are weak right now."}
                      {data.healthLabel === "Critical" && "This repo likely needs immediate attention."}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-3 grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      title: "Commits (Last 30 Days)",
                      value: data.commits,
                      icon: GitCommit,
                      good: true,
                      trend: data.commits >= 10 ? "↑" : "↓",
                    },
                    {
                      title: "Open Issues",
                      value: data.openIssues,
                      icon: AlertCircle,
                      good: false,
                      trend: data.openIssues >= 30 ? "↑" : "↓",
                    },
                    {
                      title: "Closed Issues",
                      value: data.closedIssues,
                      icon: CheckCircle2,
                      good: true,
                      trend: "↑",
                    },
                    {
                      title: "Contributors",
                      value: data.contributors,
                      icon: Users,
                      good: true,
                      trend: data.contributors >= 5 ? "↑" : "→",
                    },
                  ].map((s, idx) => {
                    const Icon = s.icon;
                    return (
                      <motion.div
                        key={s.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.05 + idx * 0.06 }}
                        className="rounded-2xl border border-white/10 bg-black/20 p-5"
                      >
                        <div className="flex items-start justify-between">
                          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-cyan-200">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className={`font-mono-stats text-sm ${s.good ? "text-emerald-300" : "text-red-300"}`}>
                            {s.trend}
                          </div>
                        </div>
                        <div className="mt-4 text-sm text-white/60">{s.title}</div>
                        <motion.div
                          className="mt-1 text-3xl font-bold font-mono-stats"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {s.value.toLocaleString()}
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <ResultActions onNewAnalysis={handleNewAnalysis} onReanalyze={handleRetry} shareUrl={shareUrl} />
            </motion.div>
          )}
        </div>
      </section>

      <footer className="px-6 py-10 border-t border-white/10">
        <div className="mx-auto max-w-5xl text-center text-white/60">
          <div className="font-semibold text-white/75">RepoPulse — Instant GitHub repository health analysis</div>
          <div className="mt-1 text-sm">Built with ♥ using GitHub API</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
