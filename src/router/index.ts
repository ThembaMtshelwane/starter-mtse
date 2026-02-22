import { Response, Router } from "express";
import authRoutes from "../modules/auth/auth.routes";

const router = Router();

router.get("/", (_, res: Response) => {
  res.send("API is running...");
});

router.use("/auth", authRoutes);

export default router;
