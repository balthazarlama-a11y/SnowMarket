import { Router, type IRouter } from "express";
import healthRouter from "./health";
import apartmentsRouter from "./apartments";
import equipmentRouter from "./equipment";

const router: IRouter = Router();

router.use(healthRouter);
router.use(apartmentsRouter);
router.use(equipmentRouter);

export default router;
