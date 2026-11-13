type AlertVariant = "info" | "success" | "warning" | "error" | "emergency";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
  /** Additional non-color descriptor for screen readers */
  statusLabel?: string;
}

const config: Record<
  AlertVariant,
  { border: string; bg: string; titleColor: string; bodyColor: string; icon: string; label: string }
> = {
  info: {
    border: "border-l-4 border-blue-500",
    bg: "bg-blue-50",
    titleColor: "text-blue-900",
    bodyColor: "text-blue-800",
    icon: "ℹ️",
    label: "Information",
  },
  success: {
    border: "border-l-4 border-teal-500",
    bg: "bg-teal-50",
    titleColor: "text-teal-900",
    bodyColor: "text-teal-800",
    icon: "✓",
    label: "Success",
  },
  warning: {
    border: "border-l-4 border-amber-500",
    bg: "bg-amber-50",
    titleColor: "text-amber-900",
    bodyColor: "text-amber-800",
    icon: "⚠",
    label: "Warning",
  },
  error: {
    border: "border-l-4 border-red-500",
    bg: "bg-red-50",
    titleColor: "text-red-900",
    bodyColor: "text-red-800",
    icon: "✕",
    label: "Error",
  },
  emergency: {
    border: "border-l-4 border-red-700",
    bg: "bg-red-100",
    titleColor: "text-red-900",
    bodyColor: "text-red-800",
    icon: "🚨",
    label: "Emergency",
  },
};

export default function Alert({
  variant = "info",
  title,
  children,
  className = "",
  statusLabel,
}: AlertProps) {
  const c = config[variant];
  return (
    <div
      role="alert"
      aria-label={statusLabel ?? c.label}
      className={[
        "rounded-xl px-4 py-4",
        c.border,
        c.bg,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start gap-3">
        {/* Icon is decorative — variant name alone conveys state to screen readers */}
        <span className="text-xl mt-0.5 select-none" aria-hidden="true">
          {c.icon}
        </span>
        <div>
          {title && (
            <p className={`font-bold text-sm mb-1 ${c.titleColor}`}>{title}</p>
          )}
          <div className={`text-sm leading-relaxed ${c.bodyColor}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}
