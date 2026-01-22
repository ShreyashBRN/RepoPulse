const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const mongoose = require('mongoose');
const Repository = require('../../models/repository.model');
const { fetchRepoMetadata, fetchCommitsLast30Days, fetchIssueStats, fetchContributorCount } = require('../../services/github/github.service');
const { MONGO_URI } = require('../../config/env');

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
        const metadata = await fetchRepoMetadata(owner, repo);
        const commitCountLast30Days = await fetchCommitsLast30Days(owner, repo);
        console.log("🧮 Commits in last 30 days:", commitCountLast30Days);
        const issueStats = await fetchIssueStats(owner, repo);
        console.log("🐞 Issue stats:", issueStats);
        console.log({
          openIssues: issueStats.closeIssues,
          closedIssues: issueStats.closeIssues,
        });
        
        
        console.log("📦 GitHub Repo Metadata:");
        console.log({
          name: metadata.full_name,
          description: metadata.description,
          forks: metadata.forks_count,
          openIssues: metadata.open_issues_count,
        });
        
        await Repository.findByIdAndUpdate(repositoryId, {
          status: "completed",
        });
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