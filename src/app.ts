import cookieParser from "cookie-parser";
import express, { Express } from "express";
import { corsMiddleware } from "./middleware/cors.middleware";
import routes from "./router/index";
import { connectDatabase } from "./config/database";
import ENV_VARS from "./constants/env.const";
import { errorHandler, notFound } from "./middleware/error.middleware";

const app: Express = express();

connectDatabase(ENV_VARS.MONGO_URI);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
