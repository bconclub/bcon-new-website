'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMergedUTMParams } from '@/lib/tracking/utm';
import './ContactSection.css';

interface FormData {
  name: string;
  brandName: string;
  phone: string;
  email: string;
  service: string;
  industry?: string;
  appType?: string;
  estimatedMinPrice?: string;
  estimatedMaxPrice?: string;
}

interface ContactSectionProps {
  onInternalLinkClick?: () => void;
}

export default function ContactSection({ onInternalLinkClick }: ContactSectionProps = {}) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    brandName: '',
    phone: '',
    email: '',
    service: ''
  });

  // Pre-fill form from pricing quote data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pricingIndustry = sessionStorage.getItem('pricing_quote_industry');
      const pricingAppType = sessionStorage.getItem('pricing_quote_app_type');
      const pricingMinPrice = sessionStorage.getItem('pricing_quote_min_price');
      const pricingMaxPrice = sessionStorage.getItem('pricing_quote_max_price');

      if (pricingIndustry || pricingAppType) {
        setFormData(prev => ({
          ...prev,
          service: 'business-app-website', // Pre-select business app / website
          industry: pricingIndustry || undefined,
          appType: pricingAppType || undefined,
          estimatedMinPrice: pricingMinPrice || undefined,
          estimatedMaxPrice: pricingMaxPrice || undefined
        }));
      }
    }
  }, []);

  const services = [
    { value: '', label: 'Select Solution' },
    { value: 'ai-customer-acquisition', label: 'AI Customer Acquisition' },
    { value: 'brand-management', label: 'Brand Management' },
    { value: 'ai-content-ads', label: 'AI Content & Ads' },
    { value: 'business-app-website', label: 'Business App / Website' }
  ];

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const submitToPROXe = async (formData: FormData) => {
    try {
      // UTM params: use the persisted (cross-page) store, falling back to the
      // current URL. Reading window.location.search alone would lose attribution
      // once the visitor navigates away from the UTM landing page.
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
          message: formData.service + (formData.brandName ? ` - Brand: ${formData.brandName}` : ''),
          form_type: 'contact',
          page_url: window.location.href,
          // PROXe requires a non-empty brand or it rejects the lead with 400.
          // Brand name is optional on the form, so fall back to the lead's name.
          brand: formData.brandName?.trim() || formData.name?.trim() || 'Website Lead',
          service: formData.service,
          industry: formData.industry || '',
          app_type: formData.appType || '',
          estimated_min_price: formData.estimatedMinPrice || '',
          estimated_max_price: formData.estimatedMaxPrice || '',
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_term: utmTerm,
          utm_content: utmContent,
        }),
      });
      // Surface non-2xx responses instead of silently dropping the lead.
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

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a solution';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

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
          service: formData.service,
          brandName: formData.brandName,
          industry: formData.industry,
          appType: formData.appType,
          estimatedMinPrice: formData.estimatedMinPrice,
          estimatedMaxPrice: formData.estimatedMaxPrice,
        },
      }),
    }).catch((err) => console.error('Email notification failed:', err));

    // Push GTM event first
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      const utmSource = typeof window !== 'undefined' ? sessionStorage.getItem('utm_source') : null;
      const referrer = typeof document !== 'undefined' ? document.referrer : '';
      
      const gtmData: any = {
        'event': 'web_lead',
        'formType': formData.industry && formData.appType ? 'Business App Quote' : 'Lead Form',
        'service': formData.service || '',
        'source': utmSource || referrer || 'direct'
      };

      // Add pricing quote data if available
      if (formData.industry) {
        gtmData.industry = formData.industry;
      }
      if (formData.appType) {
        gtmData.appType = formData.appType;
      }
      if (formData.estimatedMinPrice) {
        gtmData.estimatedMinPrice = formData.estimatedMinPrice;
      }
      if (formData.estimatedMaxPrice) {
        gtmData.estimatedMaxPrice = formData.estimatedMaxPrice;
      }

      (window as any).dataLayer.push(gtmData);
    }
    
    // Wait 200ms then redirect
    setTimeout(() => {
      const params = new URLSearchParams({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        brandName: formData.brandName,
        service: formData.service,
      });
      router.push(`/thank-you?${params.toString()}`);
    }, 200);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-left">
          <h2 className="contact-heading">
            Let's <span className="highlight">Begin</span>
          </h2>

          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <p className="step-text">
                  Tell us what keeps you up at night
                </p>
                <p className="step-subtitle">
                  We'll turn that problem into your unfair advantage
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <p className="step-text">
                  Get a battle plan, not a proposal
                </p>
                <p className="step-subtitle">
                  Custom strategy built for your exact situation
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <p className="step-text">Watch your business transform</p>
                <p className="step-subtitle">While competitors wonder what happened</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-right">
          <form className="contact-form" onSubmit={handleSubmit} data-form-type="Lead Form">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="form-input form-select"
              >
                {services.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              {errors.service && <div className="form-error">{errors.service}</div>}
            </div>

            {formData.service && (
              <div className="form-group">
                <input
                  type="text"
                  name="brandName"
                  placeholder="Brand Name"
                  value={formData.brandName}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            )}

            {/* Hidden fields for pricing quote data */}
            {formData.industry && (
              <input type="hidden" name="industry" value={formData.industry} />
            )}
            {formData.appType && (
              <input type="hidden" name="appType" value={formData.appType} />
            )}
            {formData.estimatedMinPrice && (
              <input type="hidden" name="estimatedMinPrice" value={formData.estimatedMinPrice} />
            )}
            {formData.estimatedMaxPrice && (
              <input type="hidden" name="estimatedMaxPrice" value={formData.estimatedMaxPrice} />
            )}

            <button type="submit" className="submit-button">
              {formData.industry && formData.appType ? 'Start Your Build' : 'Submit'}
            </button>

            {errors.name && <div className="form-error">{errors.name}</div>}
            {errors.email && <div className="form-error">{errors.email}</div>}
            {successMessage && <div className="form-success">{successMessage}</div>}

            <p className="privacy-text">
              By submitting this form, you agree to our{' '}
              {/* PHASE 2: Show Coming Soon modal for privacy policy link */}
              {/* <Link href="/privacy" className="privacy-link">
                Privacy Policy
              </Link> */}
              <a 
                href="/privacy" 
                className="privacy-link"
                onClick={(e) => {
                  e.preventDefault();
                  if (onInternalLinkClick) {
                    onInternalLinkClick();
                  }
                }}
              >
                Privacy Policy
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}




