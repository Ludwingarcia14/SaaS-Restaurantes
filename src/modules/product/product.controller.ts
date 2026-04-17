import { Request, Response } from "express";
import { 
  createProduct, 
  getProducts, 
  updateProduct, 
  deleteProduct 
} from "./product.service";

/**
 * Obtener todos los productos del restaurante del usuario
 */
export async function getProductsController(req: Request, res: Response) {
  try {
    if (!req.user?.restaurantId) {
      return res.status(401).json({ error: "No autorizado o sin restaurante asignado" });
    }

    const products = await getProducts(req.user.restaurantId);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Error obteniendo productos" });
  }
}

/**
 * Crear un nuevo producto
 */
export async function createProductController(req: Request, res: Response) {
  try {
    // 1. Validación estricta de tipos al crear
    const { name, price } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Nombre inválido o faltante. Debe ser texto." });
    }

    if (price === undefined || typeof price !== "number") {
      return res.status(400).json({ error: "Precio inválido o faltante. Debe ser un número." });
    }

    if (!req.user?.restaurantId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const product = await createProduct(req.body, req.user.restaurantId);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Error creando producto" });
  }
}

/**
 * Actualizar un producto existente
 */
export async function updateProductController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // 1. Validación de ID (Type narrowing)
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: "ID de producto inválido" });
    }

    // 2. Validación de tipos en el Body (Data Integrity)
    if (req.body.price !== undefined && typeof req.body.price !== "number") {
      return res.status(400).json({ error: "El precio debe ser un número válido" });
    }

    if (req.body.name !== undefined && typeof req.body.name !== "string") {
      return res.status(400).json({ error: "El nombre debe ser un texto" });
    }
    
    if (!req.user?.restaurantId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    // 3. Ejecución del servicio
    const updatedProduct = await updateProduct(id, req.body, req.user.restaurantId);

    if (!updatedProduct || (updatedProduct.count === 0)) {
      return res.status(404).json({ error: "Producto no encontrado o sin permisos" });
    }

    // 4. Respuesta completa
    res.json({ 
      message: "Producto actualizado con éxito",
      data: updatedProduct 
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message || "Error actualizando producto" });
  }
}

/**
 * Eliminar un producto
 */
export async function deleteProductController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    if (!req.user?.restaurantId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const result = await deleteProduct(id, req.user.restaurantId);

    if (result.count === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Error eliminando producto" });
  }
}