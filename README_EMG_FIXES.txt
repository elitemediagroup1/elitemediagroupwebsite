EMG site polish package

What changed:
- Renamed homepage to index.html and normalized all seven pages in one deploy-ready folder.
- Added the CRT hero image as hero-monitor.png instead of relying only on giant inline base64 for the homepage hero.
- Fixed logo clicks so the EMG mark returns to index.html instead of #.
- Added SEO descriptions / OG copy to pages that were missing it.
- Improved mobile nav so the navigation does not disappear on phones.
- Added accessibility focus states and reduced-motion support.
- Added mobile polish for the CRT screen hero, cards, comparison table, footer, and page hero spacing.

Deploy notes:
- Upload every file in this folder together.
- Keep hero-monitor.png in the same folder as index.html.
- Current contact form still needs to be wired to your form handler, HubSpot, or email endpoint.
