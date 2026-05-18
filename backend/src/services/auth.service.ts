import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
} from "../types/auth.types";
import { createUser, findUserByEmail, emailExists } from "./user.service";
import { getPreferences } from "./onboarding.service";
import { comparePassword } from "../utils/password.utils";
import { signToken } from "../utils/jwt.utils";

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  if (await emailExists(data.email)) {
    throw new Error("EMAIL_TAKEN");
  }
  const user = await createUser(data);
  const token = signToken({ userId: user.id, email: user.email });
  return {
    token,
    user: { id: user.id, email: user.email, name: user.name },
    hasCompletedOnboarding: false,
  };
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const user = await findUserByEmail(data.email);
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const valid = await comparePassword(data.password, user.password);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

  const token = signToken({ userId: user.id, email: user.email });
  const preferences = await getPreferences(user.id);
  return {
    token,
    user: { id: user.id, email: user.email, name: user.name },
    hasCompletedOnboarding: preferences !== null,
  };
}
