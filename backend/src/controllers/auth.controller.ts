import { Request, Response, NextFunction } from "express";
import { register, login } from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/response.utils";

export async function registerHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await register(req.body);
    sendSuccess(res, result, 201, "Registration successful");
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_TAKEN") {
      sendError(res, "Email is already registered", 409);
      return;
    }
    next(err);
  }
}

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await login(req.body);
    sendSuccess(res, result, 200, "Login successful");
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_CREDENTIALS") {
      sendError(res, "Invalid email or password", 401);
      return;
    }
    next(err);
  }
}
