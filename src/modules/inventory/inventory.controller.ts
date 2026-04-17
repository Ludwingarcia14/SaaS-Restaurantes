import { Request, Response } from "express";
import { createMovement, getMovements } from "./inventory.service";

/**
 * Registra un nuevo movimiento en el inventario
 */
export async function createMovementController(req: Request, res: Response) {
  try {
    const { productId, type, quantity, reason } = req.body;

    // 1. Verificación de seguridad ampliada
    if (!req.user?.restaurantId || !req.user?.userId) {
      return res.status(401).json({ error: "No autorizado: falta identificador de usuario o restaurante" });
    }

    // 2. Validación estricta de tipos y datos
    if (!productId || typeof productId !== "string") {
      return res.status(400).json({ error: "ID de producto inválido" });
    }

    if (!type || !["IN", "OUT", "ADJUSTMENT"].includes(type)) {
      return res.status(400).json({ error: "Tipo de movimiento inválido. Use IN, OUT o ADJUSTMENT" });
    }

    // La cantidad debe ser un número y mayor a cero
    if (quantity === undefined || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ error: "La cantidad debe ser un número mayor a 0" });
    }

    if (reason !== undefined && typeof reason !== "string") {
      return res.status(400).json({ error: "La razón debe ser un texto" });
    }

    // 3. Ejecución del servicio
    const movement = await createMovement({
      productId,
      type,
      quantity,
      reason,
      restaurantId: req.user.restaurantId,
      userId: req.user.userId,
    });

    res.status(201).json(movement);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Error al registrar movimiento" });
  }
}

/**
 * Obtiene el historial de movimientos
 */
export async function getMovementsController(req: Request, res: Response) {
  try {
    // Verificación de seguridad antes de consultar la DB
    if (!req.user?.restaurantId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const movements = await getMovements(req.user.restaurantId);
    
    res.json(movements);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Error al obtener movimientos" });
  }
}