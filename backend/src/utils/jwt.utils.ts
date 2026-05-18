import jwt from "jsonwebtoken";
import { env } from "../config/env.config";
import { JwtPayload } from "../types/auth.types";

export function signToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

export function extractBearerToken(
  authHeader: string | undefined,
): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
}
