const { Worker } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis({
    host: "127.0.0.1",
    port: 6379,
  });

  const worker = new Worker(
    "repo-analysis", 
    async (job) => {
  
      console.log("📦 Job received:", job.data);
    },
    {
      connection,
    }
  );
  
  console.log("👷 Repo analysis worker started");