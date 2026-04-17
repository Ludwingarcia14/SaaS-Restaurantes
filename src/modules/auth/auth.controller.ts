import { Request, Response } from "express";
import { login, register, getMe } from "./auth.service";

/**
 * Registro de nuevos usuarios y restaurantes
 */
export async function registerController(req: Request, res: Response) {
  try {
    const { email, password, restaurantName } = req.body;

    // 1. Validación de Email
    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ error: "Email inválido o vacío" });
    }

    // 2. Validación de Password
    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ error: "El password debe tener al menos 6 caracteres" });
    }

    // 3. Validación de Nombre del Restaurante
    if (!restaurantName || typeof restaurantName !== "string" || !restaurantName.trim()) {
      return res.status(400).json({ error: "Nombre de restaurante inválido o vacío" });
    }

    // 4. Ejecución enviando datos sanitizados
    const result = await register({ 
      email: email.trim(), 
      password,
      restaurantName: restaurantName.trim() 
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: error.message || "Error durante el registro",
    });
  }
}

/**
 * Inicio de sesión
 */
export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ error: "El email es requerido" });
    }
    if (!password || typeof password !== "string") {
      return res.status(400).json({ error: "El password es requerido" });
    }

    const result = await login({ 
      email: email.trim(), 
      password 
    });
    
    res.json(result);
  } catch (error: any) {
    res.status(401).json({
      error: error.message || "Credenciales inválidas",
    });
  }
}

/**
 * Obtener perfil del usuario autenticado
 */
export async function getMeController(req: Request, res: Response) {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const result = await getMe(req.user.userId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Error interno del servidor" 
    });
  }
}