# Hanudam Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a conversion-focused, content-managed website for 하누담 that presents its 1++ Hanwoo and private rooms, sends 2–29 person bookings to Naver, accepts 30+ person inquiries, and is ready for SEO, local SEO, AEO, and GEO audits.

**Architecture:** Next.js 16 App Router renders the public site from a typed content repository. The repository reads published Sanity content and falls back to a safe local snapshot when Sanity is unavailable. Sanity Studio is embedded at `/studio`, Resend sends group inquiries, Upstash enforces serverless rate limits, GA4 receives a strict allow-list of non-PII events, and a signed webhook revalidates content on publish.

**Tech Stack:** Next.js 16.2.10, React 19.2.4, TypeScript strict mode, Tailwind CSS 4, shadcn Button/Card, Sanity and `next-sanity`, Zod, Resend, Upstash Redis/Rate Limit, Vitest, Testing Library, Playwright, axe-core, Vercel.

## Global Constraints

- Before each implementation task, open `C:\vibecoding\my-shop\초안`, confirm the relevant approved Pencil frame, and update it first if implementation scope changes.
- Follow `C:\vibecoding\my-shop\DESIGN.md`; customer-facing body, prices, labels, input text, buttons, and errors must never be below 16px.
- Preserve the approved `FINAL · A+C 하이브리드`, `ADMIN · 콘텐츠 관리`, and `QUALITY · 오류·측정·테스트` frames.
- 2–29 people go to Naver reservation; 30+ people use the website inquiry or phone.
- Do not create an in-house reservation calendar, seat inventory, payment system, or online shop.
- Do not automate Naver review collection. Publish only consented, manually curated testimonials with a Naver source link.
- Never copy `C:\Users\thunder\Desktop\network.har`, captcha tokens, review-author IDs, inquiry PII, or authentication material into the project or deployment.
- Use store-owned Naver Place photos initially; do not use customer review photos without separate recorded permission.
- Use `https://my-shop-nu-rouge.vercel.app` as the production base URL unless Vercel reports a confirmed project alias for the same project.
- Production deployment always uses `vercel --prod --yes`.
- The current directory is not a Git repository. Run commit steps only after the user explicitly authorizes `git init`; otherwise record the same checkpoint with test output and changed-file list.

## File Structure

### Existing files to modify

- `package.json` — dependencies and test/audit scripts.
- `next.config.ts` — Sanity image host and production-safe settings.
- `app/layout.tsx` — Korean document shell, global metadata, GA4, header, footer, mobile actions.
- `app/page.tsx` — compose the approved home page from repository content.
- `app/globals.css` — design tokens, typography floor, focus, reduced motion, and layout utilities.
- `components/ui/button.tsx` — accessible 52px customer-facing button size.
- `.gitignore` — generated reports, caches, and sensitive local artifacts.

### New application files

- `lib/site/types.ts` — public content types and repository contract.
- `lib/site/fallback-content.ts` — safe last-known published snapshot.
- `lib/site/content.ts` — fallback-aware content access.
- `lib/site/urls.ts` — production URL and external-link normalization.
- `lib/seo/metadata.ts`, `lib/seo/json-ld.ts` — metadata and sanitized schema builders.
- `lib/analytics/events.ts` — GA4 event allow-list with no arbitrary parameters.
- `lib/inquiry/schema.ts`, `lib/inquiry/rate-limit.ts`, `lib/inquiry/send.ts` — validated inquiry pipeline.
- `lib/reviews/consent.ts` — pure testimonial publish validation.
- `components/site/*` — global navigation, footer, mobile actions, tracked links, page intro.
- `components/home/*` — hero, signature cuts, room story, testimonials, reservation split, location/FAQ.
- `components/inquiry/group-inquiry-form.tsx` — resilient client form.
- `components/analytics/google-analytics.tsx` — Google tag loader.
- `components/email/group-inquiry-email.tsx` — Resend React email.
- `app/menu/page.tsx`, `app/rooms/page.tsx`, `app/reservation/page.tsx`, `app/location/page.tsx` — primary conversion pages.
- `app/news/page.tsx`, `app/news/[slug]/page.tsx`, `app/not-found.tsx` — notices and missing-content handling.
- `app/api/inquiries/route.ts` — validation, rate limit, honeypot, idempotent email send.
- `app/api/revalidate/route.ts` — signed Sanity publish revalidation.
- `app/studio/[[...tool]]/page.tsx` — embedded Sanity Studio.
- `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `app/opengraph-image.tsx` — search metadata endpoints.
- `public/llms.txt` — concise AI discovery map.
- `public/images/hanudam/*` — authorized, optimized store images.

### New Sanity files

- `sanity.config.ts`, `sanity.cli.ts` — embedded Studio configuration.
- `sanity/env.ts`, `sanity/lib/client.ts`, `sanity/lib/queries.ts`, `sanity/lib/image.ts` — environment, fetch, query, and image helpers.
- `sanity/schemaTypes/index.ts` plus `siteSettings.ts`, `homePage.ts`, `menuItem.ts`, `room.ts`, `notice.ts`, `faq.ts`, `testimonial.ts`, `seoFields.ts` — content model.
- `sanity/structure.ts` — admin navigation matching the approved Pencil admin frame.

### Test and quality files

- `vitest.config.ts`, `tests/setup.ts` — unit/component test environment.
- `playwright.config.ts` — desktop/mobile E2E projects.
- `tests/unit/*.test.ts`, `tests/components/*.test.tsx`, `tests/api/*.test.ts` — TDD coverage.
- `tests/e2e/conversion.spec.ts`, `tests/e2e/accessibility.spec.ts` — production-critical journeys.
- `scripts/check-sensitive-files.mjs` — HAR/token/secret deployment guard.

---

### Task 1: Establish the testable project foundation

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `playwright.config.ts`
- Create: `tests/unit/project-baseline.test.ts`

**Interfaces:**
- Consumes: existing Next.js App Router project and `@/*` TypeScript alias.
- Produces: `npm test`, `npm run test:watch`, `npm run test:e2e`, and `npm run check:all` commands used by all later tasks.

- [ ] **Step 1: Verify the Pencil checkpoint and current repository state**

Open the approved Pencil frames, run a layout-problem snapshot, then run:

```powershell
Test-Path .git
npm run lint
npm run build
```

Expected: `.git` reports `False`; lint and build exit 0 before application changes. Do not run `git init` without explicit user authorization.

- [ ] **Step 2: Install runtime and test dependencies**

```powershell
npm install next-sanity @sanity/image-url sanity styled-components zod resend @upstash/ratelimit @upstash/redis schema-dts
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test @axe-core/playwright
npx playwright install chromium
```

Expected: `package-lock.json` updates and npm exits 0.

- [ ] **Step 3: Add the failing baseline test**

```ts
// tests/unit/project-baseline.test.ts
import { describe, expect, it } from "vitest";

describe("project baseline", () => {
  it("runs tests through the configured @ alias", async () => {
    const { cn } = await import("@/lib/utils");
    expect(cn("a", false && "b", "c")).toBe("a c");
  });
});
```

- [ ] **Step 4: Run the test before configuration**

```powershell
npx vitest run tests/unit/project-baseline.test.ts
```

Expected: FAIL because Vitest does not yet resolve the alias or setup.

- [ ] **Step 5: Add exact test configuration and scripts**

```ts
// vitest.config.ts
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    clearMocks: true,
  },
});
```

```ts
// tests/setup.ts
import "@testing-library/jest-dom/vitest";
```

```ts
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL: "http://127.0.0.1:3000", trace: "retain-on-failure" },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
});
```

Add these scripts to `package.json`:

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "check:sensitive": "node scripts/check-sensitive-files.mjs",
  "check:all": "npm run lint && npm test && npm run build && npm run check:sensitive"
}
```

Add to `.gitignore`:

```gitignore
/playwright-report
/test-results
/.seo-cache
/output
*.har
```

- [ ] **Step 6: Verify the foundation**

```powershell
npm test -- tests/unit/project-baseline.test.ts
npm run lint
```

Expected: baseline test PASS and lint exits 0.

- [ ] **Step 7: Commit or record checkpoint**

If Git was explicitly authorized:

```powershell
git add package.json package-lock.json .gitignore vitest.config.ts playwright.config.ts tests/setup.ts tests/unit/project-baseline.test.ts
git commit -m "test: establish application test foundation"
```

Without Git authorization, save the passing command output and exact changed-file list in the task log.

---

### Task 2: Define content contracts and safe fallback behavior

**Files:**
- Create: `lib/site/types.ts`
- Create: `lib/site/urls.ts`
- Create: `lib/site/fallback-content.ts`
- Create: `lib/site/content.ts`
- Create: `tests/unit/content-repository.test.ts`

**Interfaces:**
- Produces: `SiteContent`, `SiteSettings`, `PublicTestimonial`, `ContentRepository`, `getSiteContent()`, and `absoluteUrl(path)`.
- Consumers: every public route, metadata builder, JSON-LD builder, sitemap, and Studio adapter.

- [ ] **Step 1: Write fallback and publication tests**

```ts
// tests/unit/content-repository.test.ts
import { describe, expect, it } from "vitest";
import { createFallbackRepository } from "@/lib/site/content";

describe("fallback content repository", () => {
  it("keeps the verified public address and reservation source", async () => {
    const content = await createFallbackRepository().getSiteContent();
    expect(content.settings.roadAddress).toBe(
      "경기도 수원시 영통구 청명남로34번길 21 테라스가든 상가 2층 하누담",
    );
    expect(content.settings.naverReservationUrl).toBe("https://naver.me/FbOhLPXy");
  });

  it("publishes only consented and visible testimonials", async () => {
    const content = await createFallbackRepository().getSiteContent();
    expect(
      content.testimonials.every((item) => item.consentConfirmed && item.visible),
    ).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify missing modules fail**

```powershell
npm test -- tests/unit/content-repository.test.ts
```

Expected: FAIL because `lib/site/content.ts` does not exist.

- [ ] **Step 3: Implement exact domain types**

```ts
// lib/site/types.ts
export type SeoFields = {
  title: string;
  description: string;
  imageUrl?: string;
  noIndex?: boolean;
};

export type SiteSettings = {
  name: "하누담";
  description: string;
  roadAddress: string;
  phone: string;
  businessHours: string[];
  parking: string;
  naverReservationUrl: string;
  naverPlaceUrl: string;
  orderInquiryUrl: string;
};

export type MenuItem = {
  slug: string;
  name: string;
  cut: "안심" | "등심" | "안창살" | "기타";
  description: string;
  priceText: string;
  servingText: string;
  origin: string;
  grade: string;
  imageUrl?: string;
  visible: boolean;
};

export type Room = {
  slug: string;
  name: string;
  capacityText: string;
  description: string;
  amenities: string[];
  imageUrl?: string;
  visible: boolean;
};

export type Faq = { question: string; answer: string; category: string };
export type Notice = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  publishedAt: string;
  visible: boolean;
};
export type PublicTestimonial = {
  id: string;
  maskedNickname: string;
  quote: string;
  visitPurpose: string;
  visitPeriod: string;
  sourceUrl: string;
  consentConfirmed: true;
  consentConfirmedAt: string;
  consentEvidence: string;
  imageUrl?: string;
  visible: true;
};

export type SiteContent = {
  settings: SiteSettings;
  menu: MenuItem[];
  rooms: Room[];
  faqs: Faq[];
  notices: Notice[];
  testimonials: PublicTestimonial[];
  seo: Record<string, SeoFields>;
};

export interface ContentRepository {
  getSiteContent(): Promise<SiteContent>;
  getNotice(slug: string): Promise<Notice | null>;
}
```

```ts
// lib/site/urls.ts
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-shop-nu-rouge.vercel.app";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
```

- [ ] **Step 4: Implement safe fallback and repository**

`lib/site/fallback-content.ts` must export one immutable `fallbackContent: SiteContent` with:

- name `하누담`;
- verified road address from the test;
- phone from `NEXT_PUBLIC_HANUDAM_PHONE ?? ""` and UI hiding when empty;
- Naver Place/reservation source `https://naver.me/FbOhLPXy`;
- order inquiry set to `tel:${NEXT_PUBLIC_HANUDAM_PHONE ?? ""}`;
- three visible menu entries for 안심, 등심, 안창살 with factual, non-medical copy;
- empty `testimonials` until consented entries are entered;
- FAQ answers for 2–29 and 30+ reservation rules;
- no invented price, certification, award, review quote, phone, or business hours.

```ts
// lib/site/content.ts
import { fallbackContent } from "@/lib/site/fallback-content";
import type { ContentRepository, Notice, SiteContent } from "@/lib/site/types";

export function createFallbackRepository(): ContentRepository {
  return {
    async getSiteContent(): Promise<SiteContent> {
      return fallbackContent;
    },
    async getNotice(slug: string): Promise<Notice | null> {
      return fallbackContent.notices.find((item) => item.slug === slug) ?? null;
    },
  };
}

let repository: ContentRepository = createFallbackRepository();

export function setContentRepository(next: ContentRepository): void {
  repository = next;
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    return await repository.getSiteContent();
  } catch {
    return fallbackContent;
  }
}

export async function getNotice(slug: string): Promise<Notice | null> {
  try {
    return await repository.getNotice(slug);
  } catch {
    return fallbackContent.notices.find((item) => item.slug === slug) ?? null;
  }
}
```

- [ ] **Step 5: Verify content behavior**

```powershell
npm test -- tests/unit/content-repository.test.ts
```

Expected: 2 tests PASS.

- [ ] **Step 6: Commit or record checkpoint**

```powershell
git add lib/site tests/unit/content-repository.test.ts
git commit -m "feat: define safe site content contracts"
```

---

### Task 3: Build the accessible global shell and design tokens

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `components/ui/button.tsx`
- Create: `components/site/site-header.tsx`
- Create: `components/site/site-footer.tsx`
- Create: `components/site/mobile-action-bar.tsx`
- Create: `tests/components/site-shell.test.tsx`

**Interfaces:**
- Consumes: `SiteSettings` and `absoluteUrl()`.
- Produces: `SiteHeader`, `SiteFooter`, `MobileActionBar`, and `size="customer"` Button variant.

- [ ] **Step 1: Write shell accessibility tests**

```tsx
// tests/components/site-shell.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/site/site-header";
import { MobileActionBar } from "@/components/site/mobile-action-bar";
import { fallbackContent } from "@/lib/site/fallback-content";

describe("site shell", () => {
  it("exposes Korean navigation and the reservation action", () => {
    render(<SiteHeader settings={fallbackContent.settings} />);
    expect(screen.getByRole("link", { name: "메뉴" })).toHaveAttribute("href", "/menu");
    expect(screen.getByRole("link", { name: "네이버 예약" })).toHaveAttribute(
      "href",
      "https://naver.me/FbOhLPXy",
    );
  });

  it("hides an empty phone action instead of rendering a broken tel link", () => {
    render(<MobileActionBar settings={{ ...fallbackContent.settings, phone: "" }} />);
    expect(screen.queryByRole("link", { name: "전화 문의" })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests and confirm missing components fail**

```powershell
npm test -- tests/components/site-shell.test.tsx
```

Expected: FAIL on missing site-shell modules.

- [ ] **Step 3: Implement the shell**

`SiteHeader` must render logo text `하누담`, links to `/menu`, `/rooms`, `/reservation`, `/location`, and `/news`, plus an external Naver reservation link with `rel="noopener noreferrer"`. `MobileActionBar` must render reservation and phone actions only when their URLs are valid. `SiteFooter` must render the authoritative address, hours, parking, phone, and links.

Add the customer button variant:

```ts
// components/ui/button.tsx, size variants
customer:
  "min-h-13 gap-2 rounded-[10px] px-6 text-base font-semibold focus-visible:ring-3",
```

Replace `app/layout.tsx` with a Korean root layout using `Noto_Sans_KR`, `lang="ko"`, default metadata for 하누담, and the three shell components. Resolve settings with `getSiteContent()` once in the server layout.

Define exact CSS tokens in `app/globals.css`:

```css
:root {
  --background: #ffffff;
  --foreground: #111111;
  --card: #ffffff;
  --card-foreground: #111111;
  --primary: #6e1f26;
  --primary-foreground: #ffffff;
  --secondary: #24201d;
  --secondary-foreground: #ffffff;
  --muted: #f4f0eb;
  --muted-foreground: #5c5550;
  --accent: #c8a05a;
  --accent-foreground: #111111;
  --border: #d6d1cb;
  --input: #b8b1a9;
  --ring: #6e1f26;
  --radius: 0.5rem;
}

html { scroll-behavior: smooth; }
body { min-width: 320px; font-size: 17px; line-height: 1.7; }
:focus-visible { outline: 3px solid var(--ring); outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; animation: none !important; }
}
```

- [ ] **Step 4: Verify shell and typography**

```powershell
npm test -- tests/components/site-shell.test.tsx
npm run lint
```

Expected: 2 tests PASS and lint exits 0.

- [ ] **Step 5: Commit or record checkpoint**

```powershell
git add app/layout.tsx app/globals.css components/ui/button.tsx components/site tests/components/site-shell.test.tsx
git commit -m "feat: add accessible Hanudam site shell"
```

---

### Task 4: Implement the approved A+C home page

**Files:**
- Modify: `app/page.tsx`
- Create: `components/home/hero-section.tsx`
- Create: `components/home/signature-menu-section.tsx`
- Create: `components/home/private-room-section.tsx`
- Create: `components/home/testimonials-section.tsx`
- Create: `components/home/reservation-split-section.tsx`
- Create: `components/home/location-faq-section.tsx`
- Create: `tests/components/home-page.test.tsx`

**Interfaces:**
- Consumes: `SiteContent` from Task 2 and customer Button from Task 3.
- Produces: server-rendered home sections with stable IDs `hero`, `menu`, `rooms`, `reviews`, `reservation`, and `location`.

- [ ] **Step 1: Write conversion-first home tests**

```tsx
// tests/components/home-page.test.tsx
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("home page", () => {
  it("shows the premium story and the two reservation paths", async () => {
    render(await Home());
    expect(screen.getByRole("heading", { level: 1, name: /투플 한우/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /네이버 예약/ })).toHaveAttribute(
      "href",
      "https://naver.me/FbOhLPXy",
    );
    expect(screen.getByRole("link", { name: /30명 이상 단체 문의/ })).toHaveAttribute(
      "href",
      "/reservation#group-inquiry",
    );
  });

  it("does not render an empty testimonial section", async () => {
    render(await Home());
    expect(screen.queryByTestId("testimonials-section")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the focused test and confirm it fails**

```powershell
npm test -- tests/components/home-page.test.tsx
```

Expected: FAIL because the new home components and content-backed page do not exist.

- [ ] **Step 3: Implement the approved A+C section sequence**

Keep the Pencil hierarchy: immersive premium hero, concise 1++ expertise proof, signature cuts, private-room story, consented testimonials only when present, two-path reservation block, location, and FAQ. The hero gives equal visual importance to atmosphere and the primary Naver reservation CTA. Use server components for content and images; isolate only interactive controls as client components.

Each section receives narrow typed props rather than importing the repository. Empty optional collections return `null`; they do not render empty headings or dummy cards. Maintain a minimum 16px body, control, caption, status, and card-detail size at every breakpoint.

- [ ] **Step 4: Add authorized image assets**

Use the signed-in browser session to download only store-owned official Naver Place images into `public/images/hanudam/`. Record source URL, capture date, and rights confirmation in the non-public file `docs/assets/hanudam-image-sources.md`. Produce optimized AVIF or WebP derivatives with descriptive names such as `hero-private-room.webp`, `menu-tenderloin.webp`, `menu-sirloin.webp`, and `menu-outside-skirt.webp`. Do not download visitor-review media.

- [ ] **Step 5: Verify content, responsive layout, and empty states**

```powershell
npm test -- tests/components/home-page.test.tsx
npm run build
```

Expected: home tests PASS, the production build exits 0, missing phone/business-hour/price values stay hidden, and the empty testimonial block is absent.

- [ ] **Step 6: Commit or record checkpoint**

```powershell
git add app/page.tsx components/home public/images/hanudam docs/assets/hanudam-image-sources.md tests/components/home-page.test.tsx
git commit -m "feat: build Hanudam conversion home"
```

---

### Task 5: Add menu, room, reservation, location, and news routes

**Files:**
- Create: `app/menu/page.tsx`
- Create: `app/rooms/page.tsx`
- Create: `app/reservation/page.tsx`
- Create: `app/location/page.tsx`
- Create: `app/news/page.tsx`
- Create: `app/news/[slug]/page.tsx`
- Create: `app/not-found.tsx`
- Create: `components/site/page-intro.tsx`
- Create: `tests/components/public-routes.test.tsx`
- Create: `tests/components/news-detail.test.tsx`

**Interfaces:**
- Consumes: `getSiteContent()`, `getNotice(slug)`, `MenuItem`, `Room`, `Notice`, and the shared site shell.
- Produces: indexable public routes with consistent page intros, fallback links, and conversion actions.

- [ ] **Step 1: Write public-route behavior tests**

Render each route with fallback content and assert:

- `/menu` lists the three signature cuts without an invented price;
- `/rooms` explains private-room suitability without claiming unverified capacities;
- `/reservation` sends 2–29 people to Naver and 30+ people to the inquiry anchor or phone;
- `/location` includes the verified road address and Naver directions link;
- `/news` hides invisible notices;
- a missing notice calls `notFound()`.

```tsx
expect(screen.getByText("안심")).toBeInTheDocument();
expect(screen.getByText(/2–29명/)).toBeInTheDocument();
expect(screen.getByRole("link", { name: /30명 이상/ })).toHaveAttribute(
  "href",
  "#group-inquiry",
);
```

- [ ] **Step 2: Run route tests and confirm missing pages fail**

```powershell
npm test -- tests/components/public-routes.test.tsx tests/components/news-detail.test.tsx
```

Expected: FAIL because the route modules are not present.

- [ ] **Step 3: Implement menu and private-room pages**

Map only visible items from `SiteContent`. Menu cards show name, cut, verified grade/origin/serving/price fields only when non-empty, and link to reservation. Room cards show descriptive atmosphere and amenities only from content. Keep all text at 16px or larger and preserve the approved wine/black/ivory hierarchy.

- [ ] **Step 4: Implement the reservation decision page**

Lead with two unambiguous cards:

1. `2–29명`: primary button to `settings.naverReservationUrl`.
2. `30명 이상`: primary button to `#group-inquiry` and a phone fallback only when `settings.phone` exists.

Add a short online-order notice: current orders are handled by phone; later the CMS may replace `orderInquiryUrl` with an external shop. Do not build checkout or store customer data in Sanity.

- [ ] **Step 5: Implement location and notice routes**

Location renders the verified address, parking/business hours only when populated, and external directions through Naver Place. News index sorts visible notices newest first. News detail uses `getNotice(slug)`, renders plain approved content safely, and calls `notFound()` for absent or invisible entries. `app/not-found.tsx` provides links to home, reservation, and phone when configured.

- [ ] **Step 6: Verify route behavior and build**

```powershell
npm test -- tests/components/public-routes.test.tsx tests/components/news-detail.test.tsx
npm run build
```

Expected: all route tests PASS; build exits 0; every page has a useful fallback action and no unverified factual claim.

- [ ] **Step 7: Commit or record checkpoint**

```powershell
git add app/menu app/rooms app/reservation app/location app/news app/not-found.tsx components/site/page-intro.tsx tests/components/public-routes.test.tsx tests/components/news-detail.test.tsx
git commit -m "feat: add Hanudam public detail routes"
```

---

### Task 6: Embed Sanity Studio and published-content fetching

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `sanity.config.ts`
- Create: `sanity.cli.ts`
- Create: `sanity/env.ts`
- Create: `sanity/lib/client.ts`
- Create: `sanity/lib/queries.ts`
- Create: `sanity/lib/repository.ts`
- Create: `sanity/schemaTypes/index.ts`
- Create: `sanity/schemaTypes/siteSettings.ts`
- Create: `sanity/schemaTypes/menuItem.ts`
- Create: `sanity/schemaTypes/room.ts`
- Create: `sanity/schemaTypes/faq.ts`
- Create: `sanity/schemaTypes/notice.ts`
- Create: `sanity/schemaTypes/testimonial.ts`
- Create: `sanity/structure.ts`
- Create: `app/studio/[[...tool]]/page.tsx`
- Create: `app/api/revalidate/route.ts`
- Create: `tests/api/revalidate.test.ts`
- Create: `tests/unit/sanity-repository.test.ts`

**Interfaces:**
- Consumes: the `SiteContent` contract and fallback behavior from Task 2.
- Produces: embedded `/studio`, a published-only `sanityRepository`, typed GROQ projections, and signed `POST /api/revalidate`.

- [ ] **Step 1: Provision external Sanity resources**

Create a Sanity project named `hanudam`, dataset `production`, and add localhost plus the production origin to CORS. Add each production value interactively so it is never printed, written into this plan, or committed:

```powershell
vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID production
vercel env add NEXT_PUBLIC_SANITY_DATASET production
vercel env add SANITY_API_READ_TOKEN production
vercel env add SANITY_REVALIDATE_SECRET production
```

At each prompt, paste the actual value copied from the created Sanity project. Use `production` for the dataset, a server-only read token for content access, and a newly generated 32-byte secret for webhook verification. Execution stops here until all four real values exist; never echo or log them.

- [ ] **Step 2: Write webhook and repository tests**

Mock `next/cache` and verify that a request with the wrong secret returns 401 while the correct secret calls `revalidateTag("sanity", "max")` and returns 200. Mock the Sanity client and assert the repository uses the published perspective, filters invisible records, omits private testimonial evidence, and falls back safely when the client throws.

```ts
expect(unauthorized.status).toBe(401);
expect(revalidateTag).not.toHaveBeenCalled();
expect(authorized.status).toBe(200);
expect(revalidateTag).toHaveBeenCalledWith("sanity", "max");
```

- [ ] **Step 3: Run focused tests and confirm missing modules fail**

```powershell
npm test -- tests/api/revalidate.test.ts tests/unit/sanity-repository.test.ts
```

Expected: FAIL because the Sanity adapter and route do not exist.

- [ ] **Step 4: Install and configure the official integration**

```powershell
npm install next-sanity @sanity/vision sanity
```

Create a guarded environment reader that returns `null` when public project configuration is absent, allowing the public fallback build to succeed. Never expose `SANITY_API_READ_TOKEN` or the revalidation secret to client components. Configure Studio at base path `/studio` with the approved content structure.

- [ ] **Step 5: Implement schemas and the published repository**

Schemas cover settings, menu, rooms, FAQ, notices, and testimonials. Use validation for required slugs, URLs, visibility flags, and sensible string lengths. Store content only; never add group-inquiry PII fields.

Use `next-sanity` server fetching with `perspective: "published"`, `useCdn: true` for public reads, and cache tag `sanity`. Map results into the exact Task 2 types, then validate all visibility/consent conditions before returning them. When configuration is missing, the request fails, or the response is structurally incomplete, serve the last cached published result where available and otherwise the immutable fallback content.

- [ ] **Step 6: Implement signed revalidation**

`POST /api/revalidate` reads the secret from an HTTP-only header, compares it with constant-time semantics, rejects missing or incorrect values with 401, calls `revalidateTag("sanity", "max")`, and returns a minimal JSON result. It never logs headers or webhook bodies. Configure the Sanity webhook only after deployment.

- [ ] **Step 7: Verify Studio, fallback build, and refresh path**

```powershell
npm test -- tests/api/revalidate.test.ts tests/unit/sanity-repository.test.ts
npm run build
```

Expected: tests PASS, build succeeds both with and without Sanity public configuration, `/studio` compiles, and published-only projections contain no consent evidence.

- [ ] **Step 8: Commit or record checkpoint**

```powershell
git add package.json package-lock.json sanity.config.ts sanity.cli.ts sanity app/studio app/api/revalidate tests/api/revalidate.test.ts tests/unit/sanity-repository.test.ts
git commit -m "feat: add editable Sanity content system"
```

---

### Task 7: Enforce testimonial consent and admin publishing rules

**Files:**
- Create: `lib/reviews/consent.ts`
- Modify: `sanity/schemaTypes/testimonial.ts`
- Modify: `sanity/structure.ts`
- Create: `tests/unit/testimonial-consent.test.ts`

**Interfaces:**
- Produces: `validateTestimonialConsent(value)` and Studio validation that blocks unsafe publication.
- Consumes: the `PublicTestimonial` contract; public projections from Task 6 must omit private evidence.

- [ ] **Step 1: Write consent-gate tests**

```ts
// tests/unit/testimonial-consent.test.ts
import { describe, expect, it } from "vitest";
import { validateTestimonialConsent } from "@/lib/reviews/consent";

describe("testimonial consent", () => {
  it("rejects a visible testimonial without recorded consent", () => {
    expect(validateTestimonialConsent({ visible: true, consentConfirmed: false })).toBe(
      "공개 리뷰는 사용 동의, 확인일, 확인 근거가 필요합니다.",
    );
  });

  it("accepts a complete consent record", () => {
    expect(
      validateTestimonialConsent({
        visible: true,
        consentConfirmed: true,
        consentConfirmedAt: "2026-07-13",
        consentEvidence: "매장 보관 동의서",
      }),
    ).toBe(true);
  });
});
```

- [ ] **Step 2: Run test and confirm missing validator fails**

```powershell
npm test -- tests/unit/testimonial-consent.test.ts
```

Expected: FAIL because the validator module does not exist.

- [ ] **Step 3: Implement pure validation and Studio rules**

```ts
// lib/reviews/consent.ts
type ConsentValue = {
  visible?: boolean;
  consentConfirmed?: boolean;
  consentConfirmedAt?: string;
  consentEvidence?: string;
};

export function validateTestimonialConsent(value: ConsentValue): true | string {
  if (!value.visible) return true;
  if (
    value.consentConfirmed &&
    value.consentConfirmedAt?.trim() &&
    value.consentEvidence?.trim()
  ) return true;
  return "공개 리뷰는 사용 동의, 확인일, 확인 근거가 필요합니다.";
}
```

The Studio document also requires a masked nickname, short quote, visit purpose, visit period, HTTPS Naver source URL, consent confirmation, date, and evidence whenever `visible` is true. An image may be published only when a separate image-use consent field and evidence are present. Hide consent evidence, internal notes, original author identifiers, and any image without separate permission from public GROQ projections.

- [ ] **Step 4: Add admin guidance and safe review workflow**

Studio groups review fields into public copy, source, consent, optional image consent, and publishing. The description states that HAR data and Naver internal endpoints are research-only and cannot be imported. Editors manually enter a masked nickname and short excerpt from the public review source, retain consent proof outside public output, and preview the exact public card before publishing.

- [ ] **Step 5: Verify consent gate and schema**

```powershell
npm test -- tests/unit/testimonial-consent.test.ts tests/unit/sanity-repository.test.ts
npm run build
```

Expected: consent tests PASS, unsafe visible records fail Studio validation, private consent fields never appear in repository output, and schema compiles.

- [ ] **Step 6: Commit or record checkpoint**

```powershell
git add lib/reviews sanity/schemaTypes/testimonial.ts sanity/structure.ts tests/unit/testimonial-consent.test.ts tests/unit/sanity-repository.test.ts
git commit -m "feat: enforce consent for published testimonials"
```

---

### Task 8: Implement secure 30+ group inquiries

**Files:**
- Create: `lib/inquiry/schema.ts`
- Create: `lib/inquiry/rate-limit.ts`
- Create: `lib/inquiry/send.ts`
- Create: `components/email/group-inquiry-email.tsx`
- Create: `components/inquiry/group-inquiry-form.tsx`
- Create: `app/api/inquiries/route.ts`
- Modify: `app/reservation/page.tsx`
- Create: `tests/api/inquiries.test.ts`
- Create: `tests/components/group-inquiry-form.test.tsx`

**Interfaces:**
- Produces: `groupInquirySchema`, `POST /api/inquiries`, and `GroupInquiryForm`.
- External environment: `RESEND_API_KEY`, `GROUP_INQUIRY_FROM_EMAIL`, `GROUP_INQUIRY_TO_EMAIL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

- [ ] **Step 1: Write API rejection and success tests**

Cover malformed phone, party size below 30, missing consent, a non-empty honeypot, rate-limit denial, Resend failure, and success. Assert that the email mock receives name/contact/date/party/message while analytics never receives those fields.

```ts
expect(invalid.status).toBe(400);
expect(spam.status).toBe(204);
expect(limited.status).toBe(429);
expect(providerFailure.status).toBe(502);
expect(success.status).toBe(200);
```

- [ ] **Step 2: Implement the shared Zod schema**

```ts
// lib/inquiry/schema.ts
import { z } from "zod";

export const groupInquirySchema = z.object({
  name: z.string().trim().min(2).max(40),
  phone: z.string().trim().regex(/^0\d{1,2}-?\d{3,4}-?\d{4}$/),
  preferredDate: z.string().date(),
  partySize: z.coerce.number().int().min(30).max(300),
  message: z.string().trim().min(5).max(1000),
  privacyConsent: z.literal(true),
  website: z.string().max(0),
});

export type GroupInquiry = z.infer<typeof groupInquirySchema>;
```

- [ ] **Step 3: Implement serverless rate limit and idempotent email**

Use Upstash sliding window `5 requests / 10 minutes` per hashed IP. Return 503 when rate-limit configuration is missing in production, rather than silently disabling protection. Send with Resend using a SHA-256 idempotency key derived from normalized phone, date, party size, and a ten-minute time bucket. Never log request bodies.

- [ ] **Step 4: Implement the route handler**

`POST /api/inquiries` must parse JSON, return 204 for honeypot submissions, validate, rate-limit, call `sendGroupInquiry`, and map errors to 400/429/502 without returning provider details.

- [ ] **Step 5: Implement the resilient client form**

The form must use 16px+ labels/inputs, preserve values after failure, disable only during submission, show an `aria-live="polite"` status, scroll/focus the first invalid field, and display phone fallback on failure. On success it clears fields and sends only `group_inquiry_success` through the analytics helper.

- [ ] **Step 6: Verify all inquiry states**

```powershell
npm test -- tests/api/inquiries.test.ts tests/components/group-inquiry-form.test.tsx
npm run build
```

Expected: all validation, spam, limit, provider, success, and form-preservation tests PASS.

- [ ] **Step 7: Commit or record checkpoint**

```powershell
git add lib/inquiry components/email components/inquiry app/api/inquiries app/reservation/page.tsx tests/api/inquiries.test.ts tests/components/group-inquiry-form.test.tsx
git commit -m "feat: add secure group inquiry flow"
```

---

### Task 9: Add privacy-safe GA4 conversion events

**Files:**
- Create: `lib/analytics/events.ts`
- Create: `components/analytics/google-analytics.tsx`
- Create: `components/site/tracked-link.tsx`
- Modify: `app/layout.tsx`
- Modify: conversion links/forms from Tasks 3–8
- Create: `tests/unit/analytics-events.test.ts`

**Interfaces:**
- Produces: `trackEvent(name)` accepting only approved names and no event payload.
- Consumers: reservation, phone, directions, order, inquiry success/failure, and menu/room navigation.

- [ ] **Step 1: Write event allow-list tests**

```ts
// tests/unit/analytics-events.test.ts
import { describe, expect, it, vi } from "vitest";
import { trackEvent } from "@/lib/analytics/events";

describe("analytics events", () => {
  it("sends an approved event without PII parameters", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    trackEvent("naver_reservation_click");
    expect(gtag).toHaveBeenCalledWith("event", "naver_reservation_click");
  });
});
```

- [ ] **Step 2: Implement the closed event union**

```ts
// lib/analytics/events.ts
export type AnalyticsEvent =
  | "naver_reservation_click"
  | "phone_click"
  | "group_inquiry_success"
  | "group_inquiry_failure"
  | "directions_click"
  | "hanwoo_order_inquiry_click"
  | "menu_view"
  | "room_view";

declare global {
  interface Window {
    gtag?: (
      ...args:
        | ["event", AnalyticsEvent]
        | ["config", string, { anonymize_ip: boolean }]
    ) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: AnalyticsEvent): void {
  if (typeof window !== "undefined") window.gtag?.("event", name);
}
```

- [ ] **Step 3: Load GA4 only when configured**

`GoogleAnalytics` must return `null` without `NEXT_PUBLIC_GA_MEASUREMENT_ID`, otherwise use `next/script` to load `gtag.js`, initialize `dataLayer`, and call `gtag("config", id, { anonymize_ip: true })`. Add the component to the root layout after the body content.

- [ ] **Step 4: Replace conversion anchors with `TrackedLink`**

`TrackedLink` must accept only `AnalyticsEvent`, call `trackEvent` on click, preserve standard anchor behavior, and never accept an arbitrary analytics payload. Use it for Naver booking, phone, directions, and order inquiry.

- [ ] **Step 5: Verify events**

```powershell
npm test -- tests/unit/analytics-events.test.ts
npm run build
```

Expected: analytics test PASS and build works with and without GA measurement ID.

- [ ] **Step 6: Commit or record checkpoint**

```powershell
git add lib/analytics components/analytics components/site/tracked-link.tsx app/layout.tsx app components tests/unit/analytics-events.test.ts
git commit -m "feat: add privacy-safe conversion analytics"
```

---

### Task 10: Implement metadata, structured data, sitemap, robots, and AI discovery

**Files:**
- Create: `lib/seo/metadata.ts`
- Create: `lib/seo/json-ld.ts`
- Modify: metadata exports in all public routes
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Create: `app/manifest.ts`
- Create: `app/opengraph-image.tsx`
- Create: `public/llms.txt`
- Create: `tests/unit/seo.test.ts`

**Interfaces:**
- Produces: `buildMetadata`, `buildRestaurantJsonLd`, `safeJsonLd`, metadata endpoints.
- Consumes: authoritative `SiteSettings`, visible routes/notices, production base URL.

- [ ] **Step 1: Write metadata and injection-safety tests**

```ts
// tests/unit/seo.test.ts
import { describe, expect, it } from "vitest";
import { safeJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

describe("SEO builders", () => {
  it("creates an absolute canonical URL", () => {
    expect(buildMetadata("/menu", "메뉴", "투플 한우 메뉴").alternates?.canonical)
      .toBe("https://my-shop-nu-rouge.vercel.app/menu");
  });

  it("escapes less-than characters in JSON-LD", () => {
    expect(safeJsonLd({ name: "</script>" })).not.toContain("</script>");
    expect(safeJsonLd({ name: "</script>" })).toContain("\\u003c/script>");
  });
});
```

- [ ] **Step 2: Implement metadata and safe JSON-LD**

```ts
// lib/seo/json-ld.ts
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
```

`buildRestaurantJsonLd` must emit `Restaurant` with name, URL, address, telephone only when configured, opening hours only when verified, menu URL, sameAs Naver Place, and reservation `potentialAction`. Do not put review aggregate, awards, ratings, or price ranges into schema unless verified current data exists in Sanity.

- [ ] **Step 3: Add page metadata and schema**

Each route must have unique Korean title/description/canonical/Open Graph metadata. Root metadata adds Google and Naver ownership-verification values only when their environment variables are configured. Render JSON-LD with a native `<script type="application/ld+json">` and `safeJsonLd`; do not use `next/script` for JSON-LD. Add Breadcrumb schema to detail routes and FAQ content as visible HTML; do not promise FAQ rich results.

- [ ] **Step 4: Add discovery endpoints**

`app/sitemap.ts` includes `/`, `/menu`, `/rooms`, `/reservation`, `/location`, `/news`, and visible notice URLs. `app/robots.ts` allows `/`, disallows `/studio/` and `/api/`, and points to the production sitemap. `public/llms.txt` contains a one-paragraph factual description and links to the main pages; it contains no instructions to manipulate AI answers.

- [ ] **Step 5: Verify SEO output**

```powershell
npm test -- tests/unit/seo.test.ts
npm run build
Invoke-WebRequest http://127.0.0.1:3000/sitemap.xml -UseBasicParsing
Invoke-WebRequest http://127.0.0.1:3000/robots.txt -UseBasicParsing
```

Expected: 2 tests PASS; build exits 0; both endpoints return 200 and expected production URLs.

- [ ] **Step 6: Commit or record checkpoint**

```powershell
git add lib/seo app public/llms.txt tests/unit/seo.test.ts
git commit -m "feat: add SEO AEO and GEO discovery surfaces"
```

---

### Task 11: Add accessibility, conversion, sensitive-file, and responsive release gates

**Files:**
- Create: `tests/e2e/conversion.spec.ts`
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `scripts/check-sensitive-files.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: automated release evidence for customer journeys, WCAG violations, responsive overflow, and secret/HAR exclusion.

- [ ] **Step 1: Write E2E conversion tests**

Test desktop and mobile for H1 visibility, 2–29 Naver URL, 30+ form anchor, phone fallback, directions, navigation routes, no horizontal overflow, and inquiry success/failure with API mocking. Use exact accessible names rather than CSS selectors.

```ts
test("mobile exposes booking without horizontal overflow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "네이버 예약" }).first()).toBeVisible();
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});
```

- [ ] **Step 2: Add axe accessibility tests**

Run `AxeBuilder` against `/`, `/menu`, `/rooms`, `/reservation`, and `/location`. Fail on any serious or critical violations. Separately assert computed font size is at least 16px for `p`, `label`, `input`, `textarea`, `button`, and error/status text.

- [ ] **Step 3: Implement sensitive-file guard**

```js
// scripts/check-sensitive-files.mjs
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ignored = new Set([
  "node_modules",
  ".next",
  ".vercel",
  "docs",
  "playwright-report",
  "test-results",
]);
const forbiddenNames = [/\.har$/i, /^network\.har$/i];
const forbiddenText = [
  new RegExp(["x-wtm-", "n", "captcha-token"].join(""), "i"),
  new RegExp(["n", "captcha-token"].join(""), "i"),
  /re_[A-Za-z0-9]{20,}/,
];
const failures = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
      continue;
    }
    if (forbiddenNames.some((pattern) => pattern.test(entry.name))) failures.push(full);
    if (/\.(?:ts|tsx|js|mjs|json|md|txt|env)$/i.test(entry.name)) {
      const text = await readFile(full, "utf8").catch(() => "");
      if (forbiddenText.some((pattern) => pattern.test(text))) failures.push(full);
    }
  }
}

await walk(process.cwd());
if (failures.length) {
  console.error([...new Set(failures)].join("\n"));
  process.exit(1);
}
console.log("Sensitive-file scan passed.");
```

The script excludes non-deployable planning documents and constructs the internal-header patterns from fragments, so the scanner does not match its own source. It still scans deployable source, configuration, public assets, and root text files for captured HAR files, internal request headers, and Resend-style secrets.

- [ ] **Step 4: Run the complete local release gate**

```powershell
npm run check:all
npm run test:e2e
```

Expected: lint 0 errors, all Vitest tests PASS, production build exits 0, sensitive scan prints `Sensitive-file scan passed.`, Playwright desktop/mobile projects PASS, axe reports zero serious/critical issues.

- [ ] **Step 5: Compare rendered screens with Pencil**

Capture home desktop/mobile, Studio content list, inquiry success/error, and empty testimonials. Compare spacing, hierarchy, text scale, CTA ordering, and responsive stacking to the approved Pencil frames. Fix implementation or update Pencil first if an approved behavior must change.

- [ ] **Step 6: Commit or record checkpoint**

```powershell
git add tests/e2e scripts/check-sensitive-files.mjs package.json package-lock.json
git commit -m "test: add Hanudam release quality gates"
```

---

### Task 12: Configure production services, audit, and deploy

**Files:**
- Modify only if verification finds defects: files owned by Tasks 1–11.
- Create local, uncommitted: `.env.local`
- Do not create: HAR copies, credential files, API reports containing secrets.

**Interfaces:**
- Consumes: passing Task 11 release gate and all external service credentials.
- Produces: stable production deployment at the existing Vercel project URL, indexed discovery endpoints, operational Studio and inquiry email.

- [ ] **Step 1: Configure real production values**

Verify live Naver Place values before entry. Configure Vercel environment variables for site URL, verified phone, Sanity, Resend, Upstash, GA4, and group inquiry recipient. Verify the Resend sending domain and create the Sanity webhook to `https://my-shop-nu-rouge.vercel.app/api/revalidate` with header `x-sanity-secret`.

- [ ] **Step 2: Seed and review Sanity content**

Enter authoritative settings, official menu/price information, rooms, hours, parking, approved images, FAQ, and SEO fields. Do not seed testimonials until consent records exist. Use Studio preview to compare public desktop/mobile screens with Pencil before publishing.

- [ ] **Step 3: Run pre-deployment quality gates**

```powershell
npm run check:all
npm run test:e2e
uvx --from geo-optimizer-skill geo audit --url http://127.0.0.1:3000
```

Expected: application checks PASS; local GEO audit identifies no critical crawl/schema/metadata omission. Treat `llms.txt` as supplementary, not a substitute for failures elsewhere.

- [ ] **Step 4: Deploy with the required stable command**

```powershell
vercel --prod --yes
```

Expected: deployment succeeds and prints an HTTPS production URL for the existing Vercel project.

- [ ] **Step 5: Verify production HTTP and customer journeys**

```powershell
$base='https://my-shop-nu-rouge.vercel.app'
foreach($path in '/','/menu','/rooms','/reservation','/location','/news','/sitemap.xml','/robots.txt','/llms.txt','/studio') {
  $response=Invoke-WebRequest "$base$path" -UseBasicParsing
  if($response.StatusCode -ne 200){ throw "$path returned $($response.StatusCode)" }
}
```

Then run Playwright against production, submit one labeled test inquiry to the real operating inbox, confirm the email, confirm GA4 DebugView events contain no PII, and delete the test inquiry email after verification.

- [ ] **Step 6: Run production SEO/GEO comparison**

```powershell
uvx --from geo-optimizer-skill geo audit --url https://my-shop-nu-rouge.vercel.app
uvx --from geo-optimizer-skill geo audit --sitemap https://my-shop-nu-rouge.vercel.app/sitemap.xml --max-urls 25
```

Run Codex SEO full, local, schema, Core Web Vitals, and drift workflows against the same production URL. Save reports outside public assets, remove caches containing request details, and fix critical regressions before handoff.

- [ ] **Step 7: Register production search properties**

Add `https://my-shop-nu-rouge.vercel.app` to Google Search Console and Naver Search Advisor. Complete ownership verification using the environment-backed metadata values from Task 10, submit the production sitemap to both services, and confirm each service can fetch `/robots.txt` and `/sitemap.xml`. Record verification and submission status without copying ownership tokens into source or reports.

- [ ] **Step 8: Record final evidence**

Record the stable HTTPS URL, deployment timestamp, HTTP status table, test counts, Lighthouse/Core Web Vitals snapshot, structured-data result, GEO score, Codex SEO action list, and the exact Pencil frames used. Do not include secrets, HAR fields, inquiry contents, or reviewer identifiers.

- [ ] **Step 9: Commit or record final checkpoint**

If Git was authorized and initialized:

```powershell
git status --short
git add -A
git commit -m "feat: launch Hanudam website"
```

Expected: only reviewed source, tests, authorized assets, and documentation are committed; `.env.local`, `.vercel`, reports, caches, and HAR files remain excluded.

## Plan Self-Review Checklist

- Spec coverage: information architecture, A+C visual direction, 16px minimum, Naver/30+ split, CMS, review consent, inquiry privacy, SEO/GEO/AEO, analytics, error states, tests, and `--prod --yes` deployment each map to at least one task.
- Scope: public UI, CMS, inquiry, analytics, and search quality remain separately reviewable but are sequenced through typed interfaces.
- Type consistency: `SiteContent`, `SiteSettings`, `PublicTestimonial`, `AnalyticsEvent`, `GroupInquiry`, `getSiteContent()`, `trackEvent()`, and `safeJsonLd()` keep the same names across producer and consumer tasks.
- Sensitive data: HAR, captcha headers, review-author IDs, inquiry values, and service credentials are explicitly excluded from repository, logs, analytics, and deployment artifacts.
- External blockers: Sanity, Resend, Upstash, GA4, and Vercel credentials are required only at their named provisioning/deployment steps; the public build remains safe with local fallback content.
