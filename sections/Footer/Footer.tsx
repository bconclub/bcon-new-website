'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { InstagramIcon, LinkedInIcon, YouTubeIcon, FacebookIcon, XIcon } from '@/components/shared/Icons';
import { getTrackingData, getMergedUTMParams } from '@/lib/tracking/utm';
import { sendToWebhook } from '@/lib/tracking/webhook';
import './Footer.css';

interface FooterProps {
  onInternalLinkClick?: () => void;
}

export default function Footer({ onInternalLinkClick }: FooterProps = {}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'name' | 'email'>('name');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  // Fetch and increment visitor count on mount (only once per session)
  useEffect(() => {
    const trackVisitor = async () => {
      // Check if already counted in this session
      const hasBeenCounted = typeof window !== 'undefined' 
        ? sessionStorage.getItem('visitor_counted') === 'true'
        : false;

      if (hasBeenCounted) {
        // If already counted, just fetch the current count without incrementing
        try {
          const response = await fetch('/api/visitor-count?fetchOnly=true');
          if (response.ok) {
            const data = await response.json();
            if (data.count !== undefined) {
              setVisitorCount(data.count);
            } else {
              console.warn('Visitor count API returned unexpected format:', data);
            }
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.warn('Visitor count fetch failed:', response.status, errorData);
          }
        } catch (error) {
          console.error('Error fetching visitor count:', error);
        }
        return;
      }

      // First time in this session - increment the count
      try {
        const response = await fetch('/api/visitor-count');
        
        if (response.ok) {
          const data = await response.json();
          if (data.count !== undefined) {
            setVisitorCount(data.count);
            // Mark as counted in this session
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('visitor_counted', 'true');
            }
          } else if (data.error) {
            console.warn('Visitor count API error:', data.error, data.details);
            // Don't show error to user, just log it
            setVisitorCount(0);
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.warn('Visitor count API failed:', response.status, errorData);
          // Still show 0 instead of hiding
          setVisitorCount(0);
        }
      } catch (error) {
        console.error('Error tracking visitor:', error);
        // Show 0 instead of null so the section still renders
        setVisitorCount(0);
      }
    };

    trackVisitor();
  }, []);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStep('email');
  };

  const submitToPROXe = async (name: string, email: string) => {
    try {
      // UTM params: use the persisted (cross-page) store, falling back to the
      // current URL, so newsletter attribution survives cross-page navigation.
      const utm = getMergedUTMParams();
      const utmSource = utm.utm_source || '';
      const utmMedium = utm.utm_medium || '';
      const utmCampaign = utm.utm_campaign || '';
      const utmTerm = utm.utm_term || '';
      const utmContent = utm.utm_content || '';

      await fetch('https://proxe.bconclub.com/api/website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: '',
          message: 'Newsletter subscription',
          form_type: 'newsletter',
          page_url: window.location.href,
          brand: '',
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_term: utmTerm,
          utm_content: utmContent,
        }),
      });
    } catch (e) {
      console.error('PROXe submission failed:', e);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Send newsletter subscription data to webhook
      const trackingData = getTrackingData('form_submit', {
        formType: 'newsletter',
        formData: {
          name: name,
          email: email,
        },
        pageTitle: typeof document !== 'undefined' ? document.title : undefined,
        fullUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      });

      console.log('[Newsletter] Sending subscription:', { name, email });
      const result = await sendToWebhook(trackingData);
      console.log('[Newsletter] Webhook result:', result);

      // Send to PROXe (fire-and-forget, non-blocking)
      submitToPROXe(name, email);

      // Send notification email
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'newsletter', data: { name, email } }),
      }).catch((err) => console.error('Email notification failed:', err));

      // On success, hide form and show confirmation
      setIsSubscribed(true);
      setName('');
      setEmail('');
      setStep('name');
    } catch (error) {
      console.error('Failed to send newsletter subscription:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isInternalLink = (href: string) => {
    return href.startsWith('/') && !href.startsWith('//');
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isInternalLink(href)) {
      e.preventDefault();
      if (onInternalLinkClick) {
        onInternalLinkClick();
      }
    }
  };

  const handleSocialClick = (platform: string, linkUrl: string, linkText: string) => {
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        'event': 'social_click',
        'platform': platform,
        'link_url': linkUrl,
        'link_text': linkText
      });
    }
  };

  const companyLinks = [
    { label: 'Work', href: '/#our-work', className: 'company-link-work' },
    { label: 'Solutions', href: '/#solutions', className: 'company-link-solutions' },
    { label: 'Contact', href: '/#contact', className: 'company-link-contact' },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Three Columns */}
        <div className="footer-columns">
          {/* Newsletter Column */}
          <div className="footer-column">
            <h3 className="footer-column-title">NEWSLETTER</h3>
            {isSubscribed ? (
              <div className="newsletter-confirmation">
                <p className="newsletter-confirmation-text">
                  Thank you for subscribing!
                </p>
              </div>
            ) : step === 'name' ? (
              <form className="newsletter-form" onSubmit={handleNameSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-button">
                  Next
                </button>
              </form>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe} data-form-type="newsletter">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                  autoFocus
                />
                <input type="hidden" name="name" value={name} />
                <button type="submit" className="newsletter-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>

          {/* Company Column */}
          <div className="footer-column">
            <h3 className="footer-column-title">COMPANY</h3>
            <ul className="footer-links company-links">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('/#') ? (
                    // Hash link (like /#contact, /#our-work, /#solutions) - navigate to homepage and scroll
                    <a
                      href={link.href}
                      className={`footer-link ${link.className || ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (typeof window !== 'undefined') {
                          if (window.location.pathname !== '/') {
                            // If not on homepage, navigate to homepage first
                            window.location.href = link.href;
                          } else {
                            // If on homepage, scroll to section
                            const hash = link.href.split('#')[1];
                            const element = document.getElementById(hash);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }
                        }
                      }}
                    >
                      {link.label}
                    </a>
                  ) : isInternalLink(link.href) ? (
                    <a
                      href={link.href}
                      className={`footer-link ${link.className || ''}`}
                      onClick={(e) => handleLinkClick(e, link.href)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a
                      href={link.href}
                      className={`footer-link ${link.className || ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p>© <span className="footer-accent">BCON CLUB</span>. ALL RIGHTS RESERVED. <span className="footer-accent">2026</span></p>
          <p className="footer-privacy-link">
            {isInternalLink('/privacy') ? (
              <a
                href="/privacy"
                className="footer-link"
                onClick={(e) => handleLinkClick(e, '/privacy')}
              >
                Privacy Policy
              </a>
            ) : (
              <a
                href="/privacy"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            )}
          </p>
        </div>

        {/* Large BCON Logo */}
        <div className="footer-logo-container">
          <Image
            src="/BCON White logo.webp"
            alt="BCON Club Logo"
            width={400}
            height={200}
            className="footer-logo-large"
            priority
          />
          {/* Social Media Icons Below Logo */}
          <div className="footer-logo-social-icons">
            <a
              href="https://www.instagram.com/bconclub"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon-link"
              aria-label="Instagram"
              onClick={() => handleSocialClick('Instagram', 'https://www.instagram.com/bconclub', 'Instagram')}
            >
              <InstagramIcon size={32} color="#E4405F" />
            </a>
            <a
              href="https://www.linkedin.com/company/bconclub"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon-link"
              aria-label="LinkedIn"
              onClick={() => handleSocialClick('LinkedIn', 'https://www.linkedin.com/company/bconclub', 'LinkedIn')}
            >
              <LinkedInIcon size={32} color="#0077B5" />
            </a>
            <a
              href="https://www.youtube.com/@bconclub"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon-link"
              aria-label="YouTube"
              onClick={() => handleSocialClick('YouTube', 'https://www.youtube.com/@bconclub', 'YouTube')}
            >
              <YouTubeIcon size={32} color="#FF0000" />
            </a>
            <a
              href="https://www.facebook.com/bconclub"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon-link"
              aria-label="Facebook"
              onClick={() => handleSocialClick('Facebook', 'https://www.facebook.com/bconclub', 'Facebook')}
            >
              <FacebookIcon size={32} color="#1877F2" />
            </a>
            <a
              href="https://x.com/bconclub"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon-link"
              aria-label="X"
              onClick={() => handleSocialClick('X', 'https://x.com/bconclub', 'X')}
            >
              <XIcon size={32} color="#FFFFFF" />
            </a>
          </div>
        </div>
      </div>

      {/* Visitor Counter */}
      {visitorCount !== null && (
        <div className="footer-visitor-counter">
          <p>
            You're visitor #<span className="visitor-number">{visitorCount.toLocaleString()}</span>
          </p>
        </div>
      )}
    </footer>
  );
}
