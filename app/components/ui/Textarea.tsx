"use client";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, id, className = "", ...rest }, ref) => {
    const areaId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={areaId} className="text-sm font-semibold text-slate-700">
            {label}
            {rest.required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          aria-invalid={!!error}
          rows={4}
          className={[
            "w-full rounded-xl border bg-white px-4 py-3 text-slate-900 text-base resize-y",
            "placeholder:text-slate-400",
            "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500",
            "disabled:bg-slate-50 disabled:cursor-not-allowed transition-colors duration-150",
            error ? "border-red-400" : "border-slate-300",
            className,
          ].filter(Boolean).join(" ")}
          {...rest}
        />
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
        {error && <p className="text-xs text-red-600 font-medium" role="alert">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
