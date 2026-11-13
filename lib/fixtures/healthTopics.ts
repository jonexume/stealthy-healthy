import type { HealthTopic } from "../types";

/**
 * SAMPLE CONTENT — Educational only. Not reviewed by a licensed clinician.
 * Not for clinical decision-making.
 */
export const healthTopics: HealthTopic[] = [
  {
    id: "ht-001",
    title: "Understanding Fever in Adults",
    category: "fever",
    summary:
      "A fever is a temporary rise in body temperature, often caused by an infection. Most fevers resolve on their own within a few days.",
    body: `A fever is generally defined as a body temperature above 100.4°F (38°C) when measured orally. It is the body's natural response to infection or illness.

**Common causes** include viral infections (such as influenza or COVID-19), bacterial infections, heat exhaustion, and certain medications.

**When to monitor at home:** Low-grade fevers (100.4–102.2°F) in healthy adults usually don't require medical treatment beyond rest, fluids, and over-the-counter fever reducers.

**When to seek care:** Seek medical attention if your temperature exceeds 103°F (39.4°C), or if the fever lasts more than three days, or is accompanied by severe symptoms such as difficulty breathing, chest pain, or confusion.

**Measurement tips:** Different methods yield slightly different results. Rectal readings are most accurate; oral and tympanic are common for adults; axillary (underarm) tends to read lower.`,
    sources: [
      { label: "CDC — Fever Facts (sample reference)", url: "#" },
      { label: "Mayo Clinic — Fever Overview (sample reference)", url: "#" },
    ],
    reviewedBy: "Editorial Review Team (Prototype)",
    reviewedAt: "2026-10-01",
    tags: ["fever", "temperature", "adults", "infection"],
    isSample: true,
  },
  {
    id: "ht-002",
    title: "Fever in Children: What Parents Should Know",
    category: "fever",
    summary:
      "Children's fevers can be alarming, but most are mild and self-limiting. Knowing the thresholds helps parents decide when to call a doctor.",
    body: `Fever in children is one of the most common reasons parents seek medical advice. Understanding age-specific thresholds is important.

**Age-specific guidance (prototype — not clinical advice):**
- Infants under 3 months: Any temperature ≥100.4°F — call a doctor promptly.
- Infants 3–6 months: Fever ≥102°F warrants a call to your pediatrician.
- Children 6 months and older: Monitor symptoms; seek care if the fever exceeds 104°F or if the child appears very ill.

**General comfort measures** include ensuring adequate fluid intake, light clothing, and a comfortable room temperature. Acetaminophen or ibuprofen (for children over 6 months) may help with discomfort — always use weight-appropriate dosing.

**Do not use aspirin** in children under 18 due to the risk of Reye's syndrome.`,
    sources: [
      { label: "AAP — Fever and Your Child (sample reference)", url: "#" },
    ],
    reviewedBy: "Editorial Review Team (Prototype)",
    reviewedAt: "2026-10-01",
    tags: ["fever", "children", "pediatric", "parents"],
    isSample: true,
  },
  {
    id: "ht-003",
    title: "Cold vs. Flu: Key Differences",
    category: "cold_flu",
    summary:
      "Colds and flu share many symptoms, but the flu tends to come on faster and more severely. Learn how to tell them apart.",
    body: `Both the common cold and influenza (flu) are respiratory illnesses, but different viruses cause them and they differ in severity.

**Cold symptoms** typically develop gradually and include a runny or stuffy nose, sneezing, mild sore throat, and mild fatigue. Fever is rare in adults with a cold.

**Flu symptoms** come on suddenly and can be severe. They include fever (often 100–104°F), chills, body aches, headache, fatigue, and sometimes vomiting and diarrhea.

**Treatment:** Both are viral, so antibiotics won't help. Rest, fluids, and symptom management are the mainstays. Antiviral medications for flu (e.g., oseltamivir) are most effective when started within 48 hours of symptom onset — talk to a healthcare provider.

**Prevention:** Annual flu vaccination is recommended for most people over 6 months of age.`,
    sources: [
      { label: "CDC — Cold vs. Flu (sample reference)", url: "#" },
    ],
    reviewedBy: "Editorial Review Team (Prototype)",
    reviewedAt: "2026-10-01",
    tags: ["cold", "flu", "influenza", "virus", "symptoms"],
    isSample: true,
  },
  {
    id: "ht-004",
    title: "Staying Hydrated When You're Sick",
    category: "nutrition",
    summary:
      "Illness increases fluid loss. Staying hydrated supports recovery and helps your body fight infection.",
    body: `When you're sick — especially with a fever, vomiting, or diarrhea — your body loses fluids faster than normal. Dehydration can worsen symptoms and slow recovery.

**Good fluid choices:** Water, clear broths, herbal teas, and electrolyte solutions (such as sports drinks diluted with water) are all helpful. Coconut water can also provide natural electrolytes.

**What to limit:** Caffeinated beverages and alcohol can contribute to dehydration and are best avoided.

**Signs of dehydration** include dark urine, dry mouth, dizziness, and decreased urination. In severe cases, seek medical attention.

**For children:** Oral rehydration solutions (like Pedialyte) are specifically formulated for children and are preferred over sports drinks.`,
    sources: [
      { label: "MedlinePlus — Dehydration (sample reference)", url: "#" },
    ],
    reviewedBy: "Editorial Review Team (Prototype)",
    reviewedAt: "2026-10-01",
    tags: ["hydration", "fluids", "recovery", "nutrition", "sick"],
    isSample: true,
  },
  {
    id: "ht-005",
    title: "When to Go to the ER vs. Urgent Care",
    category: "first_aid",
    summary:
      "Choosing the right level of care saves time and money. Learn which symptoms warrant an ER visit versus urgent care.",
    body: `Not every health issue requires an emergency room visit, and understanding the difference can save you hours of waiting and significant cost.

**Go to the Emergency Room for:**
- Chest pain or pressure
- Difficulty breathing
- Signs of stroke (face drooping, arm weakness, speech difficulty)
- Severe allergic reaction
- Loss of consciousness
- Severe bleeding that won't stop
- High fever with stiff neck or rash

**Urgent Care is appropriate for:**
- Minor injuries (sprains, cuts needing stitches)
- Ear infections
- Urinary tract infections
- Mild to moderate fevers
- Sinus infections
- Nausea or vomiting without severe dehydration

**Telehealth** is a convenient option for many non-emergency conditions and prescription refills.`,
    sources: [
      { label: "ACEP — When to Use the ER (sample reference)", url: "#" },
    ],
    reviewedBy: "Editorial Review Team (Prototype)",
    reviewedAt: "2026-10-01",
    tags: ["emergency", "urgent care", "ER", "care levels"],
    isSample: true,
  },
  {
    id: "ht-006",
    title: "Rest and Sleep During Illness",
    category: "preventive_care",
    summary:
      "Sleep is one of the most effective recovery tools. Here's why rest matters and how to get more of it when you're sick.",
    body: `Sleep allows your immune system to do its most effective work. During sleep, your body produces cytokines — proteins that help fight infection and inflammation.

**How much rest do you need?** Most adults need 7–9 hours of sleep normally; during illness, your body may require more.

**Tips for better sleep when sick:**
- Keep the room cool and dark
- Use an extra pillow to elevate your head if congested
- Use a humidifier to ease breathing
- Avoid screens for at least 30 minutes before bed
- Honey in warm tea can soothe a sore throat and may help sleep

**Avoid overexertion.** Even if you feel slightly better, pushing too hard too early can extend recovery time.`,
    sources: [
      { label: "Sleep Foundation — Sleep and Immunity (sample reference)", url: "#" },
    ],
    reviewedBy: "Editorial Review Team (Prototype)",
    reviewedAt: "2026-10-01",
    tags: ["sleep", "rest", "recovery", "immunity"],
    isSample: true,
  },
  {
    id: "ht-007",
    title: "Over-the-Counter Fever Reducers",
    category: "medications",
    summary:
      "Acetaminophen and ibuprofen are the most common OTC fever reducers. Learn how they work and when to use each.",
    body: `Two over-the-counter medications are most commonly used to reduce fever: acetaminophen (e.g., Tylenol) and ibuprofen (e.g., Advil, Motrin).

**Acetaminophen** works by affecting the heat-regulating center in the brain. It is generally safe for all ages (including infants over 2 months with pediatric formulations) and does not irritate the stomach.

**Ibuprofen** is an NSAID that reduces fever, pain, and inflammation. It is not recommended for infants under 6 months. Take with food to reduce stomach irritation.

**Do not combine** both medications without medical guidance, and never exceed recommended doses. Overdosing on acetaminophen can cause serious liver damage.

**Note:** Fever reducers treat discomfort — they do not treat the underlying cause of the fever. If your fever is persistent or severe, seek medical care.

*Always read package instructions and consult a pharmacist or healthcare provider if you are unsure about appropriate dosing.*`,
    sources: [
      { label: "FDA — OTC Fever Reducers (sample reference)", url: "#" },
    ],
    reviewedBy: "Editorial Review Team (Prototype)",
    reviewedAt: "2026-10-01",
    tags: ["medications", "acetaminophen", "ibuprofen", "fever reducer", "OTC"],
    isSample: true,
  },
  {
    id: "ht-008",
    title: "Mental Health During Illness",
    category: "mental_health",
    summary:
      "Being sick can affect your mood and mental well-being. Here are strategies to support your mental health during recovery.",
    body: `Physical illness and mental health are closely connected. Being sick — especially for extended periods — can lead to feelings of frustration, anxiety, loneliness, or low mood.

**Why this happens:** Inflammatory chemicals released during illness can directly affect brain chemistry. Sleep disruption and reduced activity also contribute.

**Supportive strategies:**
- Stay connected: Text or call friends and family even if you can't visit in person
- Maintain a loose routine: Small structure can provide a sense of control
- Be kind to yourself: Acknowledge that it's okay not to be productive when unwell
- Limit news and social media if they increase anxiety
- Engage in light, enjoyable activities like reading or gentle stretching when able

**When to seek help:** If low mood or anxiety persists beyond your physical recovery, or if you have thoughts of self-harm, please reach out to a mental health professional or a crisis line.`,
    sources: [
      { label: "NIMH — Mental Health and Physical Illness (sample reference)", url: "#" },
    ],
    reviewedBy: "Editorial Review Team (Prototype)",
    reviewedAt: "2026-10-01",
    tags: ["mental health", "mood", "anxiety", "illness", "recovery"],
    isSample: true,
  },
];

export const getTopicById = (id: string) =>
  healthTopics.find((t) => t.id === id);

export const searchTopics = (query: string): HealthTopic[] => {
  const q = query.toLowerCase();
  return healthTopics.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.includes(q))
  );
};

export const getTopicsByCategory = (category: string) =>
  healthTopics.filter((t) => t.category === category);
