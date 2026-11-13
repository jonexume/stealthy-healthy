import type { Symptom, AssessmentResult, SymptomIntake, SafetyLevel } from "../types";
import { healthTopics } from "./healthTopics";

export const symptoms: Symptom[] = [
  // General
  { id: "s-001", label: "Fever", category: "General" },
  { id: "s-002", label: "Chills", category: "General" },
  { id: "s-003", label: "Fatigue", category: "General" },
  { id: "s-004", label: "Loss of appetite", category: "General" },
  { id: "s-005", label: "Night sweats", category: "General" },
  // Head & Neck
  { id: "s-006", label: "Headache", category: "Head & Neck" },
  { id: "s-007", label: "Sore throat", category: "Head & Neck" },
  { id: "s-008", label: "Stiff neck", category: "Head & Neck" },
  { id: "s-009", label: "Ear pain", category: "Head & Neck" },
  { id: "s-010", label: "Swollen lymph nodes", category: "Head & Neck" },
  // Respiratory
  { id: "s-011", label: "Cough", category: "Respiratory" },
  { id: "s-012", label: "Runny nose", category: "Respiratory" },
  { id: "s-013", label: "Nasal congestion", category: "Respiratory" },
  { id: "s-014", label: "Shortness of breath", category: "Respiratory" },
  { id: "s-015", label: "Wheezing", category: "Respiratory" },
  // Gastrointestinal
  { id: "s-016", label: "Nausea", category: "Gastrointestinal" },
  { id: "s-017", label: "Vomiting", category: "Gastrointestinal" },
  { id: "s-018", label: "Diarrhea", category: "Gastrointestinal" },
  { id: "s-019", label: "Stomach pain", category: "Gastrointestinal" },
  { id: "s-020", label: "Loss of taste or smell", category: "Gastrointestinal" },
  // Musculoskeletal
  { id: "s-021", label: "Body aches", category: "Musculoskeletal" },
  { id: "s-022", label: "Joint pain", category: "Musculoskeletal" },
  { id: "s-023", label: "Muscle weakness", category: "Musculoskeletal" },
  // Serious (high urgency)
  { id: "s-024", label: "Chest pain or pressure", category: "Serious" },
  { id: "s-025", label: "Confusion or altered mental state", category: "Serious" },
  { id: "s-026", label: "Difficulty breathing", category: "Serious" },
  { id: "s-027", label: "Rash with fever", category: "Serious" },
  { id: "s-028", label: "Persistent vomiting (can't keep fluids down)", category: "Serious" },
];

export const symptomsByCategory = (): Record<string, Symptom[]> => {
  return symptoms.reduce<Record<string, Symptom[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});
};

const EMERGENCY_SYMPTOM_IDS = ["s-024", "s-025", "s-026", "s-027", "s-028"];

/**
 * Deterministic (non-AI) safety categorisation for prototype use.
 * NOT a clinical algorithm — for demonstration only.
 */
export const deriveAssessment = (intake: SymptomIntake): AssessmentResult => {
  const hasEmergency = intake.symptoms.some((id) =>
    EMERGENCY_SYMPTOM_IDS.includes(id)
  );
  const tempF = intake.temperature?.valueF ?? null;
  const isHighFever = tempF !== null && tempF >= 103;
  const isModerate = intake.severity === "moderate";
  const isSevere = intake.severity === "severe";

  let safetyLevel: SafetyLevel = "routine";
  if (hasEmergency) safetyLevel = "emergency";
  else if (isHighFever || isSevere) safetyLevel = "seek_care";
  else if (isModerate || (tempF !== null && tempF >= 100.4)) safetyLevel = "monitor";

  const messages: Record<SafetyLevel, { message: string; detail: string }> = {
    routine: {
      message: "Your symptoms appear mild.",
      detail:
        "Based on what you've shared, your symptoms seem mild. Rest, stay hydrated, and monitor how you feel. This is not medical advice — if you're unsure, consult a healthcare provider.",
    },
    monitor: {
      message: "Keep an eye on your symptoms.",
      detail:
        "Some of your symptoms warrant monitoring. Rest and stay hydrated. If symptoms worsen or persist beyond 3 days, consider contacting a healthcare provider. This is not medical advice.",
    },
    seek_care: {
      message: "Consider contacting a healthcare provider.",
      detail:
        "Based on your inputs, it may be a good idea to contact a healthcare provider. This is not a diagnosis — only a qualified clinician can assess your condition.",
    },
    emergency: {
      message: "Some symptoms may need urgent attention.",
      detail:
        "You reported symptoms that can sometimes indicate a serious condition. If you are experiencing a medical emergency, call 911 or go to your nearest emergency room immediately. This prototype cannot assess medical emergencies.",
    },
  };

  const relevantTopics = healthTopics.filter((t) =>
    intake.symptoms.some(
      (id) =>
        (id === "s-001" && ["fever", "cold_flu"].includes(t.category)) ||
        (["s-011", "s-012", "s-013"].includes(id) && t.category === "cold_flu") ||
        (id === "s-016" && t.category === "nutrition")
    )
  ).slice(0, 3);

  const inputSummaryLines: string[] = [];
  const symptomLabels = intake.symptoms
    .map((id) => symptoms.find((s) => s.id === id)?.label)
    .filter(Boolean);
  if (symptomLabels.length)
    inputSummaryLines.push(`Symptoms: ${symptomLabels.join(", ")}`);
  if (tempF)
    inputSummaryLines.push(
      `Temperature: ${tempF}°F${intake.temperature?.method ? ` (${intake.temperature.method})` : ""}`
    );
  inputSummaryLines.push(`Severity: ${intake.severity}`);
  inputSummaryLines.push(`Duration: ${intake.duration}`);

  return {
    intakeId: intake.submittedAt,
    safetyLevel,
    safetyMessage: messages[safetyLevel].message,
    safetyDetail: messages[safetyLevel].detail,
    inputSummary: inputSummaryLines,
    educationalTopics: relevantTopics.length ? relevantTopics : [healthTopics[0]],
    supportiveCareCards: [
      {
        icon: "💧",
        title: "Stay Hydrated",
        body: "Drink water, clear broths, or electrolyte drinks. Aim for at least 8 cups a day — more if you have a fever.",
      },
      {
        icon: "🛏️",
        title: "Rest",
        body: "Your body repairs itself during rest. Aim for 8–10 hours of sleep and avoid overexertion.",
      },
      {
        icon: "🌡️",
        title: "Monitor Temperature",
        body: "Log your temperature every 4–6 hours to track trends. Note the time and measurement method.",
      },
      {
        icon: "🏥",
        title: "Know When to Seek Help",
        body: "Contact a provider if your fever exceeds 103°F, symptoms worsen, or you have difficulty breathing.",
      },
    ],
    sources: [
      { label: "CDC — General Illness Guidance (sample reference)", url: "#" },
      { label: "MedlinePlus — Symptoms Overview (sample reference)", url: "#" },
    ],
    generatedAt: new Date().toISOString(),
    isPrototype: true,
  };
};
