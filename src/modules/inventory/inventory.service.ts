import { prisma } from "../../lib/prisma";
import { MovementType } from "@prisma/client";

/**
 * Registra un nuevo movimiento de inventario y actualiza el stock del producto
 */
export async function createMovement(data: {
  productId: string;
  type: MovementType;
  quantity: number;
  reason?: string;
  restaurantId: string;
  userId: string; // Agregado en la firma
}) {
  // Desestructuramos el userId junto con los demás datos
  const { productId, type, quantity, reason, restaurantId, userId } = data;

  // Transacción ACID: Si falla la actualización del producto, se revierte el movimiento
  return prisma.$transaction(async (tx) => {
    // 1. Obtener producto y validar que pertenezca al restaurante
    const product = await tx.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.restaurantId !== restaurantId) {
      throw new Error("Producto no encontrado o no pertenece al restaurante");
    }

    let newStock = product.stock;

    // 2. Calcular nuevo stock según el tipo de movimiento
    if (type === "IN") {
      newStock += quantity;
    } else if (type === "OUT") {
      newStock -= quantity;
      
      if (newStock < 0) {
        throw new Error("Stock insuficiente para realizar la salida");
      }
    } else if (type === "ADJUSTMENT") {
      newStock = quantity;
    }

    // 3. Crear el registro en el historial vinculando al usuario
    const movement = await tx.inventoryMovement.create({
      data: {
        productId,
        restaurantId,
        userId, // Se guarda el ID del responsable
        type,
        quantity,
        reason,
      },
    });

    // 4. Actualizar el stock actual en el catálogo
    await tx.product.update({
      where: { id: productId },
      data: {
        stock: newStock,
      },
    });

    return movement;
  });
}

/**
 * Obtiene el historial de movimientos de un restaurante
 */
export async function getMovements(restaurantId: string) {
  return prisma.inventoryMovement.findMany({
    where: {
      restaurantId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      product: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          email: true, // Retorna el email de quien hizo el movimiento
        },
      },
    },
  });
}