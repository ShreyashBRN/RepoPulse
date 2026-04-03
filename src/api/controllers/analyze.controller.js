const axios = require("axios");

function parseGitHubRepo(repoUrl) {
  let url;
  try {
    url = new URL(repoUrl);
  } catch {
    throw new Error("Invalid GitHub URL format");
  }

  if (!/^(www\.)?github\.com$/i.test(url.host)) {
    throw new Error("Invalid GitHub URL format");
  }

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 2) {
    throw new Error("Invalid GitHub URL format");
  }

  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/i, "");
  if (!owner || !repo) {
    throw new Error("Invalid GitHub URL format");
  }

  return { owner, repo, repoName: `${owner}/${repo}` };
}

function calculateHealthScore(data) {
  let score = 0;

  score += Math.min(35, Math.floor((data.commits / 50) * 35));

  const total = data.openIssues + data.closedIssues;
  const ratio = total > 0 ? data.closedIssues / total : 0;
  score += Math.floor(ratio * 30);

  score += Math.min(20, Math.floor((data.contributors / 20) * 20));

  const penalty = Math.min(15, Math.floor(data.openIssues / 10));
  score = Math.max(0, score - penalty);

  if (data.contributors > 5 && data.commits > 10) score += 10;

  return Math.min(100, score);
}

function healthLabel(score) {
  if (score < 30) return "Critical";
  if (score < 50) return "Needs Work";
  if (score < 70) return "Fair";
  if (score < 85) return "Good";
  return "Excellent";
}

async function analyzeRepo(req, res) {
  try {
    const { repoUrl } = req.body || {};
    if (!repoUrl || typeof repoUrl !== "string") {
      return res.status(400).json({ message: "repoUrl is required" });
    }

    const token = process.env.GITHUB_TOKEN;

    const { owner, repo, repoName } = parseGitHubRepo(repoUrl);

    const baseHeaders = {
      Accept: "application/vnd.github+json",
      "User-Agent": "RepoPulse",
    };
    const authedHeaders = token ? { ...baseHeaders, Authorization: `Bearer ${token}` } : baseHeaders;

    const githubGet = async (url, config = {}) => {
      try {
        return await axios.get(url, { ...config, headers: authedHeaders });
      } catch (e) {
        // If token is invalid/revoked, retry unauthenticated (public repos still work).
        if (token && e?.response?.status === 401) {
          return await axios.get(url, { ...config, headers: baseHeaders });
        }
        throw e;
      }
    };

    const repoInfoUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const openIssuesSearchUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(
      `repo:${owner}/${repo} type:issue state:open`
    )}&per_page=1`;
    const closedIssuesSearchUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(
      `repo:${owner}/${repo} type:issue state:closed`
    )}&per_page=1`;

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const commitsBaseUrl = `https://api.github.com/repos/${owner}/${repo}/commits`;
    const contributorsUrl = `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100&anon=true`;

    const [repoInfoResp, openIssuesResp, closedIssuesResp] = await Promise.all([
      githubGet(repoInfoUrl),
      githubGet(openIssuesSearchUrl),
      githubGet(closedIssuesSearchUrl),
    ]);

    let commits = 0;
    for (let page = 1; page <= 3; page++) {
      const commitsResp = await githubGet(commitsBaseUrl, {
        params: { since, per_page: 100, page },
      });
      const pageCommits = Array.isArray(commitsResp.data) ? commitsResp.data.length : 0;
      commits += pageCommits;
      if (pageCommits < 100) break;
    }

    let contributors = 0;
    try {
      const contribResp = await githubGet(contributorsUrl);
      contributors = Array.isArray(contribResp.data) ? contribResp.data.length : 0;
    } catch (err) {
      if (err?.response?.status === 204) {
        contributors = 0;
      } else {
        throw err;
      }
    }

    const openIssues = openIssuesResp?.data?.total_count ?? 0;
    const closedIssues = closedIssuesResp?.data?.total_count ?? 0;

    const score = calculateHealthScore({ commits, openIssues, closedIssues, contributors });
    const analyzedAt = new Date().toISOString();

    return res.json({
      repoName,
      description: repoInfoResp.data?.description ?? "",
      stars: repoInfoResp.data?.stargazers_count ?? 0,
      commits,
      openIssues,
      closedIssues,
      contributors,
      healthScore: score,
      healthLabel: healthLabel(score),
      analyzedAt,
    });
  } catch (err) {
    const status = err?.response?.status;
    const ghMsg = err?.response?.data?.message;
    const ghDoc = err?.response?.data?.documentation_url;
    console.error("[/api/v1/analyze] error", {
      status,
      message: err?.message,
      ghMsg,
      ghDoc,
    });
    if (status === 404) {
      return res.status(404).json({ message: "Repository not found. Is it public?" });
    }
    if (status === 401) {
      return res.status(401).json({ message: "GitHub token rejected. Check GITHUB_TOKEN." });
    }
    if (status === 403) {
      const msg = err?.response?.data?.message || "";
      if (msg.toLowerCase().includes("rate limit")) {
        return res.status(429).json({ message: "GitHub API rate limit hit. Try again in a minute." });
      }
      return res.status(403).json({ message: "Access forbidden. Is the repo private or token missing scopes?" });
    }
    if (status === 422) {
      return res.status(400).json({ message: "Invalid repository. Check the URL and try again." });
    }
    if (err?.message?.toLowerCase().includes("invalid github url")) {
      return res.status(400).json({ message: err.message });
    }
    // Surface GitHub message when present to help debugging client-side.
    if (ghMsg) {
      return res.status(502).json({ message: ghMsg, documentationUrl: ghDoc });
    }
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

module.exports = { analyzeRepo };

