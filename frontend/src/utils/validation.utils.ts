// Accepts: user@example.com, user@example.co.il, user@sub.domain.org, etc.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;

// At least 8 chars, 1 letter (any case), 1 number
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

export function validateLoginForm(data: {
  email: string;
  password: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.email) errors.email = "Email is required";
  else if (!EMAIL_REGEX.test(data.email))
    errors.email = "Enter a valid email address";
  if (!data.password) errors.password = "Password is required";
  return errors;
}

export function validateRegisterForm(data: {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.email) errors.email = "Email is required";
  else if (!EMAIL_REGEX.test(data.email))
    errors.email = "Enter a valid email address";
  if (!data.name) errors.name = "Name is required";
  else if (data.name.length < 2)
    errors.name = "Name must be at least 2 characters";
  if (!data.password) errors.password = "Password is required";
  else if (!PASSWORD_REGEX.test(data.password))
    errors.password =
      "Password must be at least 8 characters with at least 1 letter and 1 number";
  if (!data.confirmPassword)
    errors.confirmPassword = "Please confirm your password";
  else if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords do not match";
  return errors;
}
