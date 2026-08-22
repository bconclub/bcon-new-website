'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import './proxe-cfs.css';

const DynamicLiquidEther = dynamic(
  () => import('@/effects/LiquidEther/LiquidEther'),
  { ssr: false }
);

const sections = [
  {
    title: 'Infrastructure',
    items: [
      'Built on enterprise-grade cloud (Vercel + Supabase)',
      'PostgreSQL databases, isolated per client',
      'SSL/TLS encryption on all endpoints',
      '99.9% uptime SLA',
    ],
  },
  {
    title: 'Data Protection',
    items: [
      'All data encrypted in transit (TLS 1.3)',
      'Encrypted at rest (AES-256)',
      'Daily automated backups',
      'Role-based access control (admin/viewer)',
    ],
  },
  {
    title: 'Compliance',
    items: [
      'GDPR compliant',
      'CCPA compliant',
      'Data residency options available',
      'SOC 2 aligned practices',
    ],
  },
  {
    title: 'Access & Authentication',
    items: [
      'Secure login via Supabase Auth',
      'Invite-only dashboard access',
      'Session management with auto-expiry',
      'Audit logs for all actions',
    ],
  },
  {
    title: 'AI & Privacy',
    items: [
      'Powered by Anthropic Claude (enterprise API)',
      'No customer data used for AI training',
      'Conversations stored only in your database',
      'Clients own 100% of their data',
    ],
  },
  {
    title: 'Integrations (Official APIs only)',
    items: [
      'WhatsApp: Meta Cloud API (official)',
      'Calendar: Google Calendar API',
      'Voice: Licensed telephony partners',
    ],
  },
  {
    title: 'Reliability',
    items: [
      'Auto-scaling infrastructure',
      'Real-time monitoring',
      'Error logging and alerts',
      'Global CDN deployment',
    ],
  },
];

export default function ProxeCfsPage() {
  return (
    <div className="pcfs-container">
      <div className="pcfs-bg">
        <DynamicLiquidEther
          colors={['#6B2FE8', '#6B2FE8', '#6B2FE8']}
          mouseForce={20}
          cursorSize={100}
          resolution={0.3}
          autoDemo={true}
          autoSpeed={0.2}
          autoIntensity={2.2}
          dt={0.04}
          iterationsPoisson={16}
          iterationsViscous={16}
        />
      </div>

      <div className="pcfs-content">
        <header className="pcfs-header">
          <p className="pcfs-eyebrow">Security & Platform</p>
          <h1 className="pcfs-title">PROXe Security & Platform</h1>
          <p className="pcfs-intro">
            PROXe is built with enterprise-grade security so clients can trust their customer
            data is safe. Every layer — from infrastructure to AI — is designed with privacy,
            compliance, and reliability in mind.
          </p>
        </header>

        <div className="pcfs-grid">
          {sections.map((section) => (
            <section key={section.title} className="pcfs-card">
              <h2 className="pcfs-card-title">{section.title}</h2>
              <ul className="pcfs-list">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <footer className="pcfs-footer">
          <p className="pcfs-footer-text">Questions about security?</p>
          <a href="mailto:info@bconclub.com" className="pcfs-cta">
            Contact us
          </a>
          <div className="pcfs-product-link">
            <a href="https://goproxe.com" target="_blank" rel="noopener noreferrer">
              Visit PROXe →
            </a>
          </div>
          <div className="pcfs-back">
            <Link href="/" className="pcfs-back-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
