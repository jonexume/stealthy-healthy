import type { HealthProfile, PrivacySettings, ContentReviewItem } from "../types";

/** Default empty profile — all optional fields unknown */
export const defaultProfile: HealthProfile = {
  displayName: undefined,
  dateOfBirth: undefined,
  ageGroup: undefined,
  biologicalSex: undefined,
  conditions: [],
  allergies: [],
  medications: [],
  emergencyContact: undefined,
};

/** Sample completed profile for demonstration */
export const sampleProfile: HealthProfile = {
  displayName: "Alex",
  dateOfBirth: "1990-06-15",
  ageGroup: "adult",
  biologicalSex: "prefer_not_to_say",
  conditions: ["Seasonal allergies", "Asthma (mild)"],
  allergies: ["Penicillin"],
  medications: ["Cetirizine 10 mg daily", "Albuterol inhaler (as needed)"],
  emergencyContact: {
    name: "Jordan Smith",
    phone: "555-020-0001",
    relationship: "Partner",
  },
};

export const defaultPrivacySettings: PrivacySettings = {
  choices: {
    analytics: false,
    crashReports: true,
    locationServices: false,
    personalization: false,
  },
  dataRetentionDays: 90,
};

/** Synthetic admin content review queue */
export const contentReviewQueue: ContentReviewItem[] = [
  {
    id: "rev-001",
    topicId: "ht-draft-001",
    title: "Managing Seasonal Allergies",
    submittedBy: "content@example.com",
    submittedAt: "2026-11-01T10:00:00Z",
    status: "pending",
  },
  {
    id: "rev-002",
    topicId: "ht-draft-002",
    title: "Childhood Vaccination Schedule Overview",
    submittedBy: "content@example.com",
    submittedAt: "2026-10-28T14:30:00Z",
    status: "needs_revision",
    reviewerNotes:
      "Please add sources for the schedule table and clarify that this reflects US CDC guidance only.",
  },
  {
    id: "rev-003",
    topicId: "ht-001",
    title: "Understanding Fever in Adults",
    submittedBy: "content@example.com",
    submittedAt: "2026-09-15T09:00:00Z",
    status: "approved",
    reviewerNotes: "Well sourced and clearly written. Approved for publication.",
  },
  {
    id: "rev-004",
    topicId: "ht-draft-003",
    title: "Home Remedies for Sore Throat",
    submittedBy: "contributor2@example.com",
    submittedAt: "2026-11-05T11:00:00Z",
    status: "rejected",
    reviewerNotes:
      "Includes unsubstantiated claims. Please revise with evidence-based content only.",
  },
  {
    id: "rev-005",
    topicId: "ht-draft-004",
    title: "Recognising Signs of Dehydration",
    submittedBy: "content@example.com",
    submittedAt: "2026-11-10T16:00:00Z",
    status: "pending",
  },
];
