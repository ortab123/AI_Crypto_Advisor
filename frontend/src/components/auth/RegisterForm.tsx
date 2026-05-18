import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { FormError } from "../common/FormError";
import { RegisterFormData } from "../../types/auth.types";
import { useRegister } from "../../hooks/useRegister";

export function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const { isLoading, fieldErrors, apiError, handleRegister } = useRegister();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    await handleRegister(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <FormError message={apiError} />
      <Input
        label="Full Name"
        type="text"
        name="name"
        placeholder="Israel Israeli"
        value={formData.name}
        onChange={handleChange}
        error={fieldErrors.name}
        autoComplete="name"
      />
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="Crypto@movoe.com"
        value={formData.email}
        onChange={handleChange}
        error={fieldErrors.email}
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={fieldErrors.password}
        autoComplete="new-password"
      />
      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={fieldErrors.confirmPassword}
        autoComplete="new-password"
      />
      <Button type="submit" fullWidth isLoading={isLoading}>
        Create Account
      </Button>
      <p className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-brand-red-light hover:text-white font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
