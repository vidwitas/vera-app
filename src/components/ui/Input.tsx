import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-ink font-body"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-3 rounded-2xl bg-sand border border-sand-dark text-ink placeholder:text-muted font-body text-sm",
            "focus:outline-none focus:ring-2 focus:ring-rust/40 focus:border-rust/60 transition-all",
            error && "border-red-400 focus:ring-red-300",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-body">{error}</p>}
        {hint && !error && <p className="text-xs text-muted font-body">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
