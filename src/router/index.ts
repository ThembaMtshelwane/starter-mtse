import e, { Response, Router } from "express";

const router = Router();

router.get("/", (_, res: Response) => {
  res.send("API is running...");
});


export default router;