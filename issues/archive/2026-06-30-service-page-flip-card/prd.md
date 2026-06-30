# PRD: Service Page Flip Card

**Status:** Draft
**Date:** 2026-06-29

---

## Problem Statement

The public `/services` route currently renders a generic card list that does not match the site's terminal aesthetic and lacks personality. Visitors have no memorable way to understand what services are offered, and the layout gives no sense of the craft behind the work. The page also has no contact affordance of its own — visitors who want to reach out after reading the services have no path forward from the page itself.

---

## Solution

Replace the existing services page with an interactive flip card — a physical "calling card" metaphor that fits the terminal aesthetic. The front face introduces the author with a greeting, headline, role label, avatar, and site URL. Flipping the card reveals the full list of services with icons, tags, and descriptions, plus a contact footer with social links and a preferred email. All copy and contact details are configurable from the CMS service config editor so nothing requires a code change to update.

---

## User Stories

1. As a visitor, I want to see a visually distinct services page so that the experience feels intentional rather than templated.
2. As a visitor, I want to see a greeting and headline on the front of the card so that I understand the tone before reading the details.
3. As a visitor, I want to see a profile avatar on the front of the card so that I can associate the services with a person.
4. As a visitor, I want to see a site URL on the front of the card so that I know where I am and can share the link.
5. As a visitor, I want to tap or click the card to flip it so that I can reveal the services in a satisfying interaction.
6. As a visitor, I want the flip animation to feel physical and smooth so that the interaction feels premium rather than abrupt.
7. As a visitor, I want to see a list of services on the back of the card so that I understand what is available.
8. As a visitor, I want each service to show an icon, title, tag badge, and description so that I can scan and understand each offering quickly.
9. As a visitor, I want to flip back to the front by tapping the card again so that I can re-read the intro without refreshing.
10. As a visitor, I want to see a "tap to flip" hint on the front so that the interaction is discoverable without instructions.
11. As a visitor, I want to see a "↩ tap to flip" label on the back so that I know how to get back to the front.
12. As a visitor, I want to see social links in the back footer so that I can reach out through my preferred platform.
13. As a visitor, I want to see a preferred contact email in the back footer so that I have a direct way to start a conversation.
14. As a visitor on mobile, I want the card to be appropriately sized so that it fits the screen without horizontal scrolling.
15. As a site owner, I want to edit the greeting text from the CMS so that I can update my intro copy without touching code.
16. As a site owner, I want to edit the headline text from the CMS so that I can change my value proposition at any time.
17. As a site owner, I want to edit the role label from the CMS so that it reflects my current focus.
18. As a site owner, I want to edit the site URL label from the CMS so that it shows the right URL.
19. As a site owner, I want to upload a profile image specifically for the service card from the CMS so that it is independent from other pages.
20. As a site owner, I want to add, edit, and remove services from the CMS so that the back face stays current.
21. As a site owner, I want each service to have an icon (Iconify ID), title, main tag, description, and stack tags so that the card is information-rich.
22. As a site owner, I want to add, edit, and remove social links from the CMS service config so that my contact options are always up to date.
23. As a site owner, I want to set a preferred contact email from the CMS service config so that visitors know the best way to reach me.
24. As a site owner, I want an empty services list to render gracefully so that the page does not break while I am editing.
25. As a site owner, I want an empty social links list to render gracefully so that the footer does not crash.

---

## Implementation Decisions

### Schema changes — `UpdateServiceConfigDto` and `ServiceConfig`

Extend both the DTO and the `ServiceConfig` interface with the following new fields:

- `greeting: string` — front face greeting line (e.g. "Hey —")
- `headline: string` — front face headline (e.g. "here's what I can help with.")
- `roleLabel: string` — front face role line (e.g. "AJ · Khesir // Full-Stack & Toolmaker")
- `siteUrl: string` — front face URL label (e.g. "khesir.dev")
- `profileImageUrl: string` — front face avatar image URL
- `contactEmail: string` — back footer preferred email
- `socialLinks: SocialLink[]` — back footer icon links; reuse the existing `SocialLink` type (`{ label, href, icon }`) already used in `HomeConfig`

The existing `services: ServiceDto[]` array is unchanged. `ServiceDto` already has `icon` (Iconify ID), `title`, `mainTag`, `description`, and `tags`.

Mock dev data in `fetchServiceConfig` must be updated with sensible defaults for all new fields so the page renders fully without a backend.

`DEFAULT_SERVICE` in `use-home-config.ts` must be updated with the same defaults.

### Public page — `ServicePage`

Full rewrite of `servicePage.tsx`. The component:

- Stays inside `BaseLayout` (no route change needed in `app.tsx`)
- Renders a single centered flip card — `440px × 600px` on desktop, `360px` wide on screens narrower than `520px`
- Uses Framer Motion for the flip: `rotateY` from `0deg` to `180deg`, duration `0.85s`, easing `cubicBezier(0.22, 0.78, 0.24, 1)`, `perspective: 2000px` on the wrapper
- `backfaceVisibility: hidden` applied to both faces via Framer Motion's `style` prop
- Flip state is a single `useState<boolean>` toggled on card click; clicks on `<a>` tags inside the card do not propagate to the flip handler
- **Front face** renders: avatar (`profileImageUrl`), kind label (hardcoded "card · services"), greeting, headline with accent span, role label, URL label (`siteUrl`), and the "tap card to flip →" hint with a pulsing dot
- **Back face** renders: "// services" section header, "↩ tap to flip" label, service rows (icon via `<Icon />` from `@iconify/react`, title, `mainTag` badge, description), and a footer row with `socialLinks` icon anchors and `contactEmail`
- `useServiceConfig()` is the sole data source — no props needed
- Loading state: render three skeleton placeholder rows at `440px × 600px` height using `animate-pulse`

### CMS editor — `CmsServiceConfig`

Extend the existing CMS service config page with two new sections above the existing Services list:

**Card Copy section** — text inputs for `greeting`, `headline`, `roleLabel`, `siteUrl`, and an image upload field for `profileImageUrl` (reuse the same upload pattern as `CmsAboutConfig` profile image).

**Contact section** — a `contactEmail` text input and a repeatable `socialLinks` list editor (label, href, icon per entry — use `IconSelector` for the icon field, consistent with the rest of the CMS). Same `rep-row` pattern as the existing services list.

`cmsUpdateServiceConfig` and `UpdateServiceConfigDto` must be extended to include all new fields. The save handler sends the full config object including both existing services and new fields.

### Routing

No changes to `app.tsx`. The `/services` route already exists inside `BaseLayout`.

### Styling

The flip card uses inline Framer Motion styles and Tailwind utility classes only — no new CSS files. Accent color, font variables, and shadow tokens follow the existing terminal theme already applied site-wide.

---

## Testing Decisions

Good tests assert on rendered output visible to the user — text content, image `src`, link `href`, presence/absence of elements — not on internal state variable names or animation implementation details.

**Module under test:** `ServicePage` (`servicePage.tsx`)

**Test file:** `servicePage.test.tsx` — located alongside the module, following the `__tests__/` convention established by `terminalContactSection.test.tsx` and `terminalHomePage.test.tsx`.

**Pattern:** Mock `useServiceConfig` with `vi.fn()`, render `<ServicePage />` inside `MemoryRouter`, assert on DOM output.

**Cases to cover:**
1. Front face renders `greeting`, `headline`, `roleLabel`, and `siteUrl` from config
2. Profile `<img>` has `src` equal to `profileImageUrl` from config
3. Clicking the card causes the back face services to become accessible in the DOM (flip toggled)
4. Back face renders each service's `title`, `mainTag`, and `description`
5. Back footer renders `contactEmail` and each `socialLink`'s `href`
6. Empty `services` array renders without error
7. Empty `socialLinks` array renders without error

---

## Out of Scope

- QR code generation — replaced by a plain URL label
- Mode toggle (engineering / art) — a single card driven by CMS data covers both use cases
- Full-bleed standalone page layout — the card stays inside `BaseLayout`
- Animations on the CMS editor itself
- Any changes to `HomeConfig`, `AboutConfig`, or other config schemas
- Unit tests for `CmsServiceConfig`

---

## Further Notes

The design source is `Service Card - Desktop.html` from the claude.ai design project `0e36bcb5-36bd-4876-b587-39165c964189`. The implemented card is Direction A (flip calling card) from that file, adapted to be data-driven rather than hardcoded. The standalone stage wrapper, segmented mode switch, and QR code from the design file are not carried over.

The `SocialLink` type is shared with `HomeConfig` — do not duplicate the type definition. Import it from wherever it is currently exported.

The pulsing dot on the "tap to flip" hint is a pure CSS `@keyframes` animation — implement it with a Tailwind `animate-pulse` or a custom inline keyframe; do not reach for a JS animation for this.
