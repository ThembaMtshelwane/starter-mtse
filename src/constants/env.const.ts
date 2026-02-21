const ENV_VARS = {
  PORT: process.env.PORT ?? 9000,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  MONGO_URI: process.env.MONGO_URI ?? "mongodb://localhost:27017/mydatabase",
  GLOBAL_JWT_SECRET: process.env.GLOBAL_JWT_SECRET ?? "xxxxyyyzzz_secret_key",
};

export default ENV_VARS;
