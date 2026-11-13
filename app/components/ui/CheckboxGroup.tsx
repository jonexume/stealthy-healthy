"use client";

interface Option {
  id: string;
  label: string;
  category?: string;
}

interface CheckboxGroupProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  legend: string;
  columns?: 1 | 2;
}

export default function CheckboxGroup({
  options,
  selected,
  onChange,
  legend,
  columns = 1,
}: CheckboxGroupProps) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
    );
  };

  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div
        className={`grid gap-2 ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}
      >
        {options.map((opt) => {
          const checked = selected.includes(opt.id);
          return (
            <label
              key={opt.id}
              className={[
                "flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer",
                "transition-colors duration-150 select-none",
                "focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-1",
                checked
                  ? "border-teal-500 bg-teal-50 text-teal-800"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              ].join(" ")}
            >
              <input
                type="checkbox"
                value={opt.id}
                checked={checked}
                onChange={() => toggle(opt.id)}
                className="sr-only"
              />
              <span
                className={[
                  "flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center",
                  checked ? "bg-teal-600 border-teal-600 text-white" : "border-slate-400",
                ].join(" ")}
                aria-hidden="true"
              >
                {checked && (
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="text-sm font-medium">{opt.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
