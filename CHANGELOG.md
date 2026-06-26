# Changelog

## 2026-06-25 IST · fix(lead-machine): content card is a true no-crop bento

- `app/lead-machine/page.tsx` + `page.css`: the "We Make the Content" card now shows each creative at its OWN aspect ratio — a 3-column masonry (`column-count`, `height:auto` images) so stories stay 9:16, the landscape (Comet) stays 4:3, squares stay square. Nothing is cropped (the previous fixed grid was cover-cropping stories/landscapes into squares, which the user called out)
- Tuned to 9 tiles that pack to exactly the card's inner height (470px) — verified zero tiles clipped, all three cards still identical (359×490)

## 2026-06-25 IST · fix(lead-machine): Section 1 = three equal cards, small tiles, real-estate chat

- `app/lead-machine/page.tsx` + `page.css`: rebuilt the three "What You're Getting" columns as THREE EQUAL CARDS — all exactly the same width and height (359×490), sharing one `.alm-card` shell (bg, border, radius). Fixes the long-standing mismatched-size problem
  - Card 1 "We Make the Content": a tidy 3×4 grid of 12 small creative tiles (content-library look) instead of big posters
  - Card 2 "We Run the Campaigns": same campaign UI, now in the shared equal card
  - Card 3 "We Manage Every Lead": replaced the phone-bezel mockup with a flat chat card and a REAL-ESTATE conversation — "Looking for a 3 BHK in Whitefield?" → a horizontal carousel of 3 property cards (real apartment photos via Unsplash: Prestige Lakeside, Brigade Cosmopolis, Sobha Dream Acres — 3 BHK, ₹ prices, Available · Whitefield) → "Can I visit this weekend?" → "Site visit booked for Saturday, 11 AM."
- Added `public/unsplash/property-*.jpg` (3 real-estate photos, ~25KB each) + `_credits.json`
- Verified in a real browser: three cards identical size, property photos load, no horizontal overflow

## 2026-06-25 IST · fix(lead-machine): bento shows full creatives (no crop), balanced

- `app/lead-machine/page.tsx` + `page.css`: "We Make the Content" bento now shows each creative at its natural aspect ratio (CSS-columns masonry, `height:auto`) instead of cropping posters into fixed cells — fixes the chopped-off ad text (e.g. "SWAP DEALS", Organix, Thar were being cut)
- Tuned to 4 creatives (a portrait + landscape + square mix) so the bento height (~498px) balances the campaign card (~451px) and the phone/pipeline column (~536px) — all three columns now align instead of col 1 sticking out
- Verified in a real browser at desktop: full posters, no cropping, no horizontal overflow, balanced columns

## 2026-06-25 IST · fix(lead-machine): hero VSL play-button overlay returns on end/pause

- `app/lead-machine/page.tsx`: removed the "Watch how it works" caption from the hero video overlay (just a play button now); added `onEnded` (resets to start + shows the play button so it can be replayed) and `onPause` (brings the play button back over the frame) handlers
- User-facing: when the hero video finishes or is paused, the play button reappears instead of the video sitting frozen

## 2026-06-25 IST · fix(lead-machine): static bento (not carousel), coherent chat, mobile

- `app/lead-machine/page.tsx` + `page.css`:
  - "We Make the Content" is now a **static bento mosaic** (no scrolling/animation) — a compact 2-column grid of 5 real creatives with a tall accent tile; removed the auto-scrolling carousel and its marquee animation entirely
  - Rewrote the "We Manage Every Lead" chat to a coherent product inquiry: "Is the DGCA ground class batch still open?" → "Yes! Limited seats for the 15 June batch. Here are the details:" → product card → "Perfect, how do I enroll?" → "I'll reserve your seat and send the enrollment link now." (replaces the nonsensical "Yes, how can I help you?")
  - Mobile: Section 1 columns now stack properly — campaign-card panels stack, the phone mockup is centered/capped, and the pipeline + meetings sit below it (fixes the blown-up mobile layout)
- User-facing: content shows as a clean static bento, the lead-management demo reads like a real conversation, and Section 1 is usable on mobile

## 2026-06-25 IST · feat(lead-machine): swap in the real AI Lead Machine VSL video

- Added `public/assets/AI-Lead-Machine-VSL.mp4` (16.7MB, 31s) and pointed the hero VSL player at it, replacing the old placeholder `Lead Machine Landing.mp4`
- Self-hosted (consistent with the existing portfolio MP4s) — plays through the existing play-overlay + `<video controls>`; verified playing in a real browser
- User-facing: the hero video is now the real AI Lead Machine sales video

## 2026-06-25 IST · feat(lead-machine): product-details card in "We Manage Every Lead" chat

- `app/lead-machine/page.tsx` + `page.css`: the phone chat now replies to "is this still available / can you share details" with a proper **product-details card** instead of a raw image — Wind Chasers "DGCA Ground Classes" with an availability badge (Available · Batch 15 Jun), "Limited seats" meta, and a "View Details" action, using the real Wind Chasers flight-academy creative (`WC-Event.jpg`)
- Moved `WC-Event.jpg` out of the content carousel (swapped in Come-to-Dubai) so the flight creative is exclusive to the product card — no repeats
- User-facing: the lead-management demo reads like a real qualified-lead conversation (product card, not a stray photo)

## 2026-06-25 IST · fix(lead-machine): real brand logos in campaign card, uniform size

- `app/lead-machine/page.tsx` + `page.css`: replaced the broken unicode-glyph icons (◎ ◇ ▲) and the text "G" in the campaign card with proper inline SVG brand logos — Meta, Google, Facebook, Instagram, Messenger, Google Ads. All six badges now render real logos at a single uniform size (18×18 inside 30px circles); no more glyph breakage or mismatched sizing
- User-facing: the "We Run the Campaigns" card shows accurate, consistent platform logos

## 2026-06-25 IST · feat(lead-machine): bento carousel + rich campaign card in Section 1

- `app/lead-machine/page.tsx` + `page.css`:
  - "We Make the Content" is now an auto-scrolling **bento carousel** — each creative keeps its natural aspect ratio (fixed height, auto width) so tiles vary in shape like the home gallery; 11 distinct portfolio creatives (no repeats), seamless margin-based loop, pauses on hover, edge fade. Fixed a grid-blowout where the wide track forced the column full-width (`min-width: 0`)
  - "We Run the Campaigns" dashboard replaced with a richer **campaign card** matching the approved reference: Meta + Google badges, a Campaign Setup panel (Objective→Leads, Audience avatars +2.4K, Budget $50/day toggle, Launch Campaign button), a Live Performance panel (Leads 1,247 ▲26%, area chart, CPL $6.21 / ROAS 4.6x), an Ad Distribution fan-out to Facebook/Instagram/Messenger/Google Ads, and a Research→Target→Build→Launch→Optimize step bar
  - Phone chat media bubble uses a held-out creative (Come-to-Dubai) so nothing repeats with the carousel
- User-facing: Section 1 is a far more dynamic, polished product showcase. Verified in a real browser, no horizontal overflow

## 2026-06-25 IST · feat(lead-machine): use real portfolio creatives in "We Make the Content"

- `app/lead-machine/page.tsx` + `page.css`: replaced the gradient placeholder cards in the "We Make the Content" grid with the real campaign creatives already used on the home gallery (`/portfolio/thumbnails/*` — Thar AI, Campa Cola, Comet AI, Organix Rosa, Birdbox, LS Swap). Static poster images (no moving video) with a play button overlay; the phone chat media bubble now shows a real creative too
- User-facing: the content showcase now displays BCON's actual ad creatives instead of placeholders

## 2026-06-25 IST · feat(lead-machine): rebuild Section 1 as visual mockup showcase

- `app/lead-machine/page.tsx` + `page.css`: rebuilt the "One System. Three Jobs." section to match the approved reference design with three rich visual columns:
  - Col 01 "We Make the Content": 3×2 grid of creative-ad cards (KASTURI, BUILT TO PERFORM, CONFIDENCE IS QUIET, WHEY THAT WORKS, MOVE DIFFERENT, LIVE BETTER) with gradient placeholders, labels, and bottom-left play buttons (real creatives to be dropped in later)
  - Col 02 "We Run the Campaigns": a "Campaign Performance" dashboard card — Leads 1,247 (+24%), Cost per Lead $6.21 (-12%), ROAS 4.6x (+18%), a green line chart with axes, four platform cards (Facebook/Instagram/Google/TikTok, each Active with CPL), and a "View All Campaigns" button
  - Col 03 "We Manage Every Lead": an iPhone chat mockup (AI Lead Machine, WhatsApp-style bubbles + media + input bar) beside a "Lead Pipeline" card (New Lead 127, Contacted 94, Qualified 61, Booked 23, Won 11) and a "Qualified Meetings Booked 23 +15%" stat with mini chart
- Section header, column subtitles, and closer line centered/updated to match the reference
- User-facing: the section is now a visual product showcase instead of three text blocks. Verified against the reference in a real browser at desktop; no horizontal overflow

## 2026-06-25 IST · feat(lead-machine): move VSL video into hero, under headline

- `app/lead-machine/page.tsx`: moved the VSL video out of its own standalone section and up into the hero, positioned directly below the headline ("You Don't Lift a Finger.") and above the "You don't need more tools..." copy; removed the separate "Watch This First" section
- `app/lead-machine/page.css`: hero no longer forces 100vh (grows naturally with the video); added `.alm-hero-vsl` wrapper (max-width 760px, centered) reusing the existing video frame/overlay styles
- User-facing: the sales video is now the first thing under the headline, with the supporting "You don't need..." copy beneath it

## 2026-06-25 IST · style(lead-machine): sharpen hero text hierarchy

- `app/lead-machine/page.css`: widened the size/weight steps between the three hero tiers so the headline reads as a clear title + two smaller sub-lines instead of one block — line 1 "We'll Build You an AI Lead Machine" (clamp 42-84px, weight 900), line 2 "That Gets You Customers." (clamp 22-40px, weight 700, dimmer), line 3 "You Don't Lift a Finger." (clamp 15-24px, weight 500, dimmest); increased the inter-line gap
- User-facing: hero no longer reads as one large chunk of text

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
