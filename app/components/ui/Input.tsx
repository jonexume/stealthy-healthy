"use client";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, hint, error, leftAddon, rightAddon, id, className = "", ...rest },
    ref
  ) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-slate-700"
          >
            {label}
            {rest.required && (
              <span className="ml-1 text-red-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <span className="absolute left-3 text-slate-400 pointer-events-none">
              {leftAddon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-describedby={
              [hint && `${inputId}-hint`, error && `${inputId}-error`]
                .filter(Boolean)
                .join(" ") || undefined
            }
            aria-invalid={!!error}
            className={[
              "w-full rounded-xl border bg-white px-4 py-3 text-slate-900",
              "placeholder:text-slate-400 text-base",
              "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500",
              "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
              "transition-colors duration-150",
              error ? "border-red-400" : "border-slate-300",
              leftAddon ? "pl-10" : "",
              rightAddon ? "pr-10" : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...rest}
          />
          {rightAddon && (
            <span className="absolute right-3 text-slate-400 pointer-events-none">
              {rightAddon}
            </span>
          )}
        </div>
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-slate-500">
            {hint}
          </p>
        )}
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs text-red-600 font-medium"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
