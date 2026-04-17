import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = "supersecret";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const token = authHeader.split(" ")[1];
    console.log("SECRET:", SECRET);
console.log("TOKEN:", token);

    const decoded = jwt.verify(token, SECRET) as any;

    req.user = {
      userId: decoded.userId,
      restaurantId: decoded.restaurantId,
      role: decoded.role,
    };

    next();
  } 
catch (error: any) {
  if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expirado" });
  }

  return res.status(401).json({ error: "Token inválido" });
}
}