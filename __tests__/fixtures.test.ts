/**
 * Unit tests for synthetic data fixtures and core logic.
 * These do NOT test UI rendering — they validate data shape and business logic.
 */
import { healthTopics, searchTopics, getTopicById } from "@/lib/fixtures/healthTopics";
import {
  temperatureHistory,
  categorizeTempF,
  fToC,
  cToF,
} from "@/lib/fixtures/temperatureHistory";
import { symptoms, symptomsByCategory, deriveAssessment } from "@/lib/fixtures/symptoms";
import { careResources, filterResources } from "@/lib/fixtures/careResources";
import { defaultProfile, sampleProfile } from "@/lib/fixtures/profile";

// ─── Health topics ────────────────────────────────────────────────────────────

describe("healthTopics fixture", () => {
  it("contains at least 5 topics", () => {
    expect(healthTopics.length).toBeGreaterThanOrEqual(5);
  });

  it("every topic has isSample: true", () => {
    healthTopics.forEach((t) => expect(t.isSample).toBe(true));
  });

  it("every topic has at least one source", () => {
    healthTopics.forEach((t) => expect(t.sources.length).toBeGreaterThan(0));
  });

  it("getTopicById returns the correct topic", () => {
    const topic = getTopicById("ht-001");
    expect(topic).toBeDefined();
    expect(topic?.id).toBe("ht-001");
  });

  it("getTopicById returns undefined for unknown id", () => {
    expect(getTopicById("not-a-real-id")).toBeUndefined();
  });

  it("searchTopics finds results by keyword", () => {
    const results = searchTopics("fever");
    expect(results.length).toBeGreaterThan(0);
    results.forEach((r) =>
      expect(
        r.title.toLowerCase().includes("fever") ||
          r.summary.toLowerCase().includes("fever") ||
          r.tags.some((t) => t.includes("fever"))
      ).toBe(true)
    );
  });

  it("searchTopics returns empty array for nonsense query", () => {
    expect(searchTopics("xyzzy_nonexistent_term_1234")).toHaveLength(0);
  });
});

// ─── Temperature helpers ──────────────────────────────────────────────────────

describe("temperature helpers", () => {
  it("fToC converts 98.6°F → 37°C", () => {
    expect(fToC(98.6)).toBe(37);
  });

  it("fToC converts 100.4°F → 38°C", () => {
    expect(fToC(100.4)).toBe(38);
  });

  it("cToF converts 37°C → 98.6°F", () => {
    expect(cToF(37)).toBe(98.6);
  });

  it("categorizeTempF: normal range", () => {
    expect(categorizeTempF(98.6)).toBe("normal");
    expect(categorizeTempF(97.0)).toBe("normal");
  });

  it("categorizeTempF: low-grade fever", () => {
    expect(categorizeTempF(99.6)).toBe("low_grade");
    expect(categorizeTempF(100.3)).toBe("low_grade");
  });

  it("categorizeTempF: fever", () => {
    expect(categorizeTempF(100.4)).toBe("fever");
    expect(categorizeTempF(102.5)).toBe("fever");
  });

  it("categorizeTempF: high fever", () => {
    expect(categorizeTempF(103.1)).toBe("high_fever");
    expect(categorizeTempF(105.0)).toBe("high_fever");
  });

  it("categorizeTempF: hypothermia", () => {
    expect(categorizeTempF(95.0)).toBe("hypothermia");
  });

  it("temperatureHistory has 14 synthetic readings", () => {
    expect(temperatureHistory).toHaveLength(14);
  });

  it("all readings have valueF in a plausible range", () => {
    temperatureHistory.forEach((r) => {
      expect(r.valueF).toBeGreaterThan(85);
      expect(r.valueF).toBeLessThan(110);
    });
  });
});

// ─── Symptoms ─────────────────────────────────────────────────────────────────

describe("symptoms fixture", () => {
  it("has at least 20 symptoms", () => {
    expect(symptoms.length).toBeGreaterThanOrEqual(20);
  });

  it("symptomsByCategory returns non-empty categories", () => {
    const cats = symptomsByCategory();
    expect(Object.keys(cats).length).toBeGreaterThan(0);
    Object.values(cats).forEach((items) => expect(items.length).toBeGreaterThan(0));
  });
});

describe("deriveAssessment", () => {
  const baseIntake = {
    symptoms: ["s-001"],
    duration: "1_to_2_days",
    severity: "mild" as const,
    submittedAt: "2026-11-13T10:00:00Z",
  };

  it("returns routine for mild single symptom", () => {
    const result = deriveAssessment(baseIntake);
    expect(result.safetyLevel).toBe("routine");
    expect(result.isPrototype).toBe(true);
  });

  it("returns monitor for moderate severity", () => {
    const result = deriveAssessment({ ...baseIntake, severity: "moderate" });
    expect(["monitor", "seek_care"]).toContain(result.safetyLevel);
  });

  it("returns seek_care or higher for high fever (103°F+)", () => {
    const result = deriveAssessment({
      ...baseIntake,
      temperature: { id: "t1", valueF: 103.5, unit: "F", method: "oral", timestamp: "2026-11-13T10:00:00Z" },
    });
    expect(["seek_care", "emergency"]).toContain(result.safetyLevel);
  });

  it("returns emergency for emergency-category symptom", () => {
    const result = deriveAssessment({ ...baseIntake, symptoms: ["s-024"] }); // chest pain
    expect(result.safetyLevel).toBe("emergency");
  });

  it("always includes at least one supportiveCareCard", () => {
    const result = deriveAssessment(baseIntake);
    expect(result.supportiveCareCards.length).toBeGreaterThan(0);
  });

  it("always includes at least one educationalTopic", () => {
    const result = deriveAssessment(baseIntake);
    expect(result.educationalTopics.length).toBeGreaterThan(0);
  });
});

// ─── Care resources ───────────────────────────────────────────────────────────

describe("careResources fixture", () => {
  it("contains at least 5 resources", () => {
    expect(careResources.length).toBeGreaterThanOrEqual(5);
  });

  it("every resource has isFictional: true", () => {
    careResources.forEach((r) => expect(r.isFictional).toBe(true));
  });

  it("filterResources with no opts returns all resources", () => {
    expect(filterResources({})).toHaveLength(careResources.length);
  });

  it("filterResources by insurance = none returns sliding-scale or free resources", () => {
    const results = filterResources({ insurance: "none" });
    results.forEach((r) => expect(r.acceptsInsurance).toContain("none"));
  });

  it("filterResources by maxCost = 0 returns only free resources", () => {
    const results = filterResources({ maxCost: 0 });
    results.forEach((r) =>
      expect(r.estimatedCostUSD?.low ?? 0).toBeLessThanOrEqual(0)
    );
  });

  it("filterResources by type returns only matching type", () => {
    const results = filterResources({ types: ["telehealth"] });
    results.forEach((r) => expect(r.type).toBe("telehealth"));
  });
});

// ─── Profile ─────────────────────────────────────────────────────────────────

describe("profile fixtures", () => {
  it("defaultProfile has empty arrays for conditions/allergies/medications", () => {
    expect(defaultProfile.conditions).toEqual([]);
    expect(defaultProfile.allergies).toEqual([]);
    expect(defaultProfile.medications).toEqual([]);
  });

  it("sampleProfile has at least one condition and one allergy", () => {
    expect(sampleProfile.conditions.length).toBeGreaterThan(0);
    expect(sampleProfile.allergies.length).toBeGreaterThan(0);
  });
});
