interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeMap = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" };

export default function Spinner({ size = "md", label = "Loading…" }: SpinnerProps) {
  return (
    <div role="status" className="flex flex-col items-center gap-3">
      <div
        className={`${sizeMap[size]} animate-spin rounded-full border-4 border-teal-200 border-t-teal-600`}
        aria-hidden="true"
      />
      <span className="text-sm text-slate-500">{label}</span>
    </div>
  );
}
