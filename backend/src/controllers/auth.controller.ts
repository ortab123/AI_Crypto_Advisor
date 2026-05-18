import { Request, Response, NextFunction } from "express";
import { register, login } from "../services/auth.service";
import {
  findUserById,
  updateUserName,
  updateUserPassword,
} from "../services/user.service";
import { comparePassword, hashPassword } from "../utils/password.utils";
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

export async function updateNameHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2) {
      sendError(res, "Name must be at least 2 characters", 400);
      return;
    }
    const updated = await updateUserName(req.user!.userId, name.trim());
    sendSuccess(res, updated, 200, "Name updated");
  } catch (err) {
    next(err);
  }
}

export async function updatePasswordHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await findUserById(req.user!.userId);
    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) {
      sendError(res, "Current password is incorrect", 401);
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      sendError(res, "New password must be at least 8 characters", 400);
      return;
    }
    await updateUserPassword(user.id, await hashPassword(newPassword));
    sendSuccess(res, null, 200, "Password updated");
  } catch (err) {
    next(err);
  }
}
