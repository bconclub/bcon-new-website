'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { sendToWebhook } from '@/lib/tracking/webhook';
import { getTrackingData, getUTMParams } from '@/lib/tracking/utm';
import './ContactSection.css';

interface FormData {
  name: string;
  phone: string;
  email: string;
  service: string;
}

interface ContactSectionProps {
  onInternalLinkClick?: () => void;
}

export default function ContactSection({ onInternalLinkClick }: ContactSectionProps = {}) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    service: ''
  });

  const services = [
    { value: '', label: 'Select a solution' },
    { value: 'ai-in-business', label: 'AI in Business' },
    { value: 'brand-marketing', label: 'Brand Marketing' },
    { value: 'business-apps', label: 'Business Apps' },
    { value: 'general', label: 'General Inquiry' },
    { value: 'not-sure', label: 'Not sure yet / Want to discuss' }
  ];

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

    // Send form data to webhook with all tracking info including UTM parameters
    try {
      // Get UTM params from sessionStorage
      const utmParams = typeof window !== 'undefined' ? getUTMParams() : {};
      
      // Get session ID
      const sessionId = typeof window !== 'undefined' 
        ? sessionStorage.getItem('session_id') || null 
        : null;

      // Build payload with explicit UTM parameters
      const trackingData = getTrackingData('form_submit', {
        formType: 'contact',
        // Form data
        name: formData.name,
        phone: formData.phone || '',
        email: formData.email,
        service: formData.service,
        // UTM parameters (explicitly included)
        utm_source: utmParams.utm_source || null,
        utm_medium: utmParams.utm_medium || null,
        utm_campaign: utmParams.utm_campaign || null,
        utm_term: utmParams.utm_term || null,
        utm_content: utmParams.utm_content || null,
        // Additional context
        timestamp: new Date().toISOString(),
        page: typeof window !== 'undefined' ? window.location.pathname : '',
        path: typeof window !== 'undefined' ? window.location.pathname + window.location.search : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        sessionId: sessionId,
        fullUrl: typeof window !== 'undefined' ? window.location.href : '',
      });

      // Send to webhook - includes UTM params, referrer, userAgent, sessionId, etc.
      await sendToWebhook(trackingData);
    } catch (error) {
      console.error('Error sending form data to webhook:', error);
      // Continue even if webhook fails - don't block user experience
    }

    // Redirect to thank you page
    router.push('/thank-you');
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
          <form className="contact-form" onSubmit={handleSubmit}>
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

            <button type="submit" className="submit-button">
              Submit
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




