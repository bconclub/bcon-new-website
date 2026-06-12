'use client';

import { useState } from 'react';
import { getMergedUTMParams } from '@/lib/tracking/utm';
import './page.css';

interface FormData {
  name: string;
  businessType: string;
  phone: string;
  email: string;
}

const faqs = [
  {
    q: 'What exactly is included in the 20k/month package?',
    a: 'Everything: the full PROXe platform (landing pages, unified inbox for WhatsApp/Telegram/socials, dashboard), complete ad setup across Meta/Google, and ongoing management. No hidden fees, no piecemeal add-ons.'
  },
  {
    q: 'How quickly can we go live?',
    a: 'Onboarding takes 5–7 business days. We set up your PROXe account, build your ad creatives, configure your landing pages, and connect your inboxes. You start receiving leads within the first week.'
  },
  {
    q: 'What happens after the first 3 months?',
    a: 'After the 3-month introductory period at 20k/month, the service continues at the standard 40k/month rate. You can cancel anytime before the 3-month period ends with no penalty.'
  },
  {
    q: 'We already run ads. Can we still use this?',
    a: 'Yes. We either migrate your existing campaigns into our managed system or run alongside them. Either way, you get the full PROXe platform and unified inbox immediately.'
  },
  {
    q: 'What industries does this work for?',
    a: 'Real estate, education, clinics, professional services, retail, hospitality — any service business where lead follow-up speed and organization determines whether deals close.'
  },
  {
    q: 'Is there a contract?',
    a: 'Monthly. No long-term lock-in. We keep your business because results keep you, not contracts.'
  }
];

export default function AILeadMachinePage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    businessType: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const submitToPROXe = async (formData: FormData) => {
    try {
      // UTM params: use the persisted (cross-page) store, falling back to the
      // current URL, so attribution survives cross-page navigation.
      const utm = getMergedUTMParams();
      const utmSource = utm.utm_source || '';
      const utmMedium = utm.utm_medium || '';
      const utmCampaign = utm.utm_campaign || '';
      const utmTerm = utm.utm_term || '';
      const utmContent = utm.utm_content || '';

      const res = await fetch('https://proxe.bconclub.com/api/website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
          message: `AI Lead Machine inquiry - Business Type: ${formData.businessType}`,
          form_type: 'contact',
          page_url: window.location.href,
          // PROXe requires a non-empty brand or it rejects the lead with 400.
          brand: formData.businessType?.trim() || formData.name?.trim() || 'GPFC Lead',
          service: 'ai-lead-machine',
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_term: utmTerm,
          utm_content: utmContent,
        }),
      });
      if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        console.error(`PROXe submission rejected (HTTP ${res.status}):`, errBody);
      }
    } catch (e) {
      console.error('PROXe submission failed:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.businessType.trim()) newErrors.businessType = 'Business type is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = 'Valid email is required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);

    // GTM tracking
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'web_lead',
        formType: 'AI Lead Machine',
        service: 'ai-lead-machine',
        businessType: formData.businessType,
      });
    }

    // Send to PROXe (fire-and-forget, non-blocking)
    submitToPROXe(formData);

    // Send notification email
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'lead',
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: 'AI Lead Machine',
          brandName: formData.businessType,
        },
      }),
    }).catch((err) => console.error('Email notification failed:', err));

    setTimeout(() => {
      window.location.href = '/thank-you';
    }, 200);
  };

  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="alm-page">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="alm-hero">
        <div className="alm-hero-badge">LIMITED — First 100 Businesses Only</div>

        <h1 className="alm-hero-headline">
          You're Losing Leads<br />
          <span className="alm-accent">Right Now.</span>
        </h1>

        <p className="alm-hero-sub">
          WhatsApp pings. Instagram DMs. Facebook enquiries. Google form submissions.
          Your team is chasing them across 6 different apps — and half the leads go cold before anyone follows up.
        </p>

        <div className="alm-hero-stats">
          <div className="alm-stat">
            <span className="alm-stat-num">78%</span>
            <span className="alm-stat-label">of leads go to the first business that responds</span>
          </div>
          <div className="alm-stat-divider" />
          <div className="alm-stat">
            <span className="alm-stat-num">5 min</span>
            <span className="alm-stat-label">is the window before lead interest drops sharply</span>
          </div>
          <div className="alm-stat-divider" />
          <div className="alm-stat">
            <span className="alm-stat-num">3x</span>
            <span className="alm-stat-label">more conversions with a unified follow-up system</span>
          </div>
        </div>

        <button className="alm-cta-btn" onClick={scrollToForm}>
          Get AI Lead Machine — Start Now
        </button>

        <p className="alm-hero-note">50% off for your first 3 months · No contracts</p>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────── */}
      <section className="alm-section alm-problem">
        <div className="alm-container">
          <div className="alm-section-label">The Problem</div>
          <h2 className="alm-section-heading">
            Your leads exist.<br />Your system doesn't.
          </h2>
          <div className="alm-problem-grid">
            <div className="alm-problem-card">
              <div className="alm-problem-icon">⚡</div>
              <h3>Scattered Inboxes</h3>
              <p>WhatsApp, Instagram, Telegram, Facebook, email — your team jumps between platforms and things fall through the cracks daily.</p>
            </div>
            <div className="alm-problem-card">
              <div className="alm-problem-icon">🔥</div>
              <h3>Slow Follow-Ups</h3>
              <p>By the time someone responds to a lead, they've already spoken to a competitor. Speed is the difference between a sale and a missed opportunity.</p>
            </div>
            <div className="alm-problem-card">
              <div className="alm-problem-icon">💸</div>
              <h3>Ad Spend Wasted</h3>
              <p>You pay for every click. When leads don't convert because of poor follow-up infrastructure, you're burning budget with nothing to show for it.</p>
            </div>
            <div className="alm-problem-card">
              <div className="alm-problem-icon">🧩</div>
              <h3>No Single View</h3>
              <p>No one person has a full picture of all incoming leads. Sales, marketing, and management are working from different data — or no data at all.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOLUTION ─────────────────────────────────────────── */}
      <section className="alm-section alm-solution">
        <div className="alm-container">
          <div className="alm-section-label">The Solution</div>
          <h2 className="alm-section-heading">
            Introducing <span className="alm-accent">AI Lead Machine</span>
          </h2>
          <p className="alm-solution-desc">
            Not another tool. Not another dashboard. A complete, done-for-you lead generation and management system — built, launched, and managed by us, powered by PROXe AI.
          </p>
          <div className="alm-solution-highlight">
            <span className="alm-highlight-text">One system. Every lead. Zero chaos.</span>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ──────────────────────────────────── */}
      <section className="alm-section alm-included">
        <div className="alm-container">
          <div className="alm-section-label">What's Included</div>
          <h2 className="alm-section-heading">Three pillars. One price.</h2>

          <div className="alm-pillars">
            <div className="alm-pillar">
              <div className="alm-pillar-num">01</div>
              <div className="alm-pillar-icon">🖥️</div>
              <h3 className="alm-pillar-title">PROXe Platform</h3>
              <ul className="alm-pillar-list">
                <li>Unified inbox — WhatsApp, Telegram, Instagram, Facebook, email in one place</li>
                <li>AI-powered lead scoring and follow-up suggestions</li>
                <li>Custom landing pages built for conversion</li>
                <li>Real-time dashboard — every lead, every stage, every team member</li>
                <li>Automated responses to keep leads warm 24/7</li>
              </ul>
            </div>

            <div className="alm-pillar alm-pillar-featured">
              <div className="alm-pillar-num">02</div>
              <div className="alm-pillar-icon">🎯</div>
              <h3 className="alm-pillar-title">Complete Ad Setup</h3>
              <ul className="alm-pillar-list">
                <li>Meta (Facebook + Instagram) ad campaigns built from scratch</li>
                <li>Google Search and Display campaigns configured</li>
                <li>Ad creatives designed for your target audience</li>
                <li>Audience research, targeting, and pixel setup</li>
                <li>Tracking and attribution — know exactly what's working</li>
              </ul>
            </div>

            <div className="alm-pillar">
              <div className="alm-pillar-num">03</div>
              <div className="alm-pillar-icon">⚙️</div>
              <h3 className="alm-pillar-title">Ongoing Management</h3>
              <ul className="alm-pillar-list">
                <li>Monthly ad optimization — budget, bids, creatives</li>
                <li>Performance reporting every month</li>
                <li>PROXe platform updates and maintenance</li>
                <li>Dedicated account manager</li>
                <li>Continuous A/B testing on landing pages and ads</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESULTS ──────────────────────────────────────────── */}
      <section className="alm-section alm-results">
        <div className="alm-container">
          <div className="alm-section-label">What You Get</div>
          <h2 className="alm-section-heading">Real outcomes. Not promises.</h2>

          <div className="alm-results-grid">
            <div className="alm-result-item">
              <div className="alm-result-icon">✅</div>
              <div>
                <h4>Faster Lead Response</h4>
                <p>AI auto-responds to new leads instantly. No more cold leads from slow manual follow-ups.</p>
              </div>
            </div>
            <div className="alm-result-item">
              <div className="alm-result-icon">✅</div>
              <div>
                <h4>One Inbox, All Channels</h4>
                <p>Your team works from one place. No switching apps. No missed messages.</p>
              </div>
            </div>
            <div className="alm-result-item">
              <div className="alm-result-icon">✅</div>
              <div>
                <h4>Less Manual Work</h4>
                <p>Automated workflows handle follow-up sequences, status updates, and lead routing.</p>
              </div>
            </div>
            <div className="alm-result-item">
              <div className="alm-result-icon">✅</div>
              <div>
                <h4>Full Visibility</h4>
                <p>Management sees pipeline health in real time. Every lead tracked from ad click to closed deal.</p>
              </div>
            </div>
            <div className="alm-result-item">
              <div className="alm-result-icon">✅</div>
              <div>
                <h4>Higher Conversion Rate</h4>
                <p>Better ads, faster follow-up, and optimized landing pages compound into more deals closed.</p>
              </div>
            </div>
            <div className="alm-result-item">
              <div className="alm-result-icon">✅</div>
              <div>
                <h4>You Stay Focused</h4>
                <p>We run the system. You run your business. No hiring, no training, no agency babysitting.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <section className="alm-section alm-pricing" id="pricing">
        <div className="alm-container">
          <div className="alm-section-label">Pricing</div>
          <h2 className="alm-section-heading">One plan. Everything included.</h2>

          <div className="alm-pricing-card">
            <div className="alm-pricing-badge">First 100 Businesses — 50% Off</div>

            <div className="alm-price-row">
              <div className="alm-price-block">
                <span className="alm-price-label">First 3 Months</span>
                <div className="alm-price-main">
                  <span className="alm-price-original">40k</span>
                  <span className="alm-price-current">20k<span className="alm-price-period">/mo</span></span>
                </div>
                <span className="alm-price-note">Save 20k/month for 90 days</span>
              </div>
              <div className="alm-price-arrow">→</div>
              <div className="alm-price-block">
                <span className="alm-price-label">After 3 Months</span>
                <div className="alm-price-main">
                  <span className="alm-price-standard">40k<span className="alm-price-period">/mo</span></span>
                </div>
                <span className="alm-price-note">Standard rate, cancel anytime</span>
              </div>
            </div>

            <div className="alm-pricing-includes">
              <span>PROXe Platform</span>
              <span>+</span>
              <span>Ad Setup</span>
              <span>+</span>
              <span>Management</span>
              <span>+</span>
              <span>No contracts</span>
            </div>

            <button className="alm-cta-btn alm-cta-btn-large" onClick={scrollToForm}>
              Claim Your Spot — Start Now
            </button>

            <p className="alm-pricing-disclaimer">
              Spots are limited. Once 100 businesses are onboarded, this rate closes permanently.
            </p>
          </div>
        </div>
      </section>

      {/* ── LEAD FORM ────────────────────────────────────────── */}
      <section className="alm-section alm-form-section" id="lead-form">
        <div className="alm-container">
          <div className="alm-form-wrapper">
            <div className="alm-form-left">
              <div className="alm-section-label">Get Started</div>
              <h2 className="alm-form-heading">
                Start getting more leads<br />
                <span className="alm-accent">this week.</span>
              </h2>
              <p className="alm-form-sub">
                Fill in your details and we'll reach out within 24 hours to walk you through onboarding. No sales pitch — just a plan.
              </p>
              <div className="alm-form-guarantees">
                <div className="alm-guarantee">⚡ Response within 24 hours</div>
                <div className="alm-guarantee">🔒 Your info is never shared</div>
                <div className="alm-guarantee">🚀 Live in 5–7 business days</div>
              </div>
            </div>

            <div className="alm-form-right">
              <form className="alm-form" onSubmit={handleSubmit} data-form-type="AI Lead Machine">
                <div className="alm-form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`alm-input ${errors.name ? 'alm-input-error' : ''}`}
                  />
                  {errors.name && <span className="alm-error">{errors.name}</span>}
                </div>

                <div className="alm-form-group">
                  <input
                    type="text"
                    name="businessType"
                    placeholder="Business Type (e.g. Real Estate, Clinic, School)"
                    value={formData.businessType}
                    onChange={handleChange}
                    className={`alm-input ${errors.businessType ? 'alm-input-error' : ''}`}
                  />
                  {errors.businessType && <span className="alm-error">{errors.businessType}</span>}
                </div>

                <div className="alm-form-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`alm-input ${errors.phone ? 'alm-input-error' : ''}`}
                  />
                  {errors.phone && <span className="alm-error">{errors.phone}</span>}
                </div>

                <div className="alm-form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className={`alm-input ${errors.email ? 'alm-input-error' : ''}`}
                  />
                  {errors.email && <span className="alm-error">{errors.email}</span>}
                </div>

                <button type="submit" className="alm-submit-btn" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Start Now — Claim 50% Off'}
                </button>

                <p className="alm-form-privacy">
                  By submitting, you agree to our{' '}
                  <a href="/privacy" className="alm-privacy-link">Privacy Policy</a>.
                  No spam, ever.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="alm-section alm-faq">
        <div className="alm-container">
          <div className="alm-section-label">FAQ</div>
          <h2 className="alm-section-heading">Common questions, straight answers.</h2>

          <div className="alm-faq-list">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`alm-faq-item ${openFaq === i ? 'alm-faq-open' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="alm-faq-question">
                  <span>{faq.q}</span>
                  <span className="alm-faq-toggle">{openFaq === i ? '−' : '+'}</span>
                </div>
                {openFaq === i && (
                  <div className="alm-faq-answer">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="alm-section alm-final-cta">
        <div className="alm-container alm-final-cta-inner">
          <h2 className="alm-final-heading">
            Every day without a system<br />
            <span className="alm-accent">is a day of lost leads.</span>
          </h2>
          <p className="alm-final-sub">
            First 100 businesses get 50% off for 3 months. Spots are filling fast.
          </p>
          <button className="alm-cta-btn alm-cta-btn-large" onClick={scrollToForm}>
            Get AI Lead Machine Now
          </button>
          <p className="alm-hero-note">20k/month for first 3 months · No contracts · Cancel anytime</p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="alm-footer">
        <div className="alm-container">
          <p>© {new Date().getFullYear()} BCON Club. All rights reserved.</p>
          <a href="/privacy" className="alm-privacy-link">Privacy Policy</a>
        </div>
      </footer>

    </div>
  );
}
