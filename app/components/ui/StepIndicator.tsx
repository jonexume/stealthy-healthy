interface StepIndicatorProps {
  total: number;
  current: number; // 1-indexed
  labels?: string[];
}

export default function StepIndicator({ total, current, labels }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress steps">
      <ol className="flex items-center w-full">
        {Array.from({ length: total }).map((_, i) => {
          const step = i + 1;
          const isDone = step < current;
          const isActive = step === current;
          return (
            <li
              key={step}
              className={`flex items-center ${i < total - 1 ? "flex-1" : ""}`}
              aria-current={isActive ? "step" : undefined}
            >
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors",
                    isDone
                      ? "bg-teal-600 border-teal-600 text-white"
                      : isActive
                      ? "bg-white border-teal-600 text-teal-600"
                      : "bg-white border-slate-300 text-slate-400",
                  ].join(" ")}
                >
                  {isDone ? (
                    <span aria-label="Completed">✓</span>
                  ) : (
                    <span>{step}</span>
                  )}
                </div>
                {labels?.[i] && (
                  <span
                    className={`mt-1 text-xs font-medium hidden sm:block ${
                      isActive ? "text-teal-700" : "text-slate-400"
                    }`}
                  >
                    {labels[i]}
                  </span>
                )}
              </div>
              {i < total - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mt-[-16px] ${
                    isDone ? "bg-teal-500" : "bg-slate-200"
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
