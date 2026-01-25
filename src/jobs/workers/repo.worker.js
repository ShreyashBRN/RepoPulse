require("dotenv").config();
const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const mongoose = require('mongoose');
const Repository = require('../../models/repository.model');
const { fetchCommitsLast30Days, fetchIssueStats, fetchContributorCount } = require('../../services/github/github.service');
const { MONGO_URI } = require('../../config/env');
const { computeHealthScore } = require('../../services/metrics/healthScore.service');
const { invalidateRepoMetricsCache } = require('../../services/repository.service');

mongoose.connect(MONGO_URI);

const connection = new IORedis({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null,
  });

  const worker = new Worker(
    "repo-analysis", 
    async (job) => {
      const { repositoryId, fullName } = job.data;
      const [owner, repo] = fullName.split('/');
      try{
        console.log("🔄 Processing repo:", fullName);
        await Repository.findByIdAndUpdate(repositoryId, {
          status: "processing",
        });
        const commitCountLast30Days = await fetchCommitsLast30Days(owner, repo);
        console.log("🧮 Commits in last 30 days:", commitCountLast30Days);
        const issueStats = await fetchIssueStats(owner, repo);
        console.log("🐞 Issue stats:", { openIssues: issueStats.openIssues, closedIssues: issueStats.closedIssues });

        const contributorCount = await fetchContributorCount(owner, repo);
        console.log("👥 Contributors:", contributorCount);
        const healthScore = computeHealthScore({
            commitCount: commitCountLast30Days,
            openIssues: issueStats.openIssues,
            closedIssues: issueStats.closedIssues,
            contributorCount,
        });
        console.log("❤️ Health Score:", healthScore);

        await Repository.findByIdAndUpdate(repositoryId, {
          status: "completed",
          commitCountLast30Days,
          openIssues: issueStats.openIssues,
          closedIssues: issueStats.closedIssues,
          contributorCount,
          healthScore,
        });
        await invalidateRepoMetricsCache(repositoryId);
        console.log("✅ Completed repo:", fullName);
      } catch (error){
        console.error("❌ Worker error:", error.message);
        await Repository.findByIdAndUpdate(repositoryId, {
          status: "failed",
        })
        throw error;
      }
  
    },
    {
      connection,
    }
  );
  
  console.log("👷 Repo analysis worker started");