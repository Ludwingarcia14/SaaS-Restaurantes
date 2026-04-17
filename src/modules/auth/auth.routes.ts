import { Router } from "express";
import { 
  getMeController, 
  loginController, 
  registerController 
} from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// --- Rutas Públicas ---
router.post("/register", registerController);
router.post("/login", loginController);

// --- Rutas Protegidas ---
// El middleware se asegura de que solo usuarios con token válido accedan
router.get("/me", authMiddleware, getMeController);

export default router;