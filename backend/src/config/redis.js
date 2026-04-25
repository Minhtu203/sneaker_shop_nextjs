import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.warn("Cảnh báo: Biến REDIS_URL chưa được cấu hình!");
}

const redisClient = new Redis(redisUrl, {
  tls: {
    rejectUnauthorized: false,
  },

  maxRetriesPerRequest: null,

  reconnectOnError: (err) => {
    const targetErrors = ["READONLY", "ETIMEDOUT"];
    return targetErrors.some((targetError) =>
      err.message.includes(targetError),
    );
  },

  retryStrategy: (times) => {
    return Math.min(times * 50, 2000);
  },
});

redisClient.on("connect", () => {
  console.log("Connect to Upstash Redis successfully");
});

redisClient.on("error", (err) => {
  console.error("Connect to Upstash failed:", err.message);
});

export default redisClient;
