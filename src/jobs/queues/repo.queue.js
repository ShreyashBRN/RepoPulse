const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

// ✅ THIS is the important line
const repoQueue = new Queue("repo-analysis", {
  connection,
});

async function enqueueRepoAnalysisJob(payload) {
  await repoQueue.add("analyze-repo", payload, {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  });
}

module.exports = { enqueueRepoAnalysisJob };