# Changelog

## 2026-06-05 16:37 IST · fix(tracking): persist UTM attribution across page navigation

- Added `getMergedUTMParams()` to `lib/tracking/utm.ts` — merges the persisted (sessionStorage) UTMs with the current URL (URL wins, stored fills gaps) and re-persists when the URL carries UTMs.
- `sections/ContactSection/ContactSection.tsx` (PROXe CRM lead), `sections/Footer/Footer.tsx` (newsletter), and `app/gpfc-ai-lead-machine/page.tsx` now read UTMs via `getMergedUTMParams()` instead of `window.location.search`. Previously, once a visitor navigated away from the UTM landing page (Next.js drops the query string on internal navigation), these submissions sent BLANK utm_source/medium/campaign to the CRM — losing attribution.
- All three submissions now also send `utm_term` and `utm_content` (previously dropped).
- User-facing/business impact: leads captured anywhere on the site now retain their original traffic-source attribution, not just leads that convert on the exact landing page. Verified end-to-end: land on /about?utm_*, navigate to /services (no query) → persisted UTMs still sent.

## 2026-06-05 15:07 IST · fix(contact): limit solutions dropdown to four options

- Trimmed the contact form's "Solutions" dropdown in `sections/ContactSection/ContactSection.tsx` to exactly four options: AI Customer Acquisition, Brand Management, AI Content & Ads, Business App / Website (plus the "Select Solution" placeholder).
- Removed the old options: AI in Business, Brand Marketing, Business Apps, General Inquiry, and "Not sure yet / Want to discuss".
- Updated the pricing-quote pre-select to use the new `business-app-website` value so deep-links from the pricing flow still pre-fill correctly.
- User-facing: leads now choose from the four current solution lines only when submitting the contact form.
