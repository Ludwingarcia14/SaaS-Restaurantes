import { Router } from "express";
import {
  createProductController,
  getProductsController,
  updateProductController,
  deleteProductController,
} from "./product.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// Aplicar el middleware a nivel de Router
// Todas las rutas de productos en Callejón 9 requieren autenticación
router.use(authMiddleware);

// --- Rutas de Inventario ---

// GET /api/products - Obtener lista
router.get("/", getProductsController);

// POST /api/products - Crear nuevo
router.post("/", createProductController);

// PUT /api/products/:id - Actualizar existente
router.put("/:id", updateProductController);

// DELETE /api/products/:id - Eliminar
router.delete("/:id", deleteProductController);

export default router;