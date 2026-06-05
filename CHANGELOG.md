# Changelog

## 2026-06-05 20:29 IST · feat(contact): make Brand Name a required field

- sections/ContactSection/ContactSection.tsx: Brand Name is now required — added handleSubmit validation ("Please enter your brand name"), the `required` attribute, and an inline error message under the field.
- Previously Brand Name was optional (only rendered after a solution was selected and never validated), which is why leads with a blank brand were being rejected by PROXe (400) and lost.
- The payload-side brand fallback (brandName -> name -> 'Website Lead') is kept as defense-in-depth in case the field is bypassed via any other path.
- User-facing: visitors must now enter a brand name before the contact form will submit.

## 2026-06-05 18:10 IST · fix(leads): stop dropping leads — PROXe rejected empty brand (400)

- ROOT CAUSE: PROXe's /api/website hard-requires a non-empty `brand` field ("Required: name + (email or phone) + brand"). The website sent `brand: ''` whenever the optional brand-name field was blank, so PROXe returned HTTP 400 and the lead was silently lost (the fetch failure was swallowed by a fire-and-forget catch, while the user was still redirected to /thank-you and appeared to convert).
- sections/ContactSection/ContactSection.tsx: `brand` now falls back to the lead's name → 'Website Lead' when no brand name is entered.
- sections/Footer/Footer.tsx: newsletter previously ALWAYS sent `brand: ''` (so no newsletter signup ever reached PROXe) — now falls back to the subscriber's name → 'Newsletter Subscriber'.
- app/gpfc-ai-lead-machine/page.tsx: defensive brand fallback added (businessType → name → 'GPFC Lead').
- All three now check the PROXe response status and log rejections (HTTP status + body) instead of silently dropping the lead.
- Combined with the prior UTM-persistence fix, leads from any page now reach PROXe WITH full UTM attribution (utm_source/medium/campaign/term/content), e.g. ChatGPT referrals carrying utm_source=chatgpt.com.
- User-facing/business impact: contact-form leads with no brand name, and ALL newsletter signups, now actually land in the CRM.

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
