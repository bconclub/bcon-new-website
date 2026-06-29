'use client';

import { useState, useRef, useEffect } from 'react';
import { getMergedUTMParams } from '@/lib/tracking/utm';
import './page.css';

interface FormData {
  name: string;
  businessType: string;
  phone: string;
  email: string;
}

/* ── Vector icons (no emoji) ─────────────────────────────────── */
const ArrowRight = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="12" x2="20" y2="12" />
    <polyline points="13 5 20 12 13 19" />
  </svg>
);

const IconCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconLayers = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const IconChip = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
  </svg>
);

const IconBolt = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconTarget = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" />
  </svg>
);

const IconClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 16 14" />
  </svg>
);

const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
  </svg>
);

const IconRocket = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 0 0-3 -.2Z" />
    <path d="M12 15 9 12a14 14 0 0 1 7-9c2 0 4 2 4 4a14 14 0 0 1-9 7Z" />
    <path d="M9 12H4s.5-2.8 2-4c1.2-1 3-1 3-1M12 15v5s2.8-.5 4-2c1-1.2 1-3 1-3" />
  </svg>
);

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

const IconChevron = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" />
  </svg>
);

const IconUsers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" /><path d="M16 5.6a3 3 0 0 1 0 5.6M17.5 15c2.2.4 3.5 1.9 3.5 5" />
  </svg>
);

const IconGear = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3.2" /><path d="M12 2.5v2.5M12 19v2.5M3.5 12H6M18 12h2.5M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
  </svg>
);

const IconChartUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 17l5-5 4 4 8-8" /><polyline points="14 8 20 8 20 14" />
  </svg>
);

/* ── Brand logos (uniform 24×24 viewBox) ─────────────────────── */
const BrandMeta = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id="almMetaG" x1="0" y1="12" x2="24" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#0064E1" />
        <stop offset="1" stopColor="#0098FF" />
      </linearGradient>
    </defs>
    <path fill="url(#almMetaG)" d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.799 44.799 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.219-2.602zm-10.201.553c.946 0 1.952.685 2.96 1.668.582.568 1.157 1.282 1.762 2.087l-1.857 2.829c-1.296 1.962-1.819 2.601-2.502 3.394-.715.825-1.305 1.135-2.075 1.135-.794 0-1.642-.391-2.18-1.205-.555-.84-.866-2.117-.866-3.355 0-2.677.738-4.86 2.044-6.211.503-.52 1.024-.745 1.715-.745z" />
  </svg>
);
const BrandGoogle = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23 12.27c0-.79-.07-1.54-.2-2.27H12v4.5h6.19c-.27 1.4-1.08 2.59-2.3 3.39v2.82h3.72C21.78 18.74 23 15.77 23 12.27z" />
    <path fill="#34A853" d="M12 24c3.11 0 5.72-1.03 7.62-2.79l-3.72-2.82c-1.03.69-2.35 1.1-3.9 1.1-3 0-5.54-2.03-6.45-4.75H1.7v2.91C3.59 21.42 7.49 24 12 24z" />
    <path fill="#FBBC05" d="M5.55 14.74c-.23-.69-.36-1.43-.36-2.19s.13-1.5.36-2.19V7.45H1.7A11.97 11.97 0 0 0 .43 12c0 1.94.46 3.77 1.27 5.39l3.85-2.65z" />
    <path fill="#EA4335" d="M12 4.75c1.69 0 3.21.58 4.4 1.72l3.3-3.3C17.71 1.18 15.1 0 12 0 7.49 0 3.59 2.58 1.7 6.4l3.85 2.91C6.46 6.78 9 4.75 12 4.75z" />
  </svg>
);
const BrandFacebook = () => (
  <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
    <path d="M13.4 21v-7.3h2.45l.37-2.85H13.4V9.03c0-.83.23-1.39 1.42-1.39h1.5V5.1c-.26-.04-1.16-.11-2.2-.11-2.18 0-3.67 1.33-3.67 3.77v2.08H7.99v2.85h2.46V21h2.95z" />
  </svg>
);
const BrandInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="1.1" fill="#fff" stroke="none" />
  </svg>
);
const BrandMessenger = () => (
  <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
    <path d="M12 2C6.4 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.19.16.15.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.99-.88c.17-.07.36-.09.53-.04 1 .28 2.06.42 3.16.42 5.6 0 10-4.13 10-9.7S17.6 2 12 2zm6 7.46l-2.94 4.66c-.47.74-1.46.93-2.17.41l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.94-4.66c.47-.74 1.46-.93 2.17-.41l2.34 1.75c.21.16.51.16.72 0l3.16-2.4c.42-.32.97.18.69.63z" />
  </svg>
);
const BrandGoogleAds = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="9.6" y="3" width="4.8" height="18" rx="2.4" transform="rotate(-24 12 4.5)" fill="#FBBC04" />
    <rect x="9.6" y="3" width="4.8" height="18" rx="2.4" transform="rotate(24 12 4.5)" fill="#4285F4" />
    <circle cx="6.3" cy="18.3" r="2.9" fill="#34A853" />
  </svg>
);

const faqs = [
  {
    q: "What's actually included for the price?",
    a: 'Everything, end to end. We make the content (ads, videos, copy), we build and run the campaigns across Meta and Google, and our AI Lead Machine answers, qualifies, and nurtures every lead across WhatsApp, Instagram, and Facebook. No piecemeal add-ons, no hidden fees. One price, the whole machine.'
  },
  {
    q: 'How fast can we go live?',
    a: 'Onboarding takes 5 to 7 business days. We map your buyers, build your creatives, set up your campaigns, and connect your inboxes. You start receiving qualified leads within the first week.'
  },
  {
    q: 'What happens after the first 2 months?',
    a: 'After the 2 month introductory period at ₹40K/month, the service continues at the standard ₹80K/month rate. No contract, cancel anytime before the period ends with no penalty.'
  },
  {
    q: 'We already run ads. Can we still use this?',
    a: 'Yes. We either migrate your existing campaigns into our managed system or run fresh ones alongside them. Either way you get the full content engine, ad management, and AI lead follow-up from day one.'
  },
  {
    q: 'What kind of businesses is this for?',
    a: 'Any service business where follow-up speed and organization decide whether deals close. Real estate, education, clinics, professional services, retail, hospitality. If leads come in across multiple channels and slip through the cracks, this is built for you.'
  },
  {
    q: 'Is there a contract?',
    a: 'No long-term lock in. Billing is monthly. We keep your business with results, not contracts.'
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
  // Hero "Get a Call Back" quick form (name + phone -> AI Lead Machine / PROXe)
  const [cbName, setCbName] = useState('');
  const [cbPhone, setCbPhone] = useState('');
  const [cbDone, setCbDone] = useState(false);
  const [cbErr, setCbErr] = useState('');
  const [vslPlaying, setVslPlaying] = useState(false);
  const vslRef = useRef<HTMLVideoElement>(null);

  // Reveal hero bullets (and other [data-reveal] elements) as they enter view
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('alm-in');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const playVsl = () => {
    setVslPlaying(true);
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: 'vsl_play', page: 'lead-machine' });
    }
    setTimeout(() => vslRef.current?.play().catch(() => {}), 50);
  };

  // When the video ends, reset to the start and show the play button again.
  const handleVslEnded = () => {
    setVslPlaying(false);
    if (vslRef.current) vslRef.current.currentTime = 0;
  };

  // When paused (by the user), bring the play button back over the frame.
  const handleVslPause = () => {
    setVslPlaying(false);
  };

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

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Hero quick "Get a Call Back" — sends name + phone to PROXe as an
  // AI Lead Machine lead so the AI can start the WhatsApp conversation.
  const handleCallback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cbName.trim()) { setCbErr('Please enter your name'); return; }
    const cbPhoneDigits = cbPhone.replace(/\D/g, '').slice(-10);
    if (cbPhoneDigits.length !== 10) { setCbErr('Please enter a valid 10 digit phone number'); return; }
    const callbackPhone = `+91${cbPhoneDigits}`;
    setCbErr('');

    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'web_lead',
        formType: 'AI Lead Machine Callback',
        service: 'ai-lead-machine',
      });
    }

    // Reuse the PROXe submission (brand falls back to the lead's name).
    submitToPROXe({ name: cbName.trim(), businessType: '', phone: callbackPhone, email: '' });

    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'lead',
        data: { name: cbName.trim(), phone: callbackPhone, service: 'AI Lead Machine - Call Back' },
      }),
    }).catch((err) => console.error('Email notification failed:', err));

    setCbDone(true);
  };

  return (
    <div className="alm-page">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="alm-hero">
        <div className="alm-hero-badge">LIMITED · First 100 Businesses Only</div>

        <h1 className="alm-hero-headline">
          <span className="alm-h-1">We will build you a <span className="alm-accent">lead machine</span></span>
          <span className="alm-h-2">which gets your customers.</span>
        </h1>

        <div className="alm-hero-vsl">
          <div className={`alm-vsl-frame ${vslPlaying ? 'alm-vsl-playing' : ''}`}>
            <video
              ref={vslRef}
              className="alm-vsl-video"
              src="/assets/AI-Lead-Machine-VSL.mp4"
              controls={vslPlaying}
              playsInline
              preload="metadata"
              onEnded={handleVslEnded}
              onPause={handleVslPause}
            />
            {!vslPlaying && (
              <button className="alm-vsl-overlay" onClick={playVsl} aria-label="Play video">
                <span className="alm-vsl-play">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>

        <p className="alm-hero-sub">
          You don't need more tools. You don't need to hire. You don't need to learn ads.
          We make the content, run the campaigns, and chase every lead until they're ready to buy.
        </p>

        <div className="alm-hero-bullets">
          <div className="alm-hero-bullet" data-reveal>
            <span className="alm-bullet-check"><IconCheck /></span>
            <span>You get the ads made for you, so you don't touch a thing</span>
          </div>
          <div className="alm-hero-bullet" data-reveal>
            <span className="alm-bullet-check"><IconCheck /></span>
            <span>You get them launched and managed for you, so you don't waste a rupee</span>
          </div>
          <div className="alm-hero-bullet" data-reveal>
            <span className="alm-bullet-check"><IconCheck /></span>
            <span>You get every lead answered in seconds, 24/7, so none go cold</span>
          </div>
          <div className="alm-hero-bullet" data-reveal>
            <span className="alm-bullet-check"><IconCheck /></span>
            <span>You get only the ready-to-buy ones, so you stop wasting time on tyre-kickers</span>
          </div>
        </div>

        {cbDone ? (
          <div className="alm-callback-done">
            <span className="alm-callback-done-icon"><IconCheck /></span>
            Got it{cbName ? `, ${cbName.split(' ')[0]}` : ''}! Our AI Lead Machine will reach out on WhatsApp shortly.
          </div>
        ) : (
          <form className="alm-callback" onSubmit={handleCallback}>
            <div className="alm-callback-row">
              <input
                type="text"
                placeholder="Your name"
                value={cbName}
                onChange={(e) => { setCbName(e.target.value); if (cbErr) setCbErr(''); }}
                className="alm-callback-input"
                aria-label="Your name"
              />
              <label className="alm-callback-phone" aria-label="Phone number">
                <span className="alm-callback-code">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Phone number"
                  value={cbPhone}
                  onChange={(e) => { setCbPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); if (cbErr) setCbErr(''); }}
                  className="alm-callback-input alm-callback-phone-input"
                />
              </label>
              <button type="submit" className="alm-cta-btn alm-callback-btn">
                Get a Call Back <ArrowRight className="alm-cta-arrow" />
              </button>
            </div>
            {cbErr && <span className="alm-callback-err">{cbErr}</span>}
          </form>
        )}

        <p className="alm-hero-note">First 100 businesses get 50% off. After that it's gone.</p>
      </section>

      {/* ── SECTION 1 — WHAT YOU'RE GETTING ──────────────────── */}
      <section className="alm-section alm-getting">
        <div className="alm-container alm-getting-container">
          <div className="alm-section-label alm-center">What You're Actually Getting</div>
          <h2 className="alm-section-heading alm-center">
            One System.<br /><span className="alm-accent">All Done For You.</span>
          </h2>
          <p className="alm-getting-intro alm-center">
            Most people sell you a piece. A tool. A course. An ad guy. You end up stitching it together yourself.
            We don't do pieces. We do the whole thing.
          </p>

          <div className="alm-getting-grid">

            {/* Column 01 — We Make the Content */}
            <div className="alm-getting-col">
              <div className="alm-getting-num">01</div>
              <h3 className="alm-getting-col-title">We Make the Content</h3>
              <p className="alm-getting-sub">Scroll-stopping ads and reels that make people stop, watch, and want.</p>

              <div className="alm-card alm-card-bento">
                <div className="alm-bento">
                  {[
                    '/portfolio/thumbnails/Campa Cola AI Ad.webp',
                    '/portfolio/thumbnails/LS Swap Thumbnail.webp',
                    '/portfolio/thumbnails/Comet AI Ad.webp',
                    '/portfolio/Come-to-Dubai.webp',
                    '/portfolio/thumbnails/That AI Thumbnail.webp',
                    '/portfolio/Laptopstore-Product-Ad.jpg',
                    '/portfolio/thumbnails/Organix Rosa Move In.webp',
                    '/portfolio/11PC-Launch.jpg',
                    '/portfolio/WC-Event.jpg',
                  ].map((src, i) => (
                    <div key={i} className="alm-btile">
                      <img src={encodeURI(src)} alt="" loading="lazy" />
                      <span className="alm-btile-play">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 02 — We Run the Campaigns */}
            <div className="alm-getting-col">
              <div className="alm-getting-num">02</div>
              <h3 className="alm-getting-col-title">We Run the Campaigns</h3>
              <p className="alm-getting-sub">We build and run your full Meta and Google ad system, start to finish.</p>

              <div className="alm-card alm-camp">
                <div className="alm-camp-top">
                  <span className="alm-camp-plat alm-plat-white"><BrandMeta /></span>
                  <span className="alm-camp-plat alm-plat-white"><BrandGoogle /></span>
                </div>

                <div className="alm-camp-panels">
                  <div className="alm-camp-card alm-camp-setup">
                    <div className="alm-camp-ptitle">Campaign Setup</div>
                    <div className="alm-camp-field">
                      <span className="alm-camp-flabel">Objective</span>
                      <div className="alm-camp-select">Leads <IconChevron /></div>
                    </div>
                    <div className="alm-camp-field">
                      <span className="alm-camp-flabel">Audience</span>
                      <div className="alm-camp-aud">
                        <span className="alm-camp-avatars"><i /><i /><i /><i /></span>
                        <span className="alm-camp-aud-count">+2.4K</span>
                      </div>
                    </div>
                    <div className="alm-camp-field">
                      <span className="alm-camp-flabel">Budget</span>
                      <div className="alm-camp-budget">
                        <span>$50 / day</span>
                        <span className="alm-camp-toggle"><i /></span>
                      </div>
                    </div>
                    <button className="alm-camp-launch"><IconRocket /> Launch Campaign</button>
                  </div>

                  <div className="alm-camp-card alm-camp-live">
                    <div className="alm-camp-ptitle">Live Performance</div>
                    <div className="alm-camp-leads">
                      <span className="alm-camp-flabel">Leads (30 Days)</span>
                      <span className="alm-camp-leads-row"><b>1,247</b><i className="up">▲ 26%</i></span>
                    </div>
                    <svg className="alm-camp-chart" viewBox="0 0 200 80" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="campFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#CDFC2E" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#CDFC2E" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,66 L28,60 L52,62 L82,46 L110,50 L138,30 L168,26 L200,10 L200,80 L0,80 Z" fill="url(#campFill)" />
                      <path d="M0,66 L28,60 L52,62 L82,46 L110,50 L138,30 L168,26 L200,10" fill="none" stroke="#CDFC2E" strokeWidth="2" />
                    </svg>
                    <div className="alm-camp-metrics">
                      <div><span className="alm-camp-flabel">CPL</span><b>$6.21</b></div>
                      <div><span className="alm-camp-flabel">ROAS</span><b>4.6x</b></div>
                    </div>
                  </div>
                </div>

                <div className="alm-camp-dist">
                  <div className="alm-camp-dist-label">Ad Distribution</div>
                  <svg className="alm-camp-dist-lines" viewBox="0 0 300 28" preserveAspectRatio="none">
                    <path d="M150 0 C150 14 85 12 85 26" />
                    <path d="M150 0 C150 14 128 14 128 26" />
                    <path d="M150 0 C150 14 172 14 172 26" />
                    <path d="M150 0 C150 14 215 12 215 26" />
                  </svg>
                  <div className="alm-camp-dist-icons">
                    <span className="alm-dicon" style={{ background: '#1877F2' }}><BrandFacebook /></span>
                    <span className="alm-dicon" style={{ background: 'linear-gradient(135deg,#FEDA75,#D62976,#962FBF)' }}><BrandInstagram /></span>
                    <span className="alm-dicon" style={{ background: 'linear-gradient(135deg,#00B2FF,#006AFF)' }}><BrandMessenger /></span>
                    <span className="alm-dicon alm-plat-white"><BrandGoogleAds /></span>
                  </div>
                </div>

                <div className="alm-camp-steps">
                  <div className="alm-camp-step"><IconSearch /><span>Research</span></div>
                  <div className="alm-camp-step"><IconUsers /><span>Target</span></div>
                  <div className="alm-camp-step"><IconGear /><span>Build</span></div>
                  <div className="alm-camp-step"><IconRocket /><span>Launch</span></div>
                  <div className="alm-camp-step"><IconChartUp /><span>Optimize</span></div>
                </div>
              </div>
            </div>

            {/* Column 03 — We Manage Every Lead */}
            <div className="alm-getting-col">
              <div className="alm-getting-num">03</div>
              <h3 className="alm-getting-col-title">We Manage Every Lead</h3>
              <p className="alm-getting-sub">Every lead answered, qualified, and followed up until they're ready.</p>

              <div className="alm-card alm-manage3">
                {/* iPhone WhatsApp automation */}
                <div className="alm-iphone">
                  <div className="alm-iphone-island" />
                  <div className="alm-wa-head">
                    <span className="alm-wa-avatar">AI</span>
                    <span className="alm-wa-name">AI Lead Machine<i>online</i></span>
                  </div>
                  <div className="alm-wa-chat">
                    <div className="alm-wa-msg in"><p>Hi! Is the 3 BHK in Whitefield still available?</p><time>6:12</time></div>
                    <div className="alm-wa-msg out"><p>Yes! 3 options match. Take a look:</p><time>6:12 ✓✓</time></div>
                    <div className="alm-wa-msg out alm-wa-props">
                      <div className="alm-wa-carousel">
                        {[
                          { img: '/unsplash/property-1-apt-61b07816.jpg', name: 'Prestige Lakeside', meta: '3 BHK · ₹1.45 Cr' },
                          { img: '/unsplash/property-2-tower-dd8c05e3.jpg', name: 'Brigade Cosmopolis', meta: '3 BHK · ₹1.30 Cr' },
                          { img: '/unsplash/property-3-villa-78b9dba3.jpg', name: 'Sobha Dream Acres', meta: '3 BHK · ₹98 L' },
                        ].map((p, i) => (
                          <div key={i} className="alm-wa-prop">
                            <img className="alm-wa-prop-img" src={p.img} alt="" loading="lazy" />
                            <div className="alm-wa-prop-body">
                              <span className="alm-wa-prop-name">{p.name}</span>
                              <span className="alm-wa-prop-meta">{p.meta}</span>
                              <span className="alm-wa-prop-loc">Available · Whitefield</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <time>6:12 ✓✓</time>
                    </div>
                    <div className="alm-wa-msg in"><p>Love the first one. Can I visit this weekend?</p><time>6:14</time></div>
                    <div className="alm-wa-msg out"><p>Booked! Site visit Sat, 11 AM.</p><time>6:14 ✓✓</time></div>
                  </div>
                  <div className="alm-wa-input">
                    <span>Type a message</span>
                    <span className="alm-wa-send"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg></span>
                  </div>
                  <div className="alm-iphone-home" />
                </div>

                {/* Pipeline + site visits */}
                <div className="alm-manage3-right">
                  <div className="alm-pipe">
                    <div className="alm-pipe-title">Lead Pipeline</div>
                    {[
                      { stage: 'New Lead', count: 127, color: '#22C55E' },
                      { stage: 'Contacted', count: 94, color: '#FFB020' },
                      { stage: 'Qualified', count: 61, color: '#3B9EFF' },
                      { stage: 'Booked', count: 23, color: '#A855F7' },
                      { stage: 'Won', count: 11, color: '#CDFC2E' },
                    ].map((r, i) => (
                      <div key={i} className="alm-pipe-row">
                        <span className="alm-pipe-icon" style={{ background: r.color }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </span>
                        <span className="alm-pipe-stage">{r.stage}</span>
                        <span className="alm-pipe-count">{r.count}</span>
                      </div>
                    ))}
                  </div>

                  <div className="alm-visits">
                    <span className="alm-visits-label">Site Visits Booked</span>
                    <span className="alm-visits-row"><b>23</b><i>+15%</i></span>
                    <svg className="alm-visits-chart" viewBox="0 0 120 36" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="almVisitsG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#CDFC2E" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#CDFC2E" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,30 L20,26 L40,28 L60,18 L80,20 L100,10 L120,6 L120,36 L0,36 Z" fill="url(#almVisitsG)" />
                      <path d="M0,30 L20,26 L40,28 L60,18 L80,20 L100,10 L120,6" fill="none" stroke="#CDFC2E" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <p className="alm-getting-closer alm-center">
            From the first ad they see to the lead in your hand. <span className="alm-accent">The whole chain. Done for you.</span>
          </p>
          <button className="alm-cta-btn alm-getting-cta" onClick={scrollToPricing}>
            Get 50% Off <ArrowRight className="alm-cta-arrow" />
          </button>
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
            <div className="alm-step-arrow"><ArrowRight /></div>
            <div className="alm-step">
              <div className="alm-step-num">2</div>
              <div className="alm-step-body">
                <h3>We Launch and Manage</h3>
                <p>Ads go live. Every inquiry lands in one place. We watch it, test it, and keep it running.</p>
              </div>
            </div>
            <div className="alm-step-arrow"><ArrowRight /></div>
            <div className="alm-step">
              <div className="alm-step-num">3</div>
              <div className="alm-step-body">
                <h3>You Get Ready Buyers</h3>
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
              <span className="alm-problem-x"><IconClose /></span>
              <p>They come in across six different apps and half go cold before anyone replies</p>
            </div>
            <div className="alm-problem-row">
              <span className="alm-problem-x"><IconClose /></span>
              <p>You spend on ads, but there's no system to follow up, so the money burns</p>
            </div>
            <div className="alm-problem-row">
              <span className="alm-problem-x"><IconClose /></span>
              <p>Your team is busy chasing, not closing</p>
            </div>
            <div className="alm-problem-row">
              <span className="alm-problem-x"><IconClose /></span>
              <p>Nobody can see what's working, so you keep guessing</p>
            </div>
          </div>

          <p className="alm-problem-closer">
            The AI Lead Machine is that system. <span className="alm-accent">It runs the whole chain for you.</span>
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
              <div className="alm-why-icon"><IconLayers /></div>
              <p>Everything done for you: content, ads, follow-up. No gaps to fill.</p>
            </div>
            <div className="alm-why-card">
              <div className="alm-why-icon"><IconChip /></div>
              <p>Like a Tesla needs no driver, PROXe needs no operator. Your lead engine just runs, day and night.</p>
            </div>
            <div className="alm-why-card">
              <div className="alm-why-icon"><IconBolt /></div>
              <p>Human strategy plus AI speed. The thinking and the doing, handled.</p>
            </div>
            <div className="alm-why-card">
              <div className="alm-why-icon"><IconTarget /></div>
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
              <div className="alm-result-icon"><IconCheck /></div>
              <div><h4>More qualified leads, less wasted ad spend</h4></div>
            </div>
            <div className="alm-result-item">
              <div className="alm-result-icon"><IconCheck /></div>
              <div><h4>Every inquiry answered in seconds, 24/7</h4></div>
            </div>
            <div className="alm-result-item">
              <div className="alm-result-icon"><IconCheck /></div>
              <div><h4>One inbox for every channel, nothing slips</h4></div>
            </div>
            <div className="alm-result-item">
              <div className="alm-result-icon"><IconCheck /></div>
              <div><h4>Only ready-to-buy leads reach your team</h4></div>
            </div>
            <div className="alm-result-item">
              <div className="alm-result-icon"><IconCheck /></div>
              <div><h4>Full visibility, from ad click to closed deal</h4></div>
            </div>
            <div className="alm-result-item">
              <div className="alm-result-icon"><IconCheck /></div>
              <div><h4>Your time back, you stop being the follow-up guy</h4></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7 — PRICING ──────────────────────────────── */}
      <section className="alm-section alm-pricing" id="pricing">
        <div className="alm-container">
          <div className="alm-section-label">Pricing</div>
          <h2 className="alm-section-heading">One Plan. Everything In It.</h2>

          <div className="alm-pricing-card">
            <div className="alm-pricing-badge">First 100 Businesses · 50% Off</div>

            <div className="alm-price-row">
              <div className="alm-price-block">
                <span className="alm-price-label">First 2 Months</span>
                <div className="alm-price-main">
                  <span className="alm-price-original">₹80K</span>
                  <span className="alm-price-current">₹40K<span className="alm-price-period">/mo</span></span>
                </div>
                <span className="alm-price-note">Save ₹40K/month for 60 days</span>
              </div>
              <div className="alm-price-arrow"><ArrowRight /></div>
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
              Get 50% Off <ArrowRight className="alm-cta-arrow" />
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
                Fill in your details and we'll reach out within 24 hours to walk you through onboarding. No sales pitch, just a plan.
              </p>
              <div className="alm-form-guarantees">
                <div className="alm-guarantee"><span className="alm-guarantee-icon"><IconClock /></span> Response within 24 hours</div>
                <div className="alm-guarantee"><span className="alm-guarantee-icon"><IconShield /></span> Your info is never shared</div>
                <div className="alm-guarantee"><span className="alm-guarantee-icon"><IconRocket /></span> Live in 5 to 7 business days</div>
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
                  {submitting ? 'Submitting...' : (<>Claim Your 50% Off <ArrowRight className="alm-cta-arrow" /></>)}
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
            Get AI Lead Machine Now <ArrowRight className="alm-cta-arrow" />
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
