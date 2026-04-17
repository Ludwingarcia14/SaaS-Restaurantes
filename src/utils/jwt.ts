import jwt from "jsonwebtoken";

const SECRET = "supersecret"; // luego env

export function generateToken(payload: any) {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}