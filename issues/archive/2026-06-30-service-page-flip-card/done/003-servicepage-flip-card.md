---
id: issue-003
title: "ServicePage flip card (public)"
feature: service-card
status: done
created_at: 2026-06-29
tags: [afk, p1]
---

# [003] ServicePage flip card (public)

**Type:** AFK
**Priority:** P1
**Blocked by:** 001
**User stories covered:** 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 24, 25

---

## What to build

Full rewrite of `servicePage.tsx` as an interactive Framer Motion flip card. The component stays inside `BaseLayout` — no routing changes needed.

**Card dimensions:** `440px × 600px` on desktop, `360px` wide on screens narrower than `520px`. Height stays `600px`.

**Flip mechanic:** A single `useState<boolean>` tracks flipped state. Clicking the card wrapper toggles it. Clicks on `<a>` tags inside the card must not propagate to the flip handler. The Framer Motion animation uses `rotateY` from `0deg` to `180deg`, duration `0.85s`, easing `cubicBezier(0.22, 0.78, 0.24, 1)`, with `perspective: 2000px` on the outer wrapper. Both faces use `backfaceVisibility: hidden`.

**Front face** (visible by default):
- Avatar `<img>` from `profileImageUrl` (top-left)
- Kind label — hardcoded `"card · services"` (top-right)
- Greeting from `greeting` config field
- Headline from `headline` config field (accent color on a portion — match design intent)
- Role label from `roleLabel` config field
- URL label from `siteUrl` config field
- "tap card to flip →" hint with a pulsing dot (hardcoded copy, CSS `animate-pulse` for the dot)

**Back face** (revealed on flip):
- `"// services"` section header (hardcoded)
- `"↩ tap to flip"` label (hardcoded, top-right)
- Service rows — one per `ServiceDto`: icon via `<Icon />` from `@iconify/react`, title, `mainTag` badge, description
- Footer row: `socialLinks` as icon anchor tags (icon via `<Icon />`), `contactEmail` as a styled link

**Loading state:** Three skeleton placeholder blocks at `440px × 600px` using `animate-pulse` while `useServiceConfig` is loading.

**Data source:** `useServiceConfig()` only — no props.

---

## Acceptance criteria

- [ ] Card renders at `440px × 600px`; width reduces to `360px` below `520px` viewport width
- [ ] Front face shows greeting, headline, roleLabel, siteUrl, and avatar from config
- [ ] Clicking the card flips it with a smooth Framer Motion `rotateY` animation
- [ ] Back face shows all services with icon, title, mainTag badge, and description
- [ ] Back face footer shows socialLinks and contactEmail
- [ ] Clicking a link inside the card does not trigger a flip
- [ ] Clicking the back face flips back to front
- [ ] Loading state renders three skeleton placeholders
- [ ] Empty `services` array renders the back face without error
- [ ] Empty `socialLinks` renders the footer without error

---

## Tests required

Yes — `servicePage.test.tsx` following the pattern in `terminalContactSection.test.tsx`:
- Mock `useServiceConfig` with `vi.fn()`
- Render `<ServicePage />` inside `MemoryRouter`
- Assert front face renders `greeting`, `headline`, `roleLabel`, `siteUrl` from config
- Assert profile `<img>` has `src` equal to `profileImageUrl`
- Assert clicking the card causes back face service titles to appear in the DOM
- Assert back face renders each service's `title`, `mainTag`, and `description`
- Assert back footer renders `contactEmail` and each `socialLink` href
- Assert empty `services` array renders without error
- Assert empty `socialLinks` renders without error

---

## Notes

The design source is `Service Card - Desktop.html` from the claude.ai design project. The standalone stage wrapper, segmented mode switch, and QR code from that file are not part of this implementation.

The pulsing dot on the front face hint is a small `<span>` with Tailwind `animate-pulse` — no JS animation needed for this element.

Prior art for Framer Motion entrance animations: `servicePage.tsx` (current implementation) and `BaseLayout`. Prior art for `useServiceConfig` mocking: `terminalContactSection.test.tsx`.

---

## Log

Implemented 2026-06-29. Rewrote `servicePage.tsx` as a Framer Motion flip card (440×600px, responsive to 360px below 520px) with front face showing greeting/headline/roleLabel/siteUrl/avatar and back face listing services with icons, mainTag badges, descriptions, social link icons, and a contact email. Added `IntersectionObserver` mock to `src/test-setup.ts` and wrote 8 passing tests in `src/app/module/services/__tests__/servicePage.test.tsx` covering all specified cases including flip interaction, empty states, and loading skeleton.
QA approved by user on 2026-06-30.
