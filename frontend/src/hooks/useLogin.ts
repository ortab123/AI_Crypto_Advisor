import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';
import { loginApi } from '../services/auth.service';
import { LoginFormData } from '../types/auth.types';
import { validateLoginForm } from '../utils/validation.utils';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const { login } = useAuthContext();
  const navigate = useNavigate();

  async function handleLogin(data: LoginFormData): Promise<void> {
    setApiError(null);
    const errors = validateLoginForm(data);
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});
    setIsLoading(true);
    try {
      const { user, token } = await loginApi(data);
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err))
        setApiError(err.response?.data?.message || 'Login failed. Please try again.');
      else setApiError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, fieldErrors, apiError, handleLogin };
}
