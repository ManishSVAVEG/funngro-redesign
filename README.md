# Funngro Website Redesign

A static, deployment-ready redesign of Funngro's public website. Two pages: **Home** and **Arcade**.

Built with HTML5, CSS3 and vanilla JavaScript. No frameworks, no build step, no dependencies beyond Google Fonts.

**Live:** https://manishsvaveg.github.io/funngro-redesign/

---

## Project Goal

The original site carried a lot of marketing weight — big numbers, unverifiable claims, and a product catalogue that was hard to source. At the same time, it was also rich, multi-section, and had a strong visual identity worth keeping.

The goal of this redesign was to fix the content and credibility problems **without shrinking the page**, and to add a modern 3D product layer while preserving Funngro's dark editorial identity.

What I focused on:

- Keeping the full, multi-section page structure (not a minimal landing page)
- Removing statistics, testimonials, brand logos, media names and product names that could not be verified from the source material
- Replacing them with useful, non-numeric copy that still fills the section
- Adding 3D depth that feels like a modern product site — not a gaming site
- Improving SEO, accessibility and mobile behaviour
- Making the Arcade page honest about what it is instead of listing fictional apps

---

## What Changed

### Home page — structure

Twelve sections, with varied layouts so the page never becomes "card, card, card":

1. **Header / navigation** — 6 links, mobile hamburger
2. **Hero** — 3D phone mockup with floating UI cards, mask-revealed heading
3. **Trust strip** — typography pills (Content · Promotion · Referrals · Micro tasks · Research · Product feedback) instead of fake brand logos
4. **What Funngro is** — split layout: text + stat tiles
5. **How it works** — three cards with numbered visuals and icons
6. **Work categories** — four cards with 3D letter tiles
7. **Growth progression** — horizontal timeline on desktop, vertical on mobile
8. **App experience** — large tilted phone showcase
9. **User journey** — four-step grid (Discover → Try → Build → Grow)
10. **Why it's useful** — three-card grid
11. **Arcade teaser** — with floating E / L / P letter tiles
12. **FAQ** — accordion with five real questions
13. **Final CTA**
14. **Footer**

### Arcade page — structure

1. **Hero** — heading + interactive phone mockup showing `01 EARN · 02 LEARN · 03 PLAY` tabs and `E · L · P` tiles inside the phone
2. **Featured section** — Earn category as the main entry point
3. **Three category sections** — Earn, Learn, Play, each with tile cards
4. **Note** — explains the Arcade is a space, not a fixed catalogue
5. **Final CTA**
6. **Footer**

The phone mockup on the Arcade page is interactive: tapping the `01 EARN`, `02 LEARN`, `03 PLAY` tabs or the `E` / `L` / `P` tiles scrolls to the matching section. A scroll-spy updates the active tab and tile as you scroll.

### Content

- Removed: all unverifiable statistics, individual user earnings, brand logos, media names, TV claims, investment claims, and the fictional app catalogue
- Rewrote the hero to a clear promise: "Find work. Build skills. Get paid."
- Rewrote section headings to answer real visitor questions rather than stack slogans
- Added FAQ with five genuinely useful questions
- Added a growth timeline and a user journey for narrative depth
- Replaced every "20 apps" / "5,000+ brands" / "70 Lakh+" style claim with descriptive copy

### 3D visual layer

- Hero phone: 3D perspective (`rotateY(-8deg) rotateX(3deg)`), subtle mouse-driven tilt on desktop, gentle continuous float
- Three floating UI cards orbit the phone at different Z-depths — showing product UI pieces (New campaign, Task submitted, Opportunity), not fake testimonials or earnings
- App experience section: phone with `rotateY(6deg)` and its own float
- Letter tiles (work categories, Arcade marks, teaser E/L/P, featured E) have physical depth via inset highlights, stacked shadow and slight hover lift
- Cards lift and tilt subtly on hover
- Buttons have inner highlight and pressed state
- Backgrounds use layered radial light and a low-opacity micro-grid
- Arcade nav is horizontal-scroll with snap points on mobile, plus touch-drag support
- On mobile, cards respond to tap with a small lift/tilt so the 3D layer is present without hover

No 3D libraries — CSS transforms and minimal JavaScript only.

### SEO

- Unique `<title>` and meta description per page
- Real canonical URLs (the deployed GitHub Pages URL, not placeholders)
- Open Graph and Twitter Card metadata
- Favicon (`favicon.svg`) referenced from both pages
- `robots.txt` and `sitemap.xml` at the repository root
- Structured data: `Organization` and `WebSite` on Home; `BreadcrumbList` on Arcade
- Semantic HTML, single `<h1>` per page, logical heading order
- Skip-to-content link for keyboard users
- Crawlable internal links — no `#` placeholder anchors in navigation

### Accessibility

- All interactive elements are real `<a>`, `<button>`, or `<summary>`
- Visible focus rings via `:focus-visible`
- `aria-label` on icon-only controls and decorative visuals
- Decorative elements marked `aria-hidden="true"`
- Full `prefers-reduced-motion` support — all animations and 3D transforms collapse cleanly
- Touch devices: hover-based 3D is disabled, replaced with tap feedback
- Arcade tabs and tiles have proper labels

### Responsive

Tested at 320 · 375 · 390 · 430 · 768 · 1024 · 1280 · 1440 · 1920.

- No horizontal overflow at any width
- Hero stacks on mobile; phone stays inside its stage
- Arcade phone mockup stays within its container on mobile
- Navigation collapses to a hamburger
- Arcade nav becomes horizontally scrollable
- Cards stack cleanly

---

## Tech

- **HTML5** — semantic structure, no framework
- **CSS3** — custom properties, no preprocessor, no framework
- **Vanilla JavaScript** — small, single-purpose module for interactions and 3D tilt
- **Google Fonts** — Inter Tight (UI) and Instrument Serif (italic accents), loaded with `preconnect`

No build step, no dependencies, no bundler.

---

## Project Structure
