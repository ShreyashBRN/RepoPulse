const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis({
    host: "127.0.0.1",
    port: 6379,
  });

  const repoQueue = new IORedis({
    host: "127.0.0.1",
    port: 6379,
  });



async function enqueRepoAAnalysisJob(payload){
    await repoQueue.add(
        "analyze-Repo",
        payload
    );
}

module.exports = { enqueRepoAAnalysisJob };