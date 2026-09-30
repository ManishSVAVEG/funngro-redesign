# Funngro — 2-Page Redesign

> A production-quality redesign of Funngro's public website.
> Static site — HTML5, CSS3, vanilla JavaScript. No build step. No dependencies.
> Deployed as two pages: **Home** and **Arcade**.

---

## What this project demonstrates

This is not a template. Every decision below was made deliberately — from
the design system to the SEO metadata to the way animations respect
`prefers-reduced-motion`.

### Product & UX
- Studied the reference website end-to-end before writing any code
- Preserved Funngro's information architecture, terminology and brand voice
- Removed friction: hero communicates *what / who / how / next* within one viewport
- Arcade page makes app discovery easier via category tabs with scroll-spy
- Every section has a purpose — no filler

### UI & Visual design
- Editorial typography system: Inter Tight (UI) + Instrument Serif italic (accents)
- Single-accent green palette on a green-tinted near-black base
- Hairline borders, restrained surfaces, controlled contrast
- Letter-tile monograms instead of generic icon packs
- Responsive from **320px → 1920px** with real layout changes, not shrinks
- No gradients-for-gradients-sake, no glassmorphism, no fake depth

### Frontend engineering
- Single shared stylesheet (`styles.css`) with a CSS custom-property design-token layer
- Semantic HTML5 throughout: `header`, `nav`, `main`, `section`, `article`, `footer`
- One `h1` per page, correct `h2` / `h3` hierarchy
- One shared JS module (`script.js`) with clear, single-purpose sections
- No frameworks, no build tools, no dependencies beyond Google Fonts

### Animation & motion
- Scroll-progress bar (top, accent line)
- Text mask reveal on the hero heading (clip-path style slide-up)
- IntersectionObserver-based reveals with CSS-driven stagger via `--i` custom property
- Count-up statistics using `easeOutQuart`
- Floating phone mock-up + orbit badges at staggered phases
- Infinite brand marquee (pauses on hover)
- Cursor spotlight in hero (desktop only)
- Magnetic button highlight (radial gradient follows cursor)
- Card hover: lift, border glow, tile rotation, arrow nudge
- Full `prefers-reduced-motion` support — every animation collapses cleanly

### Accessibility
- Keyboard-navigable: all interactive elements are real `<a>` or `<button>`
- Visible focus rings via `:focus-visible`
- `aria-label` on icon-only links, `aria-current="page"` on breadcrumb
- Decorative elements marked `aria-hidden="true"` (phone mock-up, glows, marquee)
- Sufficient contrast throughout (verified against WCAG AA on body text)
- Mobile menu toggles `aria-expanded` correctly

### SEO
- Unique `<title>` and `<meta name="description">` per page
- Canonical URL strategy (placeholder until production domain is known)
- Open Graph + Twitter Card metadata
- Semantic HTML that search engines can parse without JS
- Crawlable internal navigation — no `#` placeholder links anywhere
- No keyword stuffing, no fabricated claims

### Performance
- Zero runtime dependencies
- Google Fonts loaded with `preconnect` for faster first paint
- CSS animations use `transform` and `opacity` (GPU-composited)
- IntersectionObserver defers work until elements enter viewport
- All animations respect `prefers-reduced-motion` — no CPU burn for users who opt out
- `scroll` listeners are `{ passive: true }` and rAF-throttled

### Deployment
- Fully portable static site — works from a `file://` path, a local server, GitHub Pages, Vercel or Netlify
- All asset paths are relative (`./styles.css`, `./script.js`, `./arcade.html`)
- No absolute paths, no `localhost` URLs, no drive letters
- Zero configuration needed on any static host

---

## Pages

| Route | File | Purpose |
|-------|------|---------|
| `/` | `index.html` | Home — hero, brand wall, TV feature, how it works, income ladder, work types, stories, app showcase, press, arcade teaser |
| `/arcade.html` | `arcade.html` | Arcade — 20 apps across 4 categories (Earn · Learn · Puzzle & Brain · Play & Classics) |

Every link on the site points to one of these two pages, or to a section within them. No external redirects, no dead links, no placeholder `#`.

---

## Project structure
