interface FormErrorProps {
  message: string | null;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;
  return (
    <div className="p-3 rounded-lg bg-red-900/30 border border-red-700/50 text-sm text-red-300">
      {message}
    </div>
  );
}
