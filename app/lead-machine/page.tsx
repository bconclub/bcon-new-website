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
    q: "What's actually included for the price?",
    a: 'Everything, end to end. We make the content (ads, videos, copy), we build and run the campaigns across Meta and Google, and our AI Lead Machine answers, qualifies, and nurtures every lead across WhatsApp, Instagram, and Facebook. No piecemeal add-ons, no hidden fees. One price, the whole machine.'
  },
  {
    q: 'How fast can we go live?',
    a: 'Onboarding takes 5–7 business days. We map your buyers, build your creatives, set up your campaigns, and connect your inboxes. You start receiving qualified leads within the first week.'
  },
  {
    q: 'What happens after the first 2 months?',
    a: 'After the 2-month introductory period at ₹40K/month, the service continues at the standard ₹80K/month rate. No contract, cancel anytime before the period ends with no penalty.'
  },
  {
    q: 'We already run ads. Can we still use this?',
    a: 'Yes. We either migrate your existing campaigns into our managed system or run fresh ones alongside them. Either way you get the full content engine, ad management, and AI lead follow-up from day one.'
  },
  {
    q: 'What kind of businesses is this for?',
    a: 'Any service business where follow-up speed and organization decide whether deals close — real estate, education, clinics, professional services, retail, hospitality. If leads come in across multiple channels and slip through the cracks, this is built for you.'
  },
  {
    q: 'Is there a contract?',
    a: 'No long-term lock-in. Billing is monthly. We keep your business with results, not contracts.'
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
          brand: formData.businessType?.trim() || formData.name?.trim() || 'Lead Machine Lead',
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
      const params = new URLSearchParams({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        brandName: formData.businessType,
        service: 'ai-lead-machine',
      });
      window.location.href = `/thank-you?${params.toString()}`;
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
          We'll Build You an <span className="alm-accent">AI Lead Machine</span> That Gets You Customers. You Don't Lift a Finger.
        </h1>

        <p className="alm-hero-sub">
          You don't need more tools. You don't need to hire. You don't need to learn ads.
          We make the content, run the campaigns, and chase every lead until they're ready to buy.
          You just show up and close.
        </p>

        <div className="alm-hero-bullets">
          <div className="alm-hero-bullet">
            <span className="alm-bullet-check">✓</span>
            <span>You get the ads made for you, so you don't touch a thing</span>
          </div>
          <div className="alm-hero-bullet">
            <span className="alm-bullet-check">✓</span>
            <span>You get them launched and managed for you, so you don't waste a rupee</span>
          </div>
          <div className="alm-hero-bullet">
            <span className="alm-bullet-check">✓</span>
            <span>You get every lead answered in seconds, 24/7, so none go cold</span>
          </div>
          <div className="alm-hero-bullet">
            <span className="alm-bullet-check">✓</span>
            <span>You get only the ready-to-buy ones, so you stop wasting time on tyre-kickers</span>
          </div>
        </div>

        <button className="alm-cta-btn alm-cta-btn-large" onClick={scrollToForm}>
          Get the AI Lead Machine — Start Now
        </button>

        <p className="alm-hero-note">First 100 businesses get 50% off. After that it's gone.</p>
      </section>

      {/* ── SECTION 1 — WHAT YOU'RE GETTING ──────────────────── */}
      <section className="alm-section alm-getting">
        <div className="alm-container">
          <div className="alm-section-label">What You're Actually Getting</div>
          <h2 className="alm-section-heading">
            One System. Three Jobs.<br /><span className="alm-accent">All Done For You.</span>
          </h2>
          <p className="alm-getting-intro">
            Most people sell you a piece. A tool. A course. An ad guy. You end up stitching it together yourself.
            We don't do pieces. We do the whole thing.
          </p>

          <div className="alm-getting-grid">
            <div className="alm-getting-block">
              <div className="alm-getting-num">01</div>
              <h3>We Make the Content</h3>
              <p>Scroll-stopping ads, videos, and copy. Made by us. You approve, we ship. You never stare at a blank screen.</p>
            </div>
            <div className="alm-getting-block">
              <div className="alm-getting-num">02</div>
              <h3>We Run the Campaigns</h3>
              <p>Audience research, targeting, the full Meta and Google build, launched and managed by us. You never log into an ad account.</p>
            </div>
            <div className="alm-getting-block">
              <div className="alm-getting-num">03</div>
              <h3>We Manage Every Lead</h3>
              <p>Every inquiry across WhatsApp, Instagram, and Facebook gets answered in seconds, qualified, and chased until they're ready. You never lose a lead to slow follow-up again.</p>
            </div>
          </div>

          <p className="alm-getting-closer">
            From the first ad they see to the lead in your hand. <span className="alm-accent">The whole chain. Done for you.</span>
          </p>
        </div>
      </section>

      {/* ── SECTION 2 — HOW IT WORKS ─────────────────────────── */}
      <section className="alm-section alm-how">
        <div className="alm-container">
          <div className="alm-section-label">How It Works</div>
          <h2 className="alm-section-heading">Three Steps. Live in Days.</h2>

          <div className="alm-steps">
            <div className="alm-step">
              <div className="alm-step-num">1</div>
              <div className="alm-step-body">
                <h3>We Build</h3>
                <p>We map your buyers, make the content, and set up your campaigns from scratch. You do nothing but approve.</p>
              </div>
            </div>
            <div className="alm-step-connector" />
            <div className="alm-step">
              <div className="alm-step-num">2</div>
              <div className="alm-step-body">
                <h3>We Launch and Manage</h3>
                <p>Ads go live. Every inquiry lands in one place. We watch it, test it, and keep it running.</p>
              </div>
            </div>
            <div className="alm-step-connector" />
            <div className="alm-step">
              <div className="alm-step-num">3</div>
              <div className="alm-step-body">
                <h3>You Get Hot Leads</h3>
                <p>Our AI Lead Machine answers, qualifies, and nurtures every lead. You only talk to people ready to buy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — THE PROBLEM ──────────────────────────── */}
      <section className="alm-section alm-problem">
        <div className="alm-container">
          <div className="alm-section-label">The Problem</div>
          <h2 className="alm-section-heading">
            You Don't Have a Lead Problem.<br /><span className="alm-accent">You Have a System Problem.</span>
          </h2>
          <p className="alm-problem-intro">
            The leads are out there. You're just losing them before they ever reach you.
          </p>

          <div className="alm-problem-list">
            <div className="alm-problem-row">
              <span className="alm-problem-x">✕</span>
              <p>They come in across six different apps and half go cold before anyone replies</p>
            </div>
            <div className="alm-problem-row">
              <span className="alm-problem-x">✕</span>
              <p>You spend on ads, but there's no system to follow up, so the money burns</p>
            </div>
            <div className="alm-problem-row">
              <span className="alm-problem-x">✕</span>
              <p>Your team is busy chasing, not closing</p>
            </div>
            <div className="alm-problem-row">
              <span className="alm-problem-x">✕</span>
              <p>Nobody can see what's working, so you keep guessing</p>
            </div>
          </div>

          <p className="alm-problem-closer">
            The AI Lead Machine fixes the whole chain. <span className="alm-accent">Not one piece of it.</span>
          </p>
        </div>
      </section>

      {/* ── SECTION 4 — WHY THIS IS DIFFERENT ────────────────── */}
      <section className="alm-section alm-why">
        <div className="alm-container">
          <div className="alm-section-label">Why This Isn't Like Anything Else</div>
          <h2 className="alm-section-heading">
            Not a Tool. Not Another Agency.<br />
            An AI Lead Machine <span className="alm-accent">You Own the Results Of.</span>
          </h2>

          <div className="alm-why-grid">
            <div className="alm-why-card">
              <div className="alm-why-icon">🧩</div>
              <p>Everything done for you: content, ads, follow-up. No gaps to fill.</p>
            </div>
            <div className="alm-why-card">
              <div className="alm-why-icon">🤖</div>
              <p>Powered by PROXe, our AI lead engine that never sleeps and never forgets.</p>
            </div>
            <div className="alm-why-card">
              <div className="alm-why-icon">⚡</div>
              <p>Human strategy plus AI speed. The thinking and the doing, handled.</p>
            </div>
            <div className="alm-why-card">
              <div className="alm-why-icon">🎯</div>
              <p>You run your business. We run the machine.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — WHAT YOU GET ─────────────────────────── */}
      <section className="alm-section alm-results">
        <div className="alm-container">
          <div className="alm-section-label">What You Get</div>
          <h2 className="alm-section-heading">Here's What Changes the Day You Turn It On.</h2>

          <div className="alm-results-grid">
            <div className="alm-result-item">
              <div className="alm-result-icon">✅</div>
              <div><h4>More qualified leads, less wasted ad spend</h4></div>
            </div>
            <div className="alm-result-item">
              <div className="alm-result-icon">✅</div>
              <div><h4>Every inquiry answered in seconds, 24/7</h4></div>
            </div>
            <div className="alm-result-item">
              <div className="alm-result-icon">✅</div>
              <div><h4>One inbox for every channel, nothing slips</h4></div>
            </div>
            <div className="alm-result-item">
              <div className="alm-result-icon">✅</div>
              <div><h4>Only ready-to-buy leads reach your team</h4></div>
            </div>
            <div className="alm-result-item">
              <div className="alm-result-icon">✅</div>
              <div><h4>Full visibility, from ad click to closed deal</h4></div>
            </div>
            <div className="alm-result-item">
              <div className="alm-result-icon">✅</div>
              <div><h4>Your time back, you stop being the follow-up guy</h4></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6 — PROOF ────────────────────────────────── */}
      <section className="alm-section alm-proof">
        <div className="alm-container">
          <div className="alm-section-label">Proof</div>
          <h2 className="alm-section-heading">Don't Take Our Word For It.</h2>

          <div className="alm-proof-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="alm-proof-card alm-proof-placeholder">
                <div className="alm-proof-tag">Case Study {i}</div>
                <div className="alm-proof-stage">
                  <span className="alm-proof-stage-label">Starting Point</span>
                  <p>—</p>
                </div>
                <div className="alm-proof-stage">
                  <span className="alm-proof-stage-label">What the AI Lead Machine Did</span>
                  <p>—</p>
                </div>
                <div className="alm-proof-stage">
                  <span className="alm-proof-stage-label">Result</span>
                  <p>—</p>
                </div>
                <div className="alm-proof-soon">Coming Soon</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7 — PRICING ──────────────────────────────── */}
      <section className="alm-section alm-pricing" id="pricing">
        <div className="alm-container">
          <div className="alm-section-label">Pricing</div>
          <h2 className="alm-section-heading">One Plan. Everything In It.</h2>

          <div className="alm-pricing-card">
            <div className="alm-pricing-badge">First 100 Businesses — 50% Off</div>

            <div className="alm-price-row">
              <div className="alm-price-block">
                <span className="alm-price-label">First 2 Months</span>
                <div className="alm-price-main">
                  <span className="alm-price-original">₹80K</span>
                  <span className="alm-price-current">₹40K<span className="alm-price-period">/mo</span></span>
                </div>
                <span className="alm-price-note">Save ₹40K/month for 60 days</span>
              </div>
              <div className="alm-price-arrow">→</div>
              <div className="alm-price-block">
                <span className="alm-price-label">After 2 Months</span>
                <div className="alm-price-main">
                  <span className="alm-price-standard">₹80K<span className="alm-price-period">/mo</span></span>
                </div>
                <span className="alm-price-note">Standard rate, cancel anytime</span>
              </div>
            </div>

            <div className="alm-pricing-includes">
              <span>Content</span>
              <span>+</span>
              <span>Campaigns</span>
              <span>+</span>
              <span>Lead Management</span>
              <span>+</span>
              <span>No contracts</span>
            </div>

            <button className="alm-cta-btn alm-cta-btn-large" onClick={scrollToForm}>
              Claim Your Spot — Start Now
            </button>

            <p className="alm-pricing-disclaimer">
              Once 100 businesses are in, this rate closes for good.
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

      {/* ── SECTION 8 — FAQ ──────────────────────────────────── */}
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

      {/* ── SECTION 9 — FINAL CTA ────────────────────────────── */}
      <section className="alm-section alm-final-cta">
        <div className="alm-container alm-final-cta-inner">
          <h2 className="alm-final-heading">
            Every Day Without the AI Lead Machine Is a Day of<br />
            <span className="alm-accent">Customers Going to Someone Else.</span>
          </h2>
          <p className="alm-final-sub">
            First 100 businesses get 50% off for 2 months. Spots are filling.
          </p>
          <button className="alm-cta-btn alm-cta-btn-large" onClick={scrollToForm}>
            Get AI Lead Machine Now
          </button>
          <p className="alm-hero-note">₹40K/mo for first 2 months · No contracts · Cancel anytime</p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="alm-footer">
        <div className="alm-container">
          <p>© 2026 BCON Club. All rights reserved.</p>
          <a href="/privacy" className="alm-privacy-link">Privacy Policy</a>
        </div>
      </footer>

    </div>
  );
}
