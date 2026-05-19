import { InputHTMLAttributes, forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const autoId = useId();
    const inputId = id || (label ? autoId : undefined);
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-white/70"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-2.5 rounded-lg bg-brand-slate border text-white placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-colors ${
            error
              ? "border-red-400"
              : "border-brand-border hover:border-brand-border-light"
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
