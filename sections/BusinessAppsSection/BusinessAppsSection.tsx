'use client';

import { useState, useRef, useEffect } from 'react';
import './BusinessAppsSection.css';

interface BusinessApp {
  id: string;
  product_name: string;
  tagline: string;
  video_url?: string;
  vimeo_id?: string;
  case_study_url: string;
}

// Mock data - replace with Supabase query
const mockBusinessApps: BusinessApp[] = [
  {
    id: '1',
    product_name: 'PROXe',
    tagline: 'AI-powered operating system for growing businesses',
    vimeo_id: '1151323707',
    case_study_url: '/work/proxe'
  },
  {
    id: '2',
    product_name: 'Turquoise Holidays',
    tagline: 'AI-powered travel platform with intelligent booking',
    vimeo_id: '1151323881',
    case_study_url: '/work/turquoise-holidays'
  },
  {
    id: '3',
    product_name: 'Windchasers Pilot',
    tagline: 'Complete pilot onboarding platform',
    vimeo_id: '1151206257',
    case_study_url: '/work/windchasers-pilot'
  },
  {
    id: '4',
    product_name: 'Adipoo Kitchen',
    tagline: 'Smart restaurant platform with WhatsApp ordering',
    vimeo_id: '1151324148',
    case_study_url: '/work/adipoo-kitchen'
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

  useEffect(() => {
    if (isOpen && videoRef.current && !app?.vimeo_id) {
      videoRef.current.play().catch(() => {
        // Autoplay was prevented
      });
    }
  }, [isOpen, app]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
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
      <div className="business-apps-modal" onClick={(e) => e.stopPropagation()}>
        {/* Top Bar */}
        <div className="business-apps-modal-header">
          <h3 className="business-apps-modal-title">{app.product_name}</h3>
          <button className="business-apps-modal-close" onClick={onClose} aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Video Container */}
        <div className="business-apps-modal-video-container">
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

        {/* Bottom Action */}
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

export default function BusinessAppsSection() {
  const [selectedApp, setSelectedApp] = useState<BusinessApp | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const mobileVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const desktopVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleCardClick = (app: BusinessApp) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApp(null);
  };

  // Video hover play/pause - mobile
  const handleMobileCardHover = (index: number, isHovering: boolean) => {
    const video = mobileVideoRefs.current[index];
    if (video) {
      if (isHovering) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  };

  // Video hover play/pause - desktop
  const handleDesktopCardHover = (index: number, isHovering: boolean) => {
    const video = desktopVideoRefs.current[index];
    if (video) {
      if (isHovering) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  };

  // Autoplay visible videos on mount and when scrolling
  useEffect(() => {
    const playVisibleVideos = () => {
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop && carouselRef.current) {
        const container = carouselRef.current;
        const containerRect = container.getBoundingClientRect();
        desktopVideoRefs.current.forEach((video, index) => {
          if (video) {
            const card = video.closest('.business-apps-card');
            if (card) {
              const cardRect = card.getBoundingClientRect();
              const isVisible = cardRect.left >= containerRect.left - 100 && cardRect.left < containerRect.right + 100;
              if (isVisible && video.paused) {
                video.play().catch(() => {});
              } else if (!isVisible && !video.paused) {
                video.pause();
                video.currentTime = 0;
              }
            }
          }
        });
      } else if (!isDesktop && mobileVideoRefs.current[0]) {
        mobileVideoRefs.current[0].play().catch(() => {});
      }
    };
    
    const timer = setTimeout(playVisibleVideos, 500);
    const scrollHandler = () => {
      playVisibleVideos();
    };
    
    if (carouselRef.current) {
      carouselRef.current.addEventListener('scroll', scrollHandler);
    }
    
    return () => {
      clearTimeout(timer);
      if (carouselRef.current) {
        carouselRef.current.removeEventListener('scroll', scrollHandler);
      }
    };
  }, []);

  // Check visible cards for debugging
  useEffect(() => {
    const checkCards = () => {
      const container = carouselRef.current;
      if (container) {
        const cards = container.querySelectorAll('.business-apps-card');
        const visibleCards: number[] = [];
        const containerRect = container.getBoundingClientRect();
        cards.forEach((card, idx) => {
          const rect = card.getBoundingClientRect();
          const isVisible = rect.left >= containerRect.left && rect.left < containerRect.right;
          if (isVisible) visibleCards.push(idx);
        });
      }
    };
    const timer = setTimeout(checkCards, 500);
    return () => clearTimeout(timer);
  }, []);

  // Carousel scroll handlers
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -384, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 384, behavior: 'smooth' });
    }
  };


  return (
    <section className="business-apps-section">
      <div className="business-apps-container">
        {/* Header */}
        <div className="business-apps-header">
          <p className="business-apps-eyebrow">OUR WORK</p>
          <h2 className="business-apps-title">Business Apps</h2>
        </div>

        {/* Mobile: Vertical Stack */}
        <div className="business-apps-mobile-grid">
          {mockBusinessApps.map((app, index) => (
            <div
              key={`mobile-${app.id}`}
              className="business-apps-card"
              onClick={() => handleCardClick(app)}
              onMouseEnter={() => handleMobileCardHover(index, true)}
              onMouseLeave={() => handleMobileCardHover(index, false)}
            >
              {app.vimeo_id ? (
                (() => {
                  const startFrag = app.vimeo_id === '1151206257' ? '#t=10s' : '';
                  return (
                    <iframe
                      src={`https://player.vimeo.com/video/${app.vimeo_id}?autoplay=0&loop=1&controls=0&title=0&byline=0&portrait=0&muted=1&background=1${startFrag}`}
                      className="business-apps-card-media"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  );
                })()
              ) : app.video_url ? (
                <video
                  ref={(el) => { 
                    mobileVideoRefs.current[index] = el;
                  }}
                  src={app.video_url}
                  className="business-apps-card-media"
                  loop
                  muted
                  playsInline
                  preload="auto"
                  onLoadedData={() => {}}
                  onError={() => {}}
                />
              ) : null}

              <div className="business-apps-card-details">
                <h3 className="business-apps-card-name">{app.product_name}</h3>
                <p className="business-apps-card-tagline">{app.tagline}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Horizontal Carousel */}
        <div className="business-apps-desktop-carousel">
          <button
            className="business-apps-carousel-arrow business-apps-carousel-arrow-left"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="business-apps-carousel-container" ref={carouselRef}>
            {mockBusinessApps.map((app, index) => (
              <div
                key={`desktop-${app.id}`}
                className="business-apps-card"
                onClick={() => handleCardClick(app)}
                onMouseEnter={() => handleDesktopCardHover(index, true)}
                onMouseLeave={() => handleDesktopCardHover(index, false)}
              >
                {app.vimeo_id ? (
                  (() => {
                    const startFrag = app.vimeo_id === '1151206257' ? '#t=10s' : '';
                    return (
                      <iframe
                        src={`https://player.vimeo.com/video/${app.vimeo_id}?autoplay=0&loop=1&controls=0&title=0&byline=0&portrait=0&muted=1&background=1${startFrag}`}
                        className="business-apps-card-media"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  })()
                ) : app.video_url ? (
                  <video
                    ref={(el) => { 
                      desktopVideoRefs.current[index] = el;
                    }}
                    src={app.video_url}
                    className="business-apps-card-media"
                    loop
                    muted
                    playsInline
                    preload="auto"
                    autoPlay={false}
                    onLoadedData={() => {}}
                    onError={() => {}}
                  />
                ) : null}

                <div className="business-apps-card-details">
                  <h3 className="business-apps-card-name">{app.product_name}</h3>
                  <p className="business-apps-card-tagline">{app.tagline}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            className="business-apps-carousel-arrow business-apps-carousel-arrow-right"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
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

