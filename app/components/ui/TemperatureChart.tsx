"use client";
import { useMemo } from "react";
import type { TemperatureReading } from "@/lib/types";

interface TemperatureChartProps {
  readings: TemperatureReading[];
  unit?: "F" | "C";
  height?: number;
}

const fToC = (f: number) => Math.round((f - 32) * (5 / 9) * 10) / 10;

const FEVER_F = 100.4;
const NORMAL_HIGH_F = 99.5;

export default function TemperatureChart({
  readings,
  unit = "F",
  height = 200,
}: TemperatureChartProps) {
  const data = useMemo(() => {
    const sorted = [...readings].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    return sorted.map((r) => ({
      ...r,
      display: unit === "C" ? fToC(r.valueF) : r.valueF,
      date: new Date(r.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));
  }, [readings, unit]);

  if (data.length === 0) return null;

  const values = data.map((d) => d.display);
  const minVal = Math.floor(Math.min(...values) - 0.5);
  const maxVal = Math.ceil(Math.max(...values) + 0.5);
  const range = maxVal - minVal || 1;

  const W = 320;
  const H = height;
  const PAD = { top: 16, right: 16, bottom: 40, left: 36 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const xOf = (i: number) => PAD.left + (i / Math.max(data.length - 1, 1)) * chartW;
  const yOf = (v: number) => PAD.top + chartH - ((v - minVal) / range) * chartH;

  const polyline = data.map((d, i) => `${xOf(i)},${yOf(d.display)}`).join(" ");

  // Reference lines in display unit
  const feverLine = unit === "C" ? fToC(FEVER_F) : FEVER_F;
  const normalLine = unit === "C" ? fToC(NORMAL_HIGH_F) : NORMAL_HIGH_F;

  const refLines = [
    { val: feverLine, label: `Fever ${unit === "F" ? "100.4°F" : "38°C"}`, dash: "4,3", color: "#dc2626" },
    { val: normalLine, label: `Normal high ${unit === "F" ? "99.5°F" : "37.5°C"}`, dash: "4,3", color: "#2563eb" },
  ];

  // Colour each point
  const pointColor = (f: number) => {
    if (unit === "C") {
      // convert back to F for comparison
      const ff = f * (9 / 5) + 32;
      return ff >= FEVER_F ? "#dc2626" : ff >= NORMAL_HIGH_F ? "#f59e0b" : "#0d9488";
    }
    return f >= FEVER_F ? "#dc2626" : f >= NORMAL_HIGH_F ? "#f59e0b" : "#0d9488";
  };

  return (
    <figure aria-label={`Temperature chart showing ${data.length} readings`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height }}
        role="img"
        aria-label="Line chart of temperature readings over time"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const val = minVal + frac * range;
          const y = yOf(val);
          return (
            <g key={frac}>
              <line
                x1={PAD.left}
                y1={y}
                x2={W - PAD.right}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 4}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-slate-400"
                fontSize="9"
              >
                {val.toFixed(1)}°
              </text>
            </g>
          );
        })}

        {/* Reference lines */}
        {refLines.map((r) => {
          if (r.val < minVal || r.val > maxVal) return null;
          const y = yOf(r.val);
          return (
            <g key={r.label}>
              <line
                x1={PAD.left}
                y1={y}
                x2={W - PAD.right}
                y2={y}
                stroke={r.color}
                strokeWidth="1.5"
                strokeDasharray={r.dash}
                opacity="0.6"
              />
            </g>
          );
        })}

        {/* Line */}
        <polyline
          points={polyline}
          fill="none"
          stroke="#0d9488"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Area fill */}
        <polyline
          points={`${xOf(0)},${PAD.top + chartH} ${polyline} ${xOf(data.length - 1)},${PAD.top + chartH}`}
          fill="url(#areaGrad)"
          opacity="0.15"
        />
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Points */}
        {data.map((d, i) => (
          <circle
            key={d.id}
            cx={xOf(i)}
            cy={yOf(d.display)}
            r={4}
            fill={pointColor(d.display)}
            stroke="white"
            strokeWidth="1.5"
            aria-label={`${d.date}: ${d.display}°${unit}`}
          />
        ))}

        {/* X-axis labels — show every Nth */}
        {data.map((d, i) => {
          const step = data.length <= 7 ? 1 : Math.ceil(data.length / 7);
          if (i % step !== 0 && i !== data.length - 1) return null;
          return (
            <text
              key={i}
              x={xOf(i)}
              y={H - 4}
              textAnchor="middle"
              fontSize="8"
              className="fill-slate-400"
            >
              {d.date}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <figcaption className="flex flex-wrap gap-x-4 gap-y-1 mt-2 px-2">
        {refLines.map((r) => (
          <span key={r.label} className="flex items-center gap-1 text-xs text-slate-500">
            <span
              className="inline-block w-4 h-0.5"
              style={{ background: r.color, opacity: 0.7 }}
              aria-hidden="true"
            />
            {r.label}
          </span>
        ))}
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-teal-600" aria-hidden="true" />
          Normal
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500" aria-hidden="true" />
          Low-grade
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600" aria-hidden="true" />
          Fever
        </span>
      </figcaption>
    </figure>
  );
}
