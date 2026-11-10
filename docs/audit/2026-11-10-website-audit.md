# Fly With Us website audit (10 Nov 2026)

**What was checked:** the full single page at `src/pages/index.astro`, on the local dev server and the production build.

**How it was checked:**
- **Impeccable design detector** at 1280×800 and 390×844, plus a scan of the source files.
- **In-browser measurements** at 375, 768, 820, 1024 and 1440px wide:
  - overflow, tap targets, text size, headings, images, form labels;
  - an animation and scroll audit against Emil Kowalski's motion rules (the `improve-animations` skill);
  - a section-by-section visual pass on a phone and on desktop;
  - a code review of every component and script.

**Not covered:**
- **Real devices:** iPhone Safari and a physical Android phone. Items marked *verify on device* need a real phone.
- **Automated accessibility tools:** the Axe plugin failed to connect and Lighthouse wasn't run. Contrast figures come from the Impeccable detector.

---

## Audit health score

| # | Dimension | Score | Key finding |
|---|---|---|---|
| 1 | Accessibility | **2 / 4** | Green WhatsApp buttons fail contrast (3.1:1). Lots of 9.6–10.9px labels. Moving content with no pause. |
| 2 | Performance | **2 / 4** | ~3.3 MB of plain JPEGs with no responsive sizes. 8 destination photos (~1.9 MB) download together. Timers run forever. |
| 3 | Theming | **3 / 4** | Solid colour tokens, but ~15 hard-coded colours in components. Light theme only, which is fine for this brand. |
| 4 | Responsive design | **3 / 4** | No sideways scrolling at any size tested. A few small tap targets and some spacing problems on phones. |
| 5 | Implementation integrity | **3 / 4** | A coherent, product-specific design (airport wayfinding in the brand navy). A few isolated slips (`scale(0)`, one bouncy easing, the blanket reduced-motion rule). |
| | **Total** | **13 / 20** | **Acceptable.** The design is strong; accessibility and performance need a focused pass. |

### Implementation integrity verdict: **PASS**

The site has a clear, specific design system. It isn't a generic template:
- **Airport wayfinding throughout:** gate labels, a split-flap departure board, boarding-pass forms and stubs, and an LED-style ticker.
- **Brand tokens drawn from the real business:** logo navy `#0b1f7e`, script steel blue, the office-wall blue, and paper/ink tones.

Most detector flags are deliberate design choices (see *Detector findings reviewed* below). The real problems are a handful of contrast, sizing and motion details, not drift in the design itself.

---

## Executive summary

**Issues found:** 0 × P0, 3 × P1, 15 × P2, 7 × P3.

**Top issues:**
1. **Green WhatsApp buttons fail WCAG AA contrast.** White on `#1fa855` is 3.1:1, and these are the main call-to-action on 6+ buttons.
2. **The booking form may be blocked on iPhones.** "Send on WhatsApp" opens the chat from inside a 350ms timer, which Safari's pop-up blocker can stop, so the most important action could silently do nothing. *Verify on device.*
3. **Images are unoptimised:**
   - 3.3 MB of JPEG with no width/height set, no responsive sizes and no WebP/AVIF.
   - The 300 KB 1920px hero photo is sent to 375px phones.
   - All 8 destination photos download at once.
   - An unused 332 KB photo is still published.
4. **Text is too small to read comfortably:** 9.6–10.9px monospace labels across forms, cards and the boarding passes.
5. **Constant motion with no pause control:** two scrolling strips, rotating quotes, the auto-advancing departure board and a pulsing WhatsApp button, with nothing to stop them on phones or by keyboard. Several keep running after you scroll past.

**Suggested order:** contrast + small text → booking pop-up fix → image pipeline → motion/scroll tidy-up → phone spacing → finishing polish.

---

## Detailed findings

### P1 (fix before sharing widely)

**[P1] WhatsApp buttons fail contrast**
- **Location:** `src/styles/global.css` (`--wa: #1fa855`, `.btn-wa`). Used in the nav, mobile menu, Services "Ask us" tile, booking submit, FAQ "Ask a question", and Visit "Message before you come".
- **Category:** Accessibility.
- **Impact:** white 15px bold text on `#1fa855` is **3.1:1**. People with low vision, or anyone reading a phone in sunlight, struggle to read the main button on the page.
- **Standard:** WCAG 1.4.3 Contrast (Minimum), which needs 4.5:1.
- **Recommendation:** darken the green to about `#0f7a3c` (≈ 5.3:1 with white) and use a deeper shade for hover. Optionally keep the bright WhatsApp green only for the icon.
- **Suggested command:** `$impeccable colorize`

**[P1] The booking form may not open WhatsApp on iPhone**
- **Location:** `src/components/Booking.astro`, submit handler: `setTimeout(() => window.open(url, '_blank', 'noopener'), 350)`.
- **Category:** Implementation integrity / Responsive.
- **Impact:** Safari (and some in-app browsers such as Instagram and Facebook) only allows a new window when it opens *directly* from a tap. Delaying it 350ms for the plane animation can get it blocked. Nothing then happens, and the customer gives up.
- **Recommendation:** open WhatsApp synchronously in the submit handler (`location.href = url` on touch devices, or `window.open` with no delay) and play the take-off animation alongside it. Test on a real iPhone and inside the Instagram in-app browser.
- **Suggested command:** `$impeccable harden`

**[P1] Image weight and delivery**
- **Location:** `public/images/**`, `Hero.astro`, `Services.astro`, `Destinations.astro`, `Visit.astro`.
- **Category:** Performance.
- **Impact:**
  - **About 3.3 MB of plain JPEG.** The hero is 1920×1440 / 300 KB but shows at 375px on phones.
  - **The destination photos load all at once.** All 8 sit stacked in one box, so lazy-loading starts them together (~1.9 MB).
  - **No width/height on any `<img>`,** which risks the page jumping as images load.
  - **`hero-attendant.jpg` (332 KB) is unused** but still published.
  - On mobile data in India this is the biggest drag on load time.
- **Recommendation:**
  - Switch to Astro's `<Picture>` from `astro:assets`, giving AVIF/WebP plus `srcset` at 480/960/1600px with intrinsic sizes.
  - Load only the active destination photo, and fetch the next one when the board advances.
  - Delete the unused file.
- **Suggested command:** `$impeccable optimize`

### P2 (next pass)

**[P2] Undersized text**
- **Location:** monospace labels across components:
  - `.label` / `.small` on the hero pass: 9.9px;
  - booking `.flabel` 10.6px and stub `.mono` 9.6px;
  - `.rv-tag` 9.9px, `.sign-short` 10.9px, `.cc-label` 10.9px, the destination board "Get fare" 10.9px, `.panel-kicker` 10.9px.
- **Category:** Accessibility.
- **Impact:** these are field labels and useful details, not decoration. They're hard to read on phones, and uppercase plus wide letter-spacing makes it worse.
- **Recommendation:** set a 12px floor for uppercase monospace labels (`0.75rem`), and 13px for form field labels.
- **Suggested command:** `$impeccable typeset`

**[P2] Low-contrast small text**
- **Location:**
  - sky `#1e8fe1` on paper (**3.1:1**): FAQ numbers, document-tab numbers, `.panel-kicker`, `.cc-label`, `.sign-short`, `.rv-tag`;
  - `.sign-short` on the navy hover fill (**4.0:1**);
  - form placeholders `#a6a9b8` (**2.3:1**);
  - board header `#747787` on `#030824` (4.4:1).
- **Category:** Accessibility.
- **Standard:** WCAG 1.4.3.
- **Recommendation:** use a darker blue (≈ `#1666b0`) for small text on paper, `#a9c8ef` on navy, and darken placeholders to ≈ `#7a7f96`.
- **Suggested command:** `$impeccable colorize`

**[P2] Moving content you can't pause**
- **Location:** `Hero.astro` (ticker, code flaps, rotating quote), `Reviews.astro` (marquee), `Destinations.astro` (auto-advance plus blinking status), `FloatingCta.astro` (pulsing ring).
- **Category:** Accessibility / Motion.
- **Impact:** six things move on their own at the same time. The reviews strip pauses only on mouse hover, so touch and keyboard users can't stop it. The pulsing ring repeats forever.
- **Standard:** WCAG 2.2.2 Pause, Stop, Hide.
- **Recommendation:**
  - Pause marquees on `:focus-within` and on tap.
  - Stop the quote rotation and board auto-advance when the section is off screen, and after the first tap.
  - Limit the WhatsApp ring to 3 pulses.
  - Optionally add one small "pause motion" toggle in the footer.
- **Suggested command:** `$impeccable animate`

**[P2] Reduced-motion setting turns everything off**
- **Location:** `src/styles/global.css` (the `@media (prefers-reduced-motion: reduce)` block).
- **Category:** Accessibility / Motion.
- **Impact:** `* { transition-duration: .01ms; animation-duration: .01ms }` also removes useful feedback: the hover fills, checklist ticks, the booking stub "pop", and FAQ open/close. Reduced motion should mean gentler motion, not none.
- **Recommendation:** remove movement (translate, scale, parallax, marquee, plane), but keep short opacity and colour fades of 150–200ms.
- **Suggested command:** `$impeccable animate`

**[P2] Mobile menu focus and scroll**
- **Location:** `src/components/Nav.astro`.
- **Category:** Accessibility / Responsive.
- **Impact:**
  - **Focus isn't handled.** When the menu opens, focus stays on the page behind it and Tab moves through hidden content.
  - **The page behind still scrolls on iPhone.** `body { overflow: hidden }` doesn't stop it.
  - **Slow to open.** It takes 0.7s on a control people use often.
- **Recommendation:**
  - Move focus to the first menu link and make the rest of the page inert while the menu is open.
  - Lock scrolling with `position: fixed` plus the saved scroll position.
  - Shorten the open animation to ≈ 400ms with the `cubic-bezier(0.32, 0.72, 0, 1)` drawer curve.
- **Suggested command:** `$impeccable harden`

**[P2] Small tap targets on phones**
- **Location:**
  - booking travellers stepper **34×34**;
  - swap button 40×40;
  - nav WhatsApp icon 40×40 on phones;
  - Destinations "Ask for any destination →" link, 16px tall.
- **Category:** Responsive.
- **Recommendation:** make these 44×44 minimum. For the stepper, enlarge the tappable area with padding rather than the icon itself.
- **Suggested command:** `$impeccable adapt`

**[P2] Floating buttons on phones**
- **Location:** `src/components/FloatingCta.astro`.
- **Category:** Responsive.
- **Impact:**
  - **The call button disappears on navy sections.** It's navy itself, so it vanishes on the Booking, Destinations, Reviews and Footer backgrounds.
  - **Both buttons cover content.** They sit on top of card text on the right edge.
  - **They show while the menu is open.**
- **Recommendation:**
  - Give the call button a white or outlined style, or merge both into a single WhatsApp button with a long-press or menu.
  - Hide them while the booking form is on screen, since it has its own send button.
  - Add bottom padding to the last item of each section.
- **Suggested command:** `$impeccable adapt`

**[P2] Booking form layout on phones**
- **Location:** `src/components/Booking.astro`.
- **Category:** Responsive.
- **Impact:**
  - **An empty stub comes first.** On phones the boarding-pass stub sits **above** the form, showing "··· ✈ ···, — —", about 300px of nothing before the first field.
  - **The service chips take up a lot of room.** All 10 wrap into 6 rows.
  - **The empty date field looks filled in.** Its `dd/mm/yyyy` hint is styled bold navy, like a real value.
- **Recommendation:**
  - On phones, move the stub below the send button, or shrink it to a one-line summary.
  - Put the chips in a horizontal scroll row (or show 4 plus "More").
  - Style the empty date hint like the other hints.
- **Suggested command:** `$impeccable layout`

**[P2] Services section on phones**
- **Location:** `src/components/Services.astro` (`.sign` `min-height: 260px`, `.sign-top { margin-bottom: auto }`).
- **Category:** Responsive / Layout.
- **Impact:** 7 tall tiles, each with an empty gap between the icon and the title, make about 1,900px of near-identical cards, which feels long and repetitive on a phone.
- **Recommendation:** on phones use compact rows (icon, title and one-line description side by side, no forced height), or a 2-column grid of short tiles.
- **Suggested command:** `$impeccable layout`

**[P2] Work that keeps running in the background**
- **Location:**
  - `Destinations.astro`: `setInterval` auto-advance every 3.8s, plus a 70ms timer per letter on each flip;
  - `Hero.astro`: code flips every 2.8s, quotes every 4.2s;
  - `motion.ts`: hero parallax on every scroll for the whole page;
  - 5 separate scroll listeners in Nav, FloatingCta, Hero, Steps and motion.
- **Category:** Performance.
- **Impact:** CPU and battery drain on phones and extra scroll jank, for things that are no longer visible.
- **Recommendation:**
  - Run each timer only while its section is on screen, using an IntersectionObserver to start and stop it.
  - Stop the parallax once the hero has scrolled out of view.
  - Merge the scroll handling into one passive listener that does a single `requestAnimationFrame` per frame.
- **Suggested command:** `$impeccable optimize`

**[P2] Animations that cause layout work, or replay on every click**
- **Location:**
  - `Checklist.astro`: `.docs-tab` animates `padding`; the panel replays a 0.6s entrance plus a 60ms-per-item stagger on every tab switch, including arrow-key navigation;
  - `FloatingCta.astro`: label animates `max-width`;
  - `Services.astro`: `.sign-arrow` grows from `scale(0)`, and the hover fill takes 0.7s with 0.5s colour changes.
- **Category:** Motion.
- **Recommendation:**
  - Animate a `translateX` indent instead of padding.
  - Crossfade checklist panels in ≈ 180ms with no stagger when switching by keyboard.
  - Start the arrow from `scale(0.9)` with `opacity: 0`.
  - Keep hover transitions at or under 250ms.
- **Suggested command:** `$impeccable animate`

**[P2] Missing headings**
- **Location:**
  - `Reviews.astro`: the rating section has no `<h2>`; the large "4.9" is a `<span>`.
  - `Services.astro`: card titles are `<span>`s.
- **Category:** Accessibility.
- **Impact:** screen-reader users browsing by heading skip the reviews and can't jump between services.
- **Recommendation:** add a visually hidden `<h2>Google reviews</h2>`, and make service titles `<h3>`.
- **Suggested command:** `$impeccable harden`

**[P2] Font loading**
- **Location:** `src/layouts/Layout.astro`, which loads Google Fonts: 4 families and 11 weights in one stylesheet.
- **Category:** Performance.
- **Impact:** the stylesheet blocks rendering, there's an extra network hop, and the big hero heading visibly swaps font as the page loads.
- **Recommendation:**
  - Self-host the fonts with `@fontsource` or Astro's font API, keeping only the weights in use (Montserrat 700/800/900, Archivo 400/600, Plex Mono 500/600, Great Vibes).
  - Preload Montserrat 900 for the heading.
  - Add a size-adjusted fallback font so the swap doesn't shift the layout.
- **Suggested command:** `$impeccable optimize`

**[P2] Site address and share previews**
- **Location:** `astro.config.mjs` (`site` falls back to `https://flywithusnow.com`) and `Layout.astro`.
- **Category:** Implementation integrity.
- **Impact:** any build without `SITE_URL` (for example a future Cloudflare build) points the share-preview image at `flywithusnow.com`. It isn't confirmed that this domain is owned, so WhatsApp and Instagram link previews could show no image. The page is also missing a canonical link, `sitemap.xml`, `robots.txt`, an apple-touch-icon and a 1200×630 share image.
- **Recommendation:**
  - Set the real domain, or the `*.pages.dev` address, as the default.
  - Add `@astrojs/sitemap`, a canonical link, `robots.txt`, PNG icons, and a purpose-made share image.
- **Suggested command:** `$impeccable harden`

### P3 (polish)

- **[P3] Bouncy easing on the review stars:** `Reviews.astro:146`, `cubic-bezier(0.34, 1.56, 0.64, 1)`. It's the only bouncy curve in an otherwise crisp system; use the site's `--ease-out`. → `$impeccable animate`
- **[P3] Earliest booking date uses UTC:** `Booking.astro` uses `new Date().toISOString()`, so between 00:00 and 05:30 IST customers can pick yesterday. Use the local date. → `$impeccable harden`
- **[P3] Wrong menu item highlighted:** in "How it works" (not in the menu), the menu highlights the previous section. Clear the highlight for sections without a menu link. → `$impeccable polish`
- **[P3] Single words on the last line of paragraphs:** the hero intro ("Mannarkkad."), the Services intro, the reviews sentence and FAQ answers. Add `text-wrap: pretty` to `.lede`, `p`. → `$impeccable typeset`
- **[P3] Footer on phones:** the two service lists stack into a long column. Use a 2-column grid under 760px. → `$impeccable layout`
- **[P3] Tablet portrait hero (≈ 820×1180):** the text sits in the bottom 45% with a large empty sky above. Consider `justify-content: center` between 760 and 1079px. → `$impeccable layout`
- **[P3] Content is invisible until it animates in:** if the IntersectionObserver never fires (for example when printing or in some in-app browsers), sections stay at `opacity: 0`. Add a `@media print` override and a safety timeout that reveals everything. → `$impeccable harden`

---

## Detector findings reviewed (intentional, not bugs)

| Detector flag | Verdict |
|---|---|
| `kicker-above-heading` × 7 (Gate labels) | **Intentional.** The gate labels are the site's wayfinding system. Keep them. |
| `cream-palette` (`#f6f4ef` page) | **Intentional.** Warm "ticket paper" tone, paired with brand navy. |
| `marquee` × 2 | **Intentional** (a departure ticker and a reviews strip), but each needs a pause option; see the P2 item above. |
| `dark-glow` on the active board row | **Intentional and subtle.** It replaced the side-bar accent. Fine as is. |
| `repeating-stripes-gradient` | **Intentional.** It draws the boarding-pass barcodes. |
| `border-accent-on-rounded` (booking stub, phone) | **Intentional.** That's the ticket's perforated tear line. |
| `undersized-ui-text`, `low-contrast` | **Confirmed.** See the P2 items above. |

## Patterns across the site

- **Small monospace labels everywhere.** Uppercase monospace text is often set at 0.6–0.68rem, so one shared token (`--label-size: 0.75rem`) would fix them all.
- **The sky blue doubles as a text colour.** `#1e8fe1` works as an accent but fails as small text on paper, so a separate "text blue" token is needed.
- **Each component runs its own timers and scroll listeners.** A single shared motion/visibility helper would stop them when off screen and handle reduced motion in one place.
- **Hard-coded colours** (`#0a1b63`, `#13299a`, `#17205a`, `#030824`, `#040a2e`…) should become tokens such as `--navy-2`, `--board`.

## What's working well

- **No sideways scrolling** at 375, 768, 820, 1024 or 1440px, and every grid collapses cleanly.
- **Every form field has a label, every link has a name,** and the radio chips and checkboxes are real inputs you can reach by keyboard. Focus outlines show everywhere.
- **The design is distinctive and on-brand.** The airport-wayfinding concept (gates, split-flap board, boarding passes) reads as Fly With Us, not a template.
- **Most motion uses sensible easing and cheap properties:** `transform`, `opacity` and `clip-path` with custom ease-out curves. The hero entrance, reveals and the board flip are well paced.
- **The WhatsApp-first flow is well thought out.** The booking form validates, writes a clean message, and the stub previews it live.
- **The review data is automated:** a weekly reminder, a validated update form, and auto-deploy to GitHub Pages.
- **Lazy loading** is used on every image below the first screen, and the hero image is preloaded.

---

## Recommended actions (in order)

1. **[P1] `$impeccable colorize`:** darken the WhatsApp button green and add a text-safe blue for small labels (also fixes the low-contrast P2s).
2. **[P1] `$impeccable harden`:** make the booking form open WhatsApp directly on tap, and test on iPhone and in-app browsers. In the same pass: mobile menu focus and scroll lock, missing headings, site address and share previews, UTC date, print/reveal fallback.
3. **[P1] `$impeccable optimize`:** `<Picture>` with AVIF/WebP and responsive sizes, load destination photos one at a time, delete the unused photo, self-host fonts, and pause timers and parallax off screen.
4. **[P2] `$impeccable typeset`:** a 12px floor for monospace labels, 13px for form labels, and `text-wrap: pretty`.
5. **[P2] `$impeccable animate`:** pause controls for moving content, a gentler reduced-motion mode, the drawer curve and duration, no padding animation, no `scale(0)`, ≤250ms hovers, and replace the bouncy star easing.
6. **[P2] `$impeccable adapt`:** 44px tap targets and visible floating buttons on navy sections.
7. **[P2] `$impeccable layout`:** compact service rows, booking stub and chips on phones, footer columns, tablet hero spacing.
8. **`$impeccable polish`:** a final pass across the page at all sizes.

You can ask me to run these one at a time, all at once, or in any order you prefer. Re-run `$impeccable audit` after fixes to see the score improve.

---

## Fixes applied (10 Nov 2026, same day)

All P1, P2 and P3 items above were fixed. Re-check results:

- **Detector:** desktop findings **70 → 14**, phone **51 → 14**, source **1 → 0**.
  - **Gone:** every small-text, straggler, bouncy-easing and readable-text contrast flag.
  - **Remaining, all deliberate:** gate labels, paper background, the departure/review strips (now pausable), barcode stripes, and the active board-cell glow.
- **Overflow:** none at any size tested. **Image sizes:** every `<img>` now has width/height set. **Headings:** every section now has an `<h2>`; service titles are `<h3>`.
- **Booking:** WhatsApp opens synchronously from the tap (verified), and the earliest date is the local date.
- **Mobile menu:** focus moves in, the page is inert and scroll-locked, Escape restores focus and scroll position.
- **Pause motion:** the switch stops all looping motion and remembers the choice.
- **Fonts:** Google Fonts removed, now self-hosted.
- **Images:** the hero is served as AVIF (4–19 KB instead of 300 KB), and only the active destination photo loads.

| # | Dimension | Before | After |
|---|---|---|---|
| 1 | Accessibility | 2 | 3 |
| 2 | Performance | 2 | 3 |
| 3 | Theming | 3 | 4 |
| 4 | Responsive design | 3 | 4 |
| 5 | Implementation integrity | 3 | 3 |
| | **Total** | **13 (Acceptable)** | **17 (Good)** |

**Still to verify on real devices:**
- **iPhone Safari and Instagram/Facebook in-app browsers:** the booking hand-off to WhatsApp.
- **Lighthouse and Axe:** a pass once the Axe plugin connects.
