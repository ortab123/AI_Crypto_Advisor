import apiClient from '../utils/api.utils';
import { ApiResponse } from '../types/api.types';
import { AuthUser, LoginFormData, RegisterFormData } from '../types/auth.types';

interface AuthPayload {
  token: string;
  user: AuthUser;
}

export async function loginApi(data: LoginFormData): Promise<AuthPayload> {
  const res = await apiClient.post<ApiResponse<AuthPayload>>('/auth/login', data);
  return res.data.data!;
}

export async function registerApi(
  data: Omit<RegisterFormData, 'confirmPassword'>
): Promise<AuthPayload> {
  const res = await apiClient.post<ApiResponse<AuthPayload>>('/auth/register', data);
  return res.data.data!;
}
