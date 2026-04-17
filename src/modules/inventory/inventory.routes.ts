import { Router } from "express";
import { createMovementController, getMovementsController } from "./inventory.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createMovementController);
router.get("/", authMiddleware, getMovementsController);
export default router;