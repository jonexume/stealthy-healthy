import type { TemperatureReading } from "../types";

/**
 * Synthetic temperature log — 14 days of sample data.
 * Values are fabricated for UI demonstration only.
 */
export const temperatureHistory: TemperatureReading[] = [
  {
    id: "tr-001",
    valueF: 98.6,
    unit: "F",
    method: "oral",
    timestamp: "2026-10-30T08:15:00Z",
    notes: "Morning reading, feeling fine",
  },
  {
    id: "tr-002",
    valueF: 99.1,
    unit: "F",
    method: "oral",
    timestamp: "2026-10-31T07:45:00Z",
  },
  {
    id: "tr-003",
    valueF: 100.2,
    unit: "F",
    method: "oral",
    timestamp: "2026-11-01T09:00:00Z",
    notes: "Started feeling off",
  },
  {
    id: "tr-004",
    valueF: 101.4,
    unit: "F",
    method: "tympanic",
    timestamp: "2026-11-01T18:30:00Z",
    notes: "Worse in the evening",
  },
  {
    id: "tr-005",
    valueF: 102.8,
    unit: "F",
    method: "oral",
    timestamp: "2026-11-02T08:00:00Z",
    notes: "Highest yet — resting, fluids",
  },
  {
    id: "tr-006",
    valueF: 102.1,
    unit: "F",
    method: "oral",
    timestamp: "2026-11-02T20:00:00Z",
    notes: "Slight improvement",
  },
  {
    id: "tr-007",
    valueF: 101.0,
    unit: "F",
    method: "oral",
    timestamp: "2026-11-03T08:30:00Z",
  },
  {
    id: "tr-008",
    valueF: 100.4,
    unit: "F",
    method: "temporal",
    timestamp: "2026-11-03T19:00:00Z",
  },
  {
    id: "tr-009",
    valueF: 99.8,
    unit: "F",
    method: "oral",
    timestamp: "2026-11-04T08:00:00Z",
    notes: "Improving",
  },
  {
    id: "tr-010",
    valueF: 99.2,
    unit: "F",
    method: "oral",
    timestamp: "2026-11-05T08:15:00Z",
  },
  {
    id: "tr-011",
    valueF: 98.9,
    unit: "F",
    method: "oral",
    timestamp: "2026-11-06T08:00:00Z",
  },
  {
    id: "tr-012",
    valueF: 98.7,
    unit: "F",
    method: "oral",
    timestamp: "2026-11-07T08:10:00Z",
    notes: "Back to normal",
  },
  {
    id: "tr-013",
    valueF: 98.6,
    unit: "F",
    method: "oral",
    timestamp: "2026-11-10T07:55:00Z",
  },
  {
    id: "tr-014",
    valueF: 98.5,
    unit: "F",
    method: "oral",
    timestamp: "2026-11-13T08:20:00Z",
    notes: "Current reading",
  },
];

export const fToC = (f: number): number =>
  Math.round((f - 32) * (5 / 9) * 10) / 10;

export const cToF = (c: number): number =>
  Math.round((c * (9 / 5) + 32) * 10) / 10;

export const normalRangeF = { low: 97.0, high: 99.5 };
export const lowGradeFeverF = { low: 99.5, high: 100.4 };
export const feverF = { low: 100.4, high: 103.0 };
export const highFeverF = { low: 103.0, high: 999 };

export type TempCategory = "normal" | "low_grade" | "fever" | "high_fever" | "hypothermia";

export const categorizeTempF = (f: number): TempCategory => {
  if (f < 96.0) return "hypothermia";
  if (f < normalRangeF.high) return "normal";
  if (f < lowGradeFeverF.high) return "low_grade";
  if (f < feverF.high) return "fever";
  return "high_fever";
};
