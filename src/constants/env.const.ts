const ENV_VARS = {
  PORT: process.env.PORT ?? 9000,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  MONGO_URI: process.env.MONGO_URI ?? "mongodb://localhost:27017/mydatabase",
  GLOBAL_ACCESS_SECRET: process.env.GLOBAL_ACCESS_SECRET ?? "xxxxyyyzzz_secret_key",
  GLOBAL_REFRESH_SECRET: process.env.GLOBAL_REFRESH_SECRET ?? "xxxxyyyzzz_refresh_secret_key",
};

export default ENV_VARS;
