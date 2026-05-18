import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import { registerApi } from "../services/auth.service";
import { RegisterFormData } from "../types/auth.types";
import { validateRegisterForm } from "../utils/validation.utils";

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const { login } = useAuthContext();
  const navigate = useNavigate();

  async function handleRegister(data: RegisterFormData): Promise<void> {
    setApiError(null);
    const errors = validateRegisterForm(data);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsLoading(true);
    try {
      const { email, name, password } = data;
      const { user, token, hasCompletedOnboarding } = await registerApi({
        email,
        name,
        password,
      });
      login(user, token, hasCompletedOnboarding);
      navigate(hasCompletedOnboarding ? "/dashboard" : "/onboarding");
    } catch (err) {
      if (axios.isAxiosError(err))
        setApiError(
          err.response?.data?.message ||
            "Registration failed. Please try again.",
        );
      else setApiError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, fieldErrors, apiError, handleRegister };
}
