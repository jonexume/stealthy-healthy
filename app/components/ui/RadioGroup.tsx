"use client";

interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

interface RadioGroupProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  legend: string;
  columns?: 1 | 2 | 3;
}

export default function RadioGroup({
  options,
  value,
  onChange,
  legend,
  columns = 1,
}: RadioGroupProps) {
  const colClass = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3" }[columns];
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className={`grid gap-3 ${colClass}`}>
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <label
              key={opt.value}
              className={[
                "flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer",
                "transition-colors duration-150 select-none",
                "focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-1",
                selected
                  ? "border-teal-500 bg-teal-50 text-teal-800"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              ].join(" ")}
            >
              <input
                type="radio"
                value={opt.value}
                checked={selected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              {opt.icon && <span className="text-xl" aria-hidden="true">{opt.icon}</span>}
              <div className="flex-1">
                <span className="text-sm font-semibold block">{opt.label}</span>
                {opt.description && (
                  <span className="text-xs text-slate-500">{opt.description}</span>
                )}
              </div>
              <span
                className={[
                  "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  selected ? "border-teal-600" : "border-slate-400",
                ].join(" ")}
                aria-hidden="true"
              >
                {selected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600 block" />
                )}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
