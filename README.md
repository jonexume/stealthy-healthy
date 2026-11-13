# Stealthy Healthy — Prototype

A mobile-first interactive health companion prototype built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**.

---

## ⚠ Important disclaimers

| What this is | What this is NOT |
|---|---|
| A UI/UX prototype for demonstration | A production application |
| Educational reference content only | Clinically reviewed medical advice |
| Synthetic / invented data throughout | Real patient or clinical data |
| A rule-based safety categorisation | A clinical assessment algorithm |
| Fictional care provider listings | Real clinics, pharmacies, or ERs |
| Simulated auth (any credentials work) | Real authentication |
| Session-only storage (no persistence) | A data store |

**If you are experiencing a medical emergency, call 911.**

---

## Quick start

```bash
cd stealthy-healthy
npm install
npm run dev        # → http://localhost:3000
```

---

## Routes

| Route | Screen |
|---|---|
| `/` | Welcome — browse as guest or sign in |
| `/sign-in` | Simulated sign-in (any email/password) |
| `/home` | Home — search bar + 3 action cards |
| `/search` | Search results with category filters |
| `/topics/[id]` | Health topic detail |
| `/temperature` | Temperature entry form |
| `/symptoms` | 5-step guided symptom intake |
| `/results` | Assessment results layout |
| `/care` | Care resources with filters |
| `/history` | Temperature history + chart |
| `/profile` | 4-step progressive health profile |
| `/privacy` | Privacy settings |
| `/admin` | Content review admin queue |

---

## What is mocked / synthetic

### All health content (`lib/fixtures/healthTopics.ts`)
Eight sample educational articles created for prototype purposes. They are **labelled as SAMPLE CONTENT** in the UI. No content has been reviewed by a licensed clinician. Sources listed as "(sample reference)" are not real citations.

### All care resource listings (`lib/fixtures/careResources.ts`)
Eight entirely fictional listings. Names, addresses, phone numbers, hours, and insurance acceptance are all invented. Every card is **labelled FICTIONAL LISTING**. Do not attempt to contact these locations.

### Temperature history (`lib/fixtures/temperatureHistory.ts`)
Fourteen synthetic readings spanning a simulated illness episode. No real medical device is used or simulated.

### Symptom assessment logic (`lib/fixtures/symptoms.ts → deriveAssessment`)
A simple deterministic rule set (not AI, not clinical):
- Emergency symptoms → `emergency`
- High fever (≥103°F) or severe → `seek_care`
- Moderate or low-grade fever → `monitor`
- Otherwise → `routine`

This is **not a diagnostic algorithm**. It exists only to demonstrate the UI.

### Authentication (`/sign-in`)
Any email/password combination navigates to `/home`. No tokens, sessions, or user records are created.

### Profile data
Stored in component state only. Lost on page refresh. Never transmitted anywhere.

### Privacy controls
Toggle states are stored in component state for the session. No data is actually collected, retained, or deleted.

---

## What is NOT ready for production

- [ ] Real authentication and authorisation
- [ ] Database / persistent storage
- [ ] Real clinical content review workflow
- [ ] Real care provider data (would need a verified data source)
- [ ] Camera/sensor temperature measurement (intentionally excluded)
- [ ] External AI integration
- [ ] Offline support / PWA
- [ ] Push notifications
- [ ] Internationalisation (i18n)
- [ ] Accessibility audit with real assistive technology
- [ ] Security audit
- [ ] HIPAA / GDPR compliance review
- [ ] Medical device regulations (if real sensors are added)

---

## Project structure

```
stealthy-healthy/
├── app/
│   ├── components/
│   │   ├── Logo.tsx
│   │   └── ui/              # Reusable component library
│   │       ├── Alert.tsx
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── CheckboxGroup.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Input.tsx
│   │       ├── PageShell.tsx
│   │       ├── ProgressBar.tsx
│   │       ├── RadioGroup.tsx
│   │       ├── SampleContentBanner.tsx
│   │       ├── Select.tsx
│   │       ├── Spinner.tsx
│   │       ├── StepIndicator.tsx
│   │       ├── TemperatureChart.tsx
│   │       ├── Textarea.tsx
│   │       └── Toggle.tsx
│   ├── admin/page.tsx        # Content review admin
│   ├── care/page.tsx         # Care resources + filters
│   ├── history/page.tsx      # Temperature history + chart
│   ├── home/page.tsx         # Home dashboard
│   ├── privacy/page.tsx      # Privacy settings
│   ├── profile/page.tsx      # Health profile wizard
│   ├── results/page.tsx      # Assessment results
│   ├── search/page.tsx       # Search results
│   ├── sign-in/page.tsx      # Simulated auth
│   ├── symptoms/page.tsx     # Symptom intake wizard
│   ├── temperature/page.tsx  # Temperature entry
│   ├── topics/[id]/page.tsx  # Health topic detail
│   ├── not-found.tsx
│   ├── layout.tsx
│   ├── page.tsx              # Welcome screen
│   └── globals.css
├── lib/
│   ├── types.ts              # All domain type definitions
│   └── fixtures/
│       ├── careResources.ts
│       ├── healthTopics.ts
│       ├── profile.ts
│       ├── symptoms.ts
│       └── temperatureHistory.ts
├── public/
│   └── logo.svg
├── __tests__/
│   ├── components.test.tsx   # 29 UI component tests
│   └── fixtures.test.ts      # 33 data/logic tests
└── __mocks__/
    └── fileMock.js
```

---

## Running tests

```bash
npm test          # Run all tests once (62 tests)
npm run test:watch  # Watch mode
```

---

## Design system

| Token | Value |
|---|---|
| Primary accent | Teal 600 `#0d9488` |
| Secondary | Blue 600 `#2563eb` |
| Background | Slate 50 `#f8fafc` |
| Cards | White with Slate 200 border |
| Text | Slate 900 (primary), Slate 500 (secondary) |
| Danger | Red 600 |
| Warning | Amber 500 |

All safety states are communicated with **both colour and text/icon** — never colour alone.
All interactive elements have visible focus rings (teal, 2px offset).
Minimum touch target: 44×44 px.

---

## Accessibility

- Semantic HTML throughout (`nav`, `main`, `header`, `section`, `fieldset`, `legend`)
- `aria-label`, `aria-describedby`, `aria-current`, `aria-pressed`, `aria-checked` used as appropriate
- `role="alert"` on error/warning messages
- `role="status"` on spinner
- `role="progressbar"` with `aria-valuenow/min/max`
- Skip-to-content and screen-reader-only text via `.sr-only`
- Visible focus states (`:focus-visible`) on all interactive elements

> Full WCAG 2.1 AA compliance requires manual testing with assistive technologies and a qualified accessibility review.

---

*Version 0.1.0-prototype · Built with Next.js 16 · November 2026*
