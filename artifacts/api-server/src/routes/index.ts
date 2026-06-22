import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import esimRouter from "./esim.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(esimRouter);

export default router;
