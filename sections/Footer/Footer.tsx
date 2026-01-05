'use client';

import Image from 'next/image';
import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { label: 'AI in Business', href: '/services#ai' },
    { label: 'Brand Marketing', href: '/services#marketing' },
    { label: 'Business Apps', href: '/services#apps' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'End User License Agreement', href: '/eula' },
  ];

  const combinedLinks = [
    { label: 'Use Cases', href: '/work' },
    { label: 'Security', href: '/security' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'End User License Agreement', href: '/eula' },
  ];

  const socialLinks = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/bconclub' },
    { label: 'X', href: 'https://twitter.com/bconclub' },
  ];

  return (
    <footer className="footer">
      {/* Top Gradient Bar */}
      <div className="footer-gradient-bar">
        {Array.from({ length: 20 }).map((_, i) => {
          // Create varying heights for visual interest
          const heights = [45, 50, 55, 48, 52, 58, 46, 54, 50, 56, 48, 52, 55, 49, 53, 57, 46, 51, 54, 50];
          return (
            <div 
              key={i} 
              className="gradient-block"
              style={{ 
                height: `${heights[i % heights.length]}px`
              }}
            />
          );
        })}
      </div>

      <div className="footer-container">
        {/* Navigation Section */}
        <div className="footer-nav-section">
          <div className="footer-nav-left">
            <div className="footer-nav-group">
              <h3 className="footer-nav-title">Product</h3>
              <div className="footer-nav-divider"></div>
              <ul className="footer-nav-list">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-nav-group">
              <h3 className="footer-nav-title">Legal</h3>
              <div className="footer-nav-divider"></div>
              <ul className="footer-nav-list">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer-nav-right">
            <div className="footer-combined-links">
              {combinedLinks.map((link, index) => (
                <span key={link.href}>
                  <Link href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                  {index < combinedLinks.length - 1 && <span className="link-separator"> / </span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Large BCON Watermark */}
        <div className="footer-watermark">
          <h1 className="watermark-text">BCON</h1>
        </div>

        {/* Bottom Section - Logo, Copyright, and Social */}
        <div className="footer-bottom">
          <div className="footer-brand">
            <Image
              src="/BCON White logo.webp"
              alt="BCON Club Logo"
              width={140}
              height={50}
              className="footer-logo"
              priority
            />
            <p className="copyright-text">
              BCON {currentYear}. All Rights Reserved.
            </p>
          </div>

          <div className="footer-social">
            {socialLinks.map((social, index) => (
              <span key={social.href}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label={social.label}
                >
                  {social.label}
                </a>
                {index < socialLinks.length - 1 && <span className="link-separator"> / </span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

