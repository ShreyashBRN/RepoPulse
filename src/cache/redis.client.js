const IORedis = require("ioredis");

const redis = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

redis.on("error", (err) => console.warn("[Redis]", err.message));

module.exports = redis;
