// ─── Shared domain types ────────────────────────────────────────────────────

export type TempUnit = "F" | "C";
export type MeasurementMethod = "oral" | "axillary" | "rectal" | "tympanic" | "temporal";

export interface TemperatureReading {
  id: string;
  valueF: number;          // always stored in °F internally
  unit: TempUnit;          // unit the user entered in
  method: MeasurementMethod;
  timestamp: string;       // ISO-8601
  notes?: string;
}

export type AgeGroup = "infant" | "child" | "teen" | "adult" | "senior";
export type BiologicalSex = "male" | "female" | "intersex" | "prefer_not_to_say";

export interface HealthProfile {
  displayName?: string;
  dateOfBirth?: string;    // ISO date – YYYY-MM-DD
  ageGroup?: AgeGroup;
  biologicalSex?: BiologicalSex;
  conditions: string[];
  allergies: string[];
  medications: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export type ContentCategory =
  | "fever"
  | "cold_flu"
  | "nutrition"
  | "mental_health"
  | "first_aid"
  | "preventive_care"
  | "medications";

export interface HealthTopic {
  id: string;
  title: string;
  category: ContentCategory;
  summary: string;
  body: string;             // Markdown-lite paragraphs
  sources: { label: string; url: string }[];
  reviewedBy: string;
  reviewedAt: string;
  tags: string[];
  /** SAMPLE_CONTENT flag must always be shown to users */
  isSample: true;
}

export type InsuranceType = "none" | "medicaid" | "medicare" | "private" | "chip";
export type CareType = "urgent_care" | "primary_care" | "telehealth" | "pharmacy" | "community_clinic" | "er";

export interface CareResource {
  id: string;
  name: string;
  type: CareType;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website?: string;
  acceptsInsurance: InsuranceType[];
  estimatedCostUSD?: { low: number; high: number };
  slidingScale: boolean;
  distanceMiles?: number;   // set at runtime relative to user
  hours: string;
  /** FICTIONAL_LISTING flag must always be shown */
  isFictional: true;
}

export type SymptomSeverity = "mild" | "moderate" | "severe";

export interface Symptom {
  id: string;
  label: string;
  category: string;
}

export interface SymptomIntake {
  symptoms: string[];       // symptom IDs
  duration: string;
  severity: SymptomSeverity;
  temperature?: TemperatureReading;
  additionalNotes?: string;
  profileSnapshot?: Partial<HealthProfile>;
  submittedAt: string;
}

export type SafetyLevel = "routine" | "monitor" | "seek_care" | "emergency";

export interface AssessmentResult {
  intakeId: string;
  safetyLevel: SafetyLevel;
  safetyMessage: string;
  safetyDetail: string;
  inputSummary: string[];
  educationalTopics: HealthTopic[];
  supportiveCareCards: { title: string; body: string; icon: string }[];
  sources: { label: string; url: string }[];
  generatedAt: string;
  /** Always PROTOTYPE – never real clinical output */
  isPrototype: true;
}

export type AdminReviewStatus = "pending" | "approved" | "rejected" | "needs_revision";

export interface ContentReviewItem {
  id: string;
  topicId: string;
  title: string;
  submittedBy: string;
  submittedAt: string;
  status: AdminReviewStatus;
  reviewerNotes?: string;
}

export type PrivacyChoice = "analytics" | "crashReports" | "locationServices" | "personalization";

export interface PrivacySettings {
  choices: Record<PrivacyChoice, boolean>;
  dataRetentionDays: number;
  exportRequestedAt?: string;
  deletionRequestedAt?: string;
}
