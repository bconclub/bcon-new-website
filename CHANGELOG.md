# Changelog

## 2026-06-25 IST · feat(lead-machine): VSL video, tiered hero, vector icons, no emoji/dashes

- `app/lead-machine/page.tsx`:
  - Added a VSL video section under the hero (uses existing `/assets/Lead Machine Landing.mp4`) with a custom play-button overlay; fires a `vsl_play` GTM event on play
  - Hero headline split into 3 visual tiers (big "We'll Build You an AI Lead Machine" → medium "That Gets You Customers." → smaller "You Don't Lift a Finger.") instead of one large text block
  - Removed ALL emojis site-wide on this page; replaced with crisp accent-colored SVG vector icons (check, layers, chip, bolt, target, clock, shield, rocket, close) on dimensional tiles
  - Removed ALL em/en dashes from copy (eyebrow, CTAs, FAQ answers, guarantees), especially around numbers (e.g. "5 to 7 business days", "First 100 Businesses · 50% Off")
  - Added directional arrows: between the 3 How-It-Works steps (rotate downward on mobile) and inside every CTA button (nudge-right on hover)
- `app/lead-machine/page.css`: styles for VSL frame/overlay/play button, 3-tier hero, SVG icon tiles, step arrows, CTA arrow alignment; responsive at 900px/768px
- User-facing: richer, more visual landing page with an embedded sales video, clearer hero hierarchy, vector iconography, and no emoji. Verified no horizontal overflow at 375px + 1265px; VSL video serves 200; no console errors

## 2026-06-25 IST · feat(lead-machine): rebuild landing page to new 9-section flow

- `app/lead-machine/page.tsx`: complete content + structure rewrite to the approved flow — Hero (new headline, subline, 4 benefit bullets, CTA) → S1 What You're Getting (3 done-for-you blocks) → S2 How It Works (3 steps) → S3 The Problem (4-row list) → S4 Why This Is Different (4 cards) → S5 What You Get (6 outcomes) → S6 Proof (3 case-study placeholders) → S7 Pricing → Lead Form → S8 FAQ → S9 Final CTA
- Pricing updated: ₹40K/mo for first 2 months, then ₹80K/mo (was 20k/40k over 3 months); anchor ₹80K struck through
- FAQ rewritten to 6 new questions with draft answers (pending final approval)
- Proof section is placeholder (Starting Point → What the Machine Did → Result) pending real case-study inputs
- `/thank-you` redirect now passes lead params (name, email, phone, brand, service) so the thank-you page can personalize + trigger the voice call
- Brand fallback fixed: stale 'GPFC Lead' → 'Lead Machine Lead'
- `app/lead-machine/page.css`: new styles for hero bullets, getting grid, how-it-works steps, problem list, why-grid, proof cards; responsive stacking at 900px/768px
- User-facing: net-new landing page content and layout. Verified no horizontal overflow at 375px + 1265px, all 11 sections render, no console errors

## 2026-06-19 IST · feat(analytics): add missing GTM/fbq events across site

- `app/thank-you/page.tsx`: fires `fbq('track', 'Lead')` + GTM `lead_conversion` event on mount — previously zero conversion events fired on the thank-you page
- `app/thank-you/page.tsx`: GTM `whatsapp_click` event on WhatsApp button click; GTM `call_click` event on Call button click
- `sections/ShowReel/ShowReel.tsx`: GTM `showreel_opened` event when user opens the showreel modal
- `sections/CaseStudyModal/CaseStudyModal.tsx`: GTM `case_study_viewed` event with client_name, project_title, category when modal opens
- `components/StaggeredMenu/StaggeredMenu.tsx`: GTM `nav_click` event with item_label on all nav menu link/button clicks (external, homepage, contact, internal)
- User-facing: no UI changes — analytics only

## 2026-06-12 IST · feat(routing): rename /gpfc-ai-lead-machine → /lead-machine

- `app/gpfc-ai-lead-machine/` renamed to `app/lead-machine/` (page.tsx + page.css)
- `next.config.js`: permanent 308 redirect added from `/gpfc-ai-lead-machine` to `/lead-machine` — preserves SEO and any existing ad campaign links
- User-facing: page now lives at `/lead-machine`; old URL auto-redirects

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
