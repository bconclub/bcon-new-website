'use client';

import { useState, useRef, useEffect } from 'react';
import '@/sections/BusinessAppsSection/BusinessAppsSection.css';

interface BusinessApp {
  id: string;
  product_name: string;
  tagline: string;
  description?: string;
  video_url?: string;
  vimeo_id?: string;
  case_study_url: string;
  features?: Array<{ icon: string; title: string; description: string }>;
  tech_stack?: string[];
  target_market?: string;
}

// Mock data - replace with Supabase query
const mockBusinessApps: BusinessApp[] = [
  {
    id: '1',
    product_name: 'PROXe',
    tagline: 'AI-powered operating system for growing businesses',
    description: 'An intelligent AI-powered system for business automation with real-time analytics, custom workflow builder, and multi-platform integration.',
    vimeo_id: '1151323707',
    case_study_url: '/work/proxe',
    tech_stack: ['React', 'Next.js', 'Supabase', 'OpenAI API'],
    features: [
      {
        icon: 'robot',
        title: 'AI-Powered Automation',
        description: 'Intelligent workflow automation that learns and adapts to your business processes'
      },
      {
        icon: 'analytics',
        title: 'Real-Time Analytics Dashboard',
        description: 'Comprehensive analytics with live data visualization and custom reporting'
      }
    ]
  },
  {
    id: '2',
    product_name: 'Turquoise Holidays',
    tagline: 'AI-powered travel platform with intelligent booking',
    description: 'A comprehensive travel management platform with intelligent trip planning, real-time flight tracking, and social travel sharing capabilities.',
    vimeo_id: '1151323881',
    case_study_url: '/work/turquoise-holidays',
    tech_stack: ['React', 'Next.js', 'Supabase']
  },
  {
    id: '3',
    product_name: 'Windchasers Pilot',
    tagline: 'Complete pilot onboarding platform',
    description: 'Custom onboarding microsite for pilot training with tests, booking, and instructor dashboard. Full Meta Ads pixel integration with UTM tracking.',
    vimeo_id: '1151206257',
    case_study_url: '/work/windchasers-pilot',
    tech_stack: ['React', 'Next.js', 'Supabase']
  },
  {
    id: '4',
    product_name: 'Adipoo Kitchen',
    tagline: 'Smart restaurant platform with WhatsApp ordering',
    description: 'Complete restaurant management solution with table reservations, menu management, order tracking, and customer loyalty programs.',
    vimeo_id: '1151324148',
    case_study_url: '/work/adipoo-kitchen',
    tech_stack: ['React', 'Next.js', 'Supabase']
  }
];

interface BusinessAppModalProps {
  app: BusinessApp | null;
  isOpen: boolean;
  onClose: () => void;
}

function BusinessAppModal({ app, isOpen, onClose }: BusinessAppModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    if (isOpen && videoRef.current && !app?.vimeo_id) {
      videoRef.current.play().catch(() => {});
    }
  }, [isOpen, app]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsDescriptionExpanded(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!app || !isOpen) return null;

  return (
    <div className="business-apps-modal-backdrop" onClick={onClose}>
      <div className="business-apps-modal business-apps-modal-mobile" onClick={(e) => e.stopPropagation()}>
        <div className="business-apps-modal-header">
          <h3 className="business-apps-modal-title">{app.product_name}</h3>
          <button className="business-apps-modal-close" onClick={onClose} aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="business-apps-modal-video-container business-apps-modal-video-container-mobile">
          {app.vimeo_id ? (
            (() => {
              const startFrag = app.vimeo_id === '1151206257' ? '#t=10s' : '';
              return (
                <iframe
                  src={`https://player.vimeo.com/video/${app.vimeo_id}?autoplay=1&loop=1&controls=1&title=0&byline=0&portrait=0&muted=0${startFrag}`}
                  className="business-apps-modal-video"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              );
            })()
          ) : app.video_url ? (
            <>
              <video
                ref={videoRef}
                src={app.video_url}
                className="business-apps-modal-video"
                loop
                muted={isMuted}
                playsInline
                controls
              />
              {isMuted && (
                <button
                  className="business-apps-modal-unmute"
                  onClick={() => {
                    setIsMuted(false);
                    if (videoRef.current) {
                      videoRef.current.muted = false;
                    }
                  }}
                  aria-label="Unmute video"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                </button>
              )}
            </>
          ) : null}
        </div>

        {/* Expandable Description Section */}
        <div className="business-apps-modal-description-section">
          <button
            className="business-apps-modal-description-toggle"
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          >
            <span>Build Details</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isDescriptionExpanded ? 'expanded' : ''}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div className={`business-apps-modal-description-content ${isDescriptionExpanded ? 'expanded' : ''}`}>
            {app.description && (
              <p className="business-apps-modal-description-text">{app.description}</p>
            )}
            {app.tech_stack && app.tech_stack.length > 0 && (
              <div className="business-apps-modal-tech-stack">
                <h4 className="business-apps-modal-tech-title">Technology Stack</h4>
                <div className="business-apps-modal-tech-list">
                  {app.tech_stack.map((tech, index) => (
                    <span key={index} className="business-apps-modal-tech-badge">{tech}</span>
                  ))}
                </div>
              </div>
            )}
            {app.features && app.features.length > 0 && (
              <div className="business-apps-modal-features">
                <h4 className="business-apps-modal-features-title">Key Features</h4>
                <ul className="business-apps-modal-features-list">
                  {app.features.map((feature, index) => (
                    <li key={index} className="business-apps-modal-feature-item">
                      <strong>{feature.title}:</strong> {feature.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="business-apps-modal-footer">
          <a
            href={app.case_study_url}
            className="business-apps-modal-cta"
          >
            View Full Project →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function MobileBusinessApps() {
  const [selectedApp, setSelectedApp] = useState<BusinessApp | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (app: BusinessApp) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApp(null);
  };


  return (
    <section className="business-apps-section">
      <div className="business-apps-container">
        <div className="business-apps-header">
          <p className="business-apps-eyebrow">OUR WORK</p>
          <h2 className="business-apps-title">Business Apps</h2>
        </div>

        {/* Mobile: Vertical Stack */}
        <div className="business-apps-mobile-grid">
          {mockBusinessApps.map((app, index) => (
            <div
              key={`mobile-${app.id}`}
              className="business-apps-card business-apps-card-mobile"
              onClick={() => handleCardClick(app)}
            >
              <div className="business-apps-card-details business-apps-card-details-mobile">
                <h3 className="business-apps-card-name">{app.product_name}</h3>
                <p className="business-apps-card-tagline">{app.tagline}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <BusinessAppModal
        app={selectedApp}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}

