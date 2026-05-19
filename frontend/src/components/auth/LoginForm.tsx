import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { FormError } from "../common/FormError";
import { LoginFormData } from "../../types/auth.types";
import { useLogin } from "../../hooks/useLogin";

export function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const { isLoading, fieldErrors, apiError, handleLogin } = useLogin();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    await handleLogin(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <FormError message={apiError} />
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="name@example.com"
        value={formData.email}
        onChange={handleChange}
        error={fieldErrors.email}
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        error={fieldErrors.password}
        autoComplete="current-password"
      />
      <Button type="submit" fullWidth isLoading={isLoading}>
        Sign In
      </Button>
      <p className="text-center text-sm text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="text-brand-red-light hover:text-white font-medium transition-colors"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
