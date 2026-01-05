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
  // #region agent log
  fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:151',message:'Component render started',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  const [selectedApp, setSelectedApp] = useState<BusinessApp | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const mobileVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const desktopVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  
  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:159',message:'Component mounted, apps count',data:{appsCount:mockBusinessApps.length,mobileRefs:mobileVideoRefs.current.length,desktopRefs:desktopVideoRefs.current.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
    
    // Check video elements after mount
    setTimeout(() => {
      const allVideos = document.querySelectorAll('.business-apps-card-media');
      const mobileVideos = document.querySelectorAll('.business-apps-mobile-grid .business-apps-card-media');
      const desktopVideos = document.querySelectorAll('.business-apps-desktop-carousel .business-apps-card-media');
      fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:164',message:'Video elements check',data:{totalVideos:allVideos.length,mobileVideos:mobileVideos.length,desktopVideos:desktopVideos.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
    }, 500);
  }, []);
  // #endregion

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
    // #region agent log
    fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:177',message:'Mobile hover',data:{index,isHovering,hasVideo:!!video},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    if (video) {
      if (isHovering) {
        video.play().catch((err) => {
          // #region agent log
          fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:182',message:'Mobile video play failed',data:{index,error:err.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
        });
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  };

  // Video hover play/pause - desktop
  const handleDesktopCardHover = (index: number, isHovering: boolean) => {
    const video = desktopVideoRefs.current[index];
    // #region agent log
    fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:195',message:'Desktop hover',data:{index,isHovering,hasVideo:!!video},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    if (video) {
      if (isHovering) {
        video.play().catch((err) => {
          // #region agent log
          fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:200',message:'Desktop video play failed',data:{index,error:err.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'D'})}).catch(()=>{});
          // #endregion
        });
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
                // #region agent log
                fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:214',message:'Desktop autoplay visible video',data:{index,isVisible},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'H'})}).catch(()=>{});
                // #endregion
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
        fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:250',message:'Desktop carousel cards check',data:{totalCards:cards.length,visibleCards:visibleCards.length,visibleIndices:visibleCards,containerWidth:containerRect.width},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'G'})}).catch(()=>{});
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

  // #region agent log
  useEffect(() => {
    const checkVisibility = () => {
      const section = document.querySelector('.business-apps-section');
      if (section) {
        const rect = section.getBoundingClientRect();
        const styles = window.getComputedStyle(section);
        fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:204',message:'Section DOM check',data:{exists:!!section,display:styles.display,visibility:styles.visibility,opacity:styles.opacity,height:rect.height,width:rect.width,top:rect.top},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      } else {
        fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:204',message:'Section DOM not found',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      }
    };
    const timer = setTimeout(checkVisibility, 100);
    return () => clearTimeout(timer);
  }, []);
  // #endregion

  return (
    <section className="business-apps-section">
      {/* #region agent log */}
      {(() => { fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:220',message:'Rendering JSX',data:{appsCount:mockBusinessApps.length,isModalOpen},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{}); return null; })()}
      {/* #endregion */}
      <div className="business-apps-container">
        {/* Header */}
        <div className="business-apps-header">
          <p className="business-apps-eyebrow">OUR WORK</p>
          <h2 className="business-apps-title">Business Apps</h2>
        </div>

        {/* Mobile: Vertical Stack */}
        <div className="business-apps-mobile-grid">
          {/* #region agent log */}
          {(() => { fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:230',message:'Rendering mobile grid',data:{cardsCount:mockBusinessApps.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{}); return null; })()}
          {/* #endregion */}
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
                    // #region agent log
                    if (el) {
                      fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:250',message:'Mobile video ref set',data:{index,src:app.video_url},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
                    }
                    // #endregion
                  }}
                  src={app.video_url}
                  className="business-apps-card-media"
                  loop
                  muted
                  playsInline
                  preload="auto"
                  onLoadedData={(e) => {
                    // #region agent log
                    fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:320',message:'Mobile video loaded',data:{index,src:app.video_url,readyState:e.currentTarget.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'F'})}).catch(()=>{});
                    // #endregion
                  }}
                  onError={(e) => {
                    // #region agent log
                    fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:326',message:'Mobile video error',data:{index,src:app.video_url,error:e.currentTarget.error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'F'})}).catch(()=>{});
                    // #endregion
                  }}
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
          {/* #region agent log */}
          {(() => { fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:250',message:'Rendering desktop carousel',data:{cardsCount:mockBusinessApps.length,windowWidth:typeof window !== 'undefined' ? window.innerWidth : 0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{}); return null; })()}
          {/* #endregion */}
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
                      // #region agent log
                      if (el) {
                        fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:296',message:'Desktop video ref set',data:{index,src:app.video_url},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
                      }
                      // #endregion
                    }}
                    src={app.video_url}
                    className="business-apps-card-media"
                    loop
                    muted
                    playsInline
                    preload="auto"
                    autoPlay={false}
                    onLoadedData={(e) => {
                      // #region agent log
                      fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:375',message:'Desktop video loaded',data:{index,src:app.video_url,readyState:e.currentTarget.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'F'})}).catch(()=>{});
                      // #endregion
                    }}
                    onError={(e) => {
                      // #region agent log
                      fetch('http://127.0.0.1:7248/ingest/37e602c8-dcec-4b1f-8959-e43954ca6fde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BusinessAppsSection.tsx:381',message:'Desktop video error',data:{index,src:app.video_url,error:e.currentTarget.error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'F'})}).catch(()=>{});
                      // #endregion
                    }}
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

