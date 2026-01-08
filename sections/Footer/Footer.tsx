'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { InstagramIcon, LinkedInIcon, YouTubeIcon } from '@/components/shared/Icons';
import './Footer.css';

interface FooterProps {
  onInternalLinkClick?: () => void;
}

export default function Footer({ onInternalLinkClick }: FooterProps = {}) {
  const [email, setEmail] = useState('');
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
            const { count } = await response.json();
            setVisitorCount(count);
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
          const { count } = await response.json();
          setVisitorCount(count);
          
          // Mark as counted in this session
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('visitor_counted', 'true');
          }
        }
      } catch (error) {
        console.error('Error tracking visitor:', error);
        setVisitorCount(null);
      }
    };

    trackVisitor();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // TODO: Add newsletter subscription API call
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // On success, hide form and show confirmation
      setIsSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
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

  const companyLinks = [
    { label: 'Work', href: '/work' },
    { label: 'Services', href: '/services' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ];

  const socialLinks = [
    { label: 'Instagram', href: 'https://www.instagram.com/bconclub', icon: InstagramIcon },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/bconclub', icon: LinkedInIcon },
    { label: 'YouTube', href: 'https://www.youtube.com/@bconclub', icon: YouTubeIcon },
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
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>

          {/* Company Column */}
          <div className="footer-column">
            <h3 className="footer-column-title">COMPANY</h3>
            <ul className="footer-links">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  {isInternalLink(link.href) ? (
                    <a
                      href={link.href}
                      className="footer-link"
                      onClick={(e) => handleLinkClick(e, link.href)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a
                      href={link.href}
                      className="footer-link"
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

          {/* Social Column */}
          <div className="footer-column">
            <h3 className="footer-column-title">SOCIAL</h3>
            <ul className="footer-links">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link footer-social-link"
                      aria-label={social.label}
                    >
                      <IconComponent size={18} color="currentColor" />
                      <span>{social.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p>© <span className="footer-accent">BCON CLUB</span>. ALL RIGHTS RESERVED. <span className="footer-accent">2026</span></p>
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
        </div>
      </div>

      {/* Visitor Counter */}
      {visitorCount !== null && (
        <div className="footer-visitor-counter">
          <p>You're visitor #{visitorCount.toLocaleString()}</p>
        </div>
      )}
    </footer>
  );
}
