import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import esimRouter from "./esim.js";
import billsRouter from "./bills.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(esimRouter);
router.use(billsRouter);

export default router;
