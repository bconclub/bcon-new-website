# Changelog

## 2026-06-05 15:07 IST · fix(contact): limit solutions dropdown to four options

- Trimmed the contact form's "Solutions" dropdown in `sections/ContactSection/ContactSection.tsx` to exactly four options: AI Customer Acquisition, Brand Management, AI Content & Ads, Business App / Website (plus the "Select Solution" placeholder).
- Removed the old options: AI in Business, Brand Marketing, Business Apps, General Inquiry, and "Not sure yet / Want to discuss".
- Updated the pricing-quote pre-select to use the new `business-app-website` value so deep-links from the pricing flow still pre-fill correctly.
- User-facing: leads now choose from the four current solution lines only when submitting the contact form.
