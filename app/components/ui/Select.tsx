"use client";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, options, placeholder, id, className = "", ...rest }, ref) => {
    const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-semibold text-slate-700">
            {label}
            {rest.required && (
              <span className="ml-1 text-red-500" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          className={[
            "w-full rounded-xl border bg-white px-4 py-3 text-slate-900 text-base",
            "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500",
            "disabled:bg-slate-50 disabled:cursor-not-allowed",
            "transition-colors duration-150 appearance-none",
            error ? "border-red-400" : "border-slate-300",
            className,
          ].filter(Boolean).join(" ")}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
        {error && (
          <p className="text-xs text-red-600 font-medium" role="alert">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
