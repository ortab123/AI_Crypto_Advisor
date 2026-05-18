import { AuthLayout } from '../components/layout/AuthLayout';
import { RegisterForm } from '../components/auth/RegisterForm';

export function RegisterPage() {
  return (
    <AuthLayout title="Create an account" subtitle="Start your personalized crypto journey">
      <RegisterForm />
    </AuthLayout>
  );
}
