import app from "./app";
import ENV_VARS from "./constants/env.const";

// Only run app.listen locally
if (ENV_VARS.NODE_ENV !== "production") {
  app.listen(ENV_VARS.PORT, () => {
    console.log(`🚀 Local Server running at http://localhost:${ENV_VARS.PORT}`);
  });
}
