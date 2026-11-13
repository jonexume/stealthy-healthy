import type { CareResource } from "../types";

/**
 * FICTIONAL LISTINGS — All names, addresses, phone numbers, and details are
 * entirely invented for prototype demonstration purposes only.
 * Do not attempt to contact these locations.
 */
export const careResources: CareResource[] = [
  {
    id: "cr-001",
    name: "Riverview Community Health Center",
    type: "community_clinic",
    address: "142 Maple Street",
    city: "Springfield",
    state: "IL",
    zip: "62701",
    phone: "555-010-0001",
    website: "#",
    acceptsInsurance: ["medicaid", "medicare", "chip", "none"],
    estimatedCostUSD: { low: 0, high: 40 },
    slidingScale: true,
    distanceMiles: 1.2,
    hours: "Mon–Fri 8 AM–6 PM, Sat 9 AM–1 PM",
    isFictional: true,
  },
  {
    id: "cr-002",
    name: "QuickCare Urgent Care — Downtown",
    type: "urgent_care",
    address: "800 Central Ave, Suite 2",
    city: "Springfield",
    state: "IL",
    zip: "62702",
    phone: "555-010-0002",
    website: "#",
    acceptsInsurance: ["private", "medicare", "medicaid"],
    estimatedCostUSD: { low: 100, high: 200 },
    slidingScale: false,
    distanceMiles: 2.4,
    hours: "Daily 8 AM–10 PM",
    isFictional: true,
  },
  {
    id: "cr-003",
    name: "MendWell Telehealth",
    type: "telehealth",
    address: "Online only",
    city: "Nationwide",
    state: "US",
    zip: "00000",
    phone: "555-010-0003",
    website: "#",
    acceptsInsurance: ["private", "medicaid", "medicare"],
    estimatedCostUSD: { low: 49, high: 75 },
    slidingScale: false,
    distanceMiles: 0,
    hours: "24/7",
    isFictional: true,
  },
  {
    id: "cr-004",
    name: "Greenfield Family Practice",
    type: "primary_care",
    address: "305 Oak Boulevard",
    city: "Shelbyville",
    state: "IL",
    zip: "62565",
    phone: "555-010-0004",
    website: "#",
    acceptsInsurance: ["private", "medicaid", "medicare", "chip"],
    estimatedCostUSD: { low: 150, high: 300 },
    slidingScale: false,
    distanceMiles: 5.7,
    hours: "Mon–Fri 8 AM–5 PM",
    isFictional: true,
  },
  {
    id: "cr-005",
    name: "Lakeside Pharmacy & Wellness",
    type: "pharmacy",
    address: "19 Harbor Drive",
    city: "Springfield",
    state: "IL",
    zip: "62703",
    phone: "555-010-0005",
    website: "#",
    acceptsInsurance: ["private", "medicaid", "medicare", "chip", "none"],
    estimatedCostUSD: { low: 10, high: 50 },
    slidingScale: false,
    distanceMiles: 0.8,
    hours: "Mon–Sat 8 AM–9 PM, Sun 10 AM–6 PM",
    isFictional: true,
  },
  {
    id: "cr-006",
    name: "St. Agnes Medical Center — Emergency",
    type: "er",
    address: "1 Hospital Way",
    city: "Springfield",
    state: "IL",
    zip: "62704",
    phone: "555-010-0006",
    website: "#",
    acceptsInsurance: ["private", "medicaid", "medicare", "chip", "none"],
    estimatedCostUSD: { low: 500, high: 3000 },
    slidingScale: true,
    distanceMiles: 3.1,
    hours: "24/7",
    isFictional: true,
  },
  {
    id: "cr-007",
    name: "Hope Street Free Clinic",
    type: "community_clinic",
    address: "77 Hope Street",
    city: "Springfield",
    state: "IL",
    zip: "62701",
    phone: "555-010-0007",
    acceptsInsurance: ["none", "medicaid", "chip"],
    estimatedCostUSD: { low: 0, high: 0 },
    slidingScale: true,
    distanceMiles: 1.9,
    hours: "Tue & Thu 10 AM–4 PM, Sat 9 AM–12 PM",
    isFictional: true,
  },
  {
    id: "cr-008",
    name: "ClearPath Mental Health Clinic",
    type: "primary_care",
    address: "420 Wellness Way",
    city: "Springfield",
    state: "IL",
    zip: "62702",
    phone: "555-010-0008",
    website: "#",
    acceptsInsurance: ["private", "medicaid", "medicare"],
    estimatedCostUSD: { low: 80, high: 200 },
    slidingScale: true,
    distanceMiles: 4.0,
    hours: "Mon–Thu 9 AM–7 PM, Fri 9 AM–5 PM",
    isFictional: true,
  },
];

export const filterResources = (opts: {
  insurance?: string;
  maxCost?: number;
  types?: string[];
}): CareResource[] => {
  return careResources.filter((r) => {
    if (opts.insurance && opts.insurance !== "any") {
      if (!r.acceptsInsurance.includes(opts.insurance as never)) return false;
    }
    if (opts.maxCost !== undefined && r.estimatedCostUSD) {
      if (r.estimatedCostUSD.low > opts.maxCost) return false;
    }
    if (opts.types && opts.types.length > 0) {
      if (!opts.types.includes(r.type)) return false;
    }
    return true;
  });
};
