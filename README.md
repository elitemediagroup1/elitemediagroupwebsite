# Elite Media Group — EMG Loop™ Website

The full multi-page website for **Elite Media Group**, a performance marketing company. The site is built around the EMG Loop™ — a single accountable performance system that operates across seven verticals.

> *Influence fades. Systems endure.*

---

## Site Structure

\`\`\`
/
├── index.html              # Homepage (existing)
├── services.html           # Six capabilities / one system
├── verticals.html          # Seven markets / same loop
├── why-emg.html            # Elite is earned — positioning, comparison, founder story
├── process.html            # 5-step engagement process + FAQ + partnership models
├── contact.html            # Split-layout contact form + response expectations
├── README.md
└── assets/
    ├── css/
    │   └── global.css      # Shared design system
    └── js/
        └── global.js       # Terminal clock + cycling phases + nav scroll
\`\`\`

Each interior page links to `assets/css/global.css` for the shared design system and embeds page-specific layout styles inline.

---

## Design System

### Colors

| Token            | Hex       | Use                                |
|------------------|-----------|------------------------------------|
| `--navy`         | #0c1a2e   | Primary dark surface               |
| `--teal`         | #2d9e8a   | Primary brand accent / buttons     |
| `--teal-light`   | #3ec4ad   | Italic headline emphasis           |
| `--white`        | #ffffff   | Light text / clean surfaces        |
| `--cream`        | #f3f0ea   | Soft section backgrounds           |
| `--warm-off`     | #eae6de   | Tertiary surfaces                  |
| `--warm-gray`    | #d8d3c8   | Grid gap color / borders           |
| `--mid-gray`     | #888278   | Secondary body text                |
| `--dark`         | #060d18   | Deepest hero backgrounds           |
| `--darker`       | #030810   | Terminal widget background         |
| `--phosphor`     | #39ff9a   | Terminal active cycle text         |

### Typography

- **Display / Headlines:** `Instrument Serif` — italics for emphasis words, colored `--teal-light`
- **UI / Labels / Nav:** `Barlow Condensed` 700–800, uppercase, .06–.12em letter-spacing
- **Body:** `Barlow` 300–400, line-height 1.75–1.8
- **Mono / Terminal labels:** `IBM Plex Mono` 400–700, uppercase, .10–.22em letter-spacing

All four fonts load from Google Fonts.

### Recurring Components

- `.label` — IBM Plex Mono section label with leading 22px line
- `.btn-p` — Primary teal button
- `.btn-g` — Ghost text button with arrow
- `.card` — Tile card with navy hover flip
- `.cta` — Teal full-width call-to-action section
- `.terminal` — Dark terminal widget with cycling phases (driven by `initTerminal`)
- `.grid-gap` — 2px gap grid using `--warm-gray` as the gap line

---

## Pages

| Page              | Hero                            | Core sections                                                                  |
|-------------------|---------------------------------|--------------------------------------------------------------------------------|
| `services.html`   | Six capabilities. One system.   | Terminal cycle, 6-card services grid, process teaser, CTA                     |
| `verticals.html`  | Every vertical. Same loop.      | 7 vertical detail cards with Loop config + compliance notes, CTA              |
| `why-emg.html`    | Elite is earned.                | 5-row philosophy, founder story, stats, comparison table, quote, CTA          |
| `process.html`    | From conversation to compounding.| 5-step process, 3 partnership models, FAQ, CTA                                |
| `contact.html`    | No pitch decks until we know if we're a fit. | Split form + response expectations                                  |

---

## Updating Content

- **Copy:** All copy lives inline in each HTML file inside the relevant `<section>`. Search by the section's `.label` text.
- **Design tokens:** Change colors and base typography in `assets/css/global.css` under `:root`.
- **Nav links:** Update the `<nav class="nav">` block on each page — keep them identical.
- **Footer:** Update the footer block on each page — keep them identical.

---

## Deployment

### Netlify (recommended)
1. Netlify → Add new site → Import an existing project → GitHub
2. Select this repo
3. Build command: *(leave blank — this is a static site)*
4. Publish directory: `.` (single dot, the repo root)
5. Deploy site

### GitHub Pages
Repository → Settings → Pages → Source: `Deploy from a branch` → `main` / `/ (root)`. The site will be live at `https://<org>.github.io/<repo>/`.

---

## Tone & Copy Rules

- Outcome language: **converts**, **compounds**, **accountable**, **measurable** — not reach / impressions / engagement.
- Short sentences. Paragraphs: 2–3 sentences max.
- Avoid "innovative" and "cutting-edge" — too generic.
- Terminal/tech aesthetic for **labels**, not body copy.
- "Loop" is always capitalized and followed by ™ in the logo lockup.
- Reusable taglines: *Influence fades. Systems endure.* / *One loop. Every vertical.* / *Systems that convert.*

---

## What Not To Do

- Don't add stock photography to interior pages — use the dark navy + teal system instead.
- Don't introduce additional fonts (Inter / Roboto / system fonts). Only the four Google Fonts above.
- Don't change the color palette.
- Don't break the card hover pattern (navy background + white text flip).
- Don't add a hamburger menu yet — mobile nav hides links by design.
- Don't add cookie banners, modals, or pop-ups.

---

© Elite Media Group. All rights reserved.
