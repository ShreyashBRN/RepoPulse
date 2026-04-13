// const IORedis = require("ioredis");

// const redis = new IORedis({
//   host: "127.0.0.1",
//   port: 6379,
//   maxRetriesPerRequest: null,
// });

// redis.on("error", (err) => console.warn("[Redis]", err.message));

// module.exports = redis;


const IORedis = require("ioredis");

const redis = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
});

redis.on("error", (err) => console.warn("[Redis]", err.message));

module.exports = redis;