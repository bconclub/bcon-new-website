'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { featureIcons } from '@/components/shared/Icons';
import '@/sections/BusinessAppsSection/BusinessAppsSection.css';

interface Feature {
  icon: keyof typeof featureIcons;
  title: string;
  description: string;
}

interface BusinessApp {
  id: string;
  product_name: string;
  tagline: string;
  description?: string;
  video_url?: string;
  vimeo_id?: string;
  thumbnail_url?: string;
  case_study_url: string;
  features?: Feature[];
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
    thumbnail_url: '/product thumbnail/PROXe Cover.webp',
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
      },
      {
        icon: 'workflow',
        title: 'Custom Workflow Builder',
        description: 'Drag-and-drop interface to create and customize business workflows without coding'
      },
      {
        icon: 'integration',
        title: 'Multi-Platform Integration',
        description: 'Seamless integration with popular tools like Slack, Salesforce, and Google Workspace'
      }
    ],
    target_market: 'Growing businesses in retail, services, education, and real estate who need AI capabilities without enterprise complexity'
  },
  {
    id: '2',
    product_name: 'Turquoise Holidays',
    tagline: 'AI-powered travel platform with intelligent booking',
    description: 'A comprehensive travel management platform with intelligent trip planning, real-time flight tracking, and social travel sharing capabilities.',
    vimeo_id: '1151323881',
    thumbnail_url: '/product thumbnail/Turquoise Thumbnail.webp',
    case_study_url: '/work/turquoise-holidays',
    tech_stack: ['React', 'Next.js', 'Supabase'],
    features: [
      {
        icon: 'plane',
        title: 'Trip Planning & Booking',
        description: 'Intelligent trip planning with AI recommendations and seamless booking experience'
      },
      {
        icon: 'location',
        title: 'Real-Time Flight Tracking',
        description: 'Live flight status updates and automated notifications for delays or changes'
      },
      {
        icon: 'hotel',
        title: 'Hotel & Activity Recommendations',
        description: 'AI-powered suggestions based on preferences, budget, and travel history'
      },
      {
        icon: 'users',
        title: 'Social Travel Sharing',
        description: 'Share itineraries, photos, and experiences with friends and family'
      }
    ],
    target_market: 'Travel agencies, tour operators, and travel planners who want to automate itinerary creation and bookings'
  },
  {
    id: '3',
    product_name: 'Windchasers Pilot',
    tagline: 'Complete pilot onboarding platform',
    description: 'Custom onboarding microsite for pilot training with tests, booking, and instructor dashboard. Full Meta Ads pixel integration with UTM tracking.',
    vimeo_id: '1151206257',
    thumbnail_url: '/product thumbnail/Windhcasers Thumbnail.webp',
    case_study_url: '/work/windchasers-pilot',
    tech_stack: ['React', 'Next.js', 'Supabase'],
    features: [
      {
        icon: 'clipboard',
        title: 'Assessment Engine',
        description: 'Custom tests to qualify aspiring pilots — automated scoring and filtering'
      },
      {
        icon: 'calendar',
        title: 'Booking Intelligence',
        description: 'Real-time availability, automated confirmations, calendar sync for instructors'
      },
      {
        icon: 'chart',
        title: 'Conversion Tracking',
        description: 'Full Meta Ads integration with pixel tracking, UTM parameters, ROI analytics'
      },
      {
        icon: 'pilot',
        title: 'Instructor Dashboard',
        description: 'Manage students, track progress, schedule sessions — complete control'
      }
    ],
    target_market: 'Aviation training institutes and pilot schools needing streamlined student onboarding and conversion tracking'
  },
  {
    id: '4',
    product_name: 'Adipoo Kitchen',
    tagline: 'Smart restaurant platform with WhatsApp ordering',
    description: 'Complete restaurant management solution with table reservations, menu management, order tracking, and customer loyalty programs.',
    vimeo_id: '1151324148',
    thumbnail_url: '/product thumbnail/Adipoli Thumbnail.webp',
    case_study_url: '/work/adipoo-kitchen',
    tech_stack: ['React', 'Next.js', 'Supabase'],
    features: [
      {
        icon: 'restaurant',
        title: 'Table Reservation System',
        description: 'Real-time table availability and automated reservation confirmations'
      },
      {
        icon: 'menu',
        title: 'Menu Management',
        description: 'Dynamic menu updates, pricing control, and inventory integration'
      },
      {
        icon: 'package',
        title: 'Order Tracking',
        description: 'Live order status updates for customers and kitchen staff'
      },
      {
        icon: 'gift',
        title: 'Customer Loyalty Program',
        description: 'Points system, rewards, and personalized offers to increase retention'
      }
    ],
    target_market: 'Restaurants and cloud kitchens who want direct customer orders without third-party commissions'
  }
];

interface BusinessAppModalProps {
  app: BusinessApp | null;
  isOpen: boolean;
  onClose: () => void;
}

function BusinessAppModal({ app, isOpen, onClose }: BusinessAppModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isDetailsRevealed, setIsDetailsRevealed] = useState(false); // Start hidden
  const [isVideoLoaded, setIsVideoLoaded] = useState(false); // Track when video is loaded

  useEffect(() => {
    if (isOpen && videoRef.current && !app?.vimeo_id) {
      // Preload video but don't play yet
      videoRef.current.load();
    }
  }, [isOpen, app]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsDetailsRevealed(false); // Start with details hidden
      setIsVideoLoaded(false); // Reset video loaded state when modal opens
    } else {
      document.body.style.overflow = '';
      setIsDetailsRevealed(false);
      setIsVideoLoaded(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle scroll detection on window/body (since modal fills viewport)
  useEffect(() => {
    if (!isOpen || isDetailsRevealed) return;

    let scrollStartY = window.scrollY || document.documentElement.scrollTop || 0;
    let touchStartY = 0;
    let isTouching = false;

    const handleWheel = (e: WheelEvent) => {
      // Any downward scroll should reveal details
      if (e.deltaY > 0 && !isDetailsRevealed) {
        setIsDetailsRevealed(true);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      isTouching = true;
      scrollStartY = window.scrollY || document.documentElement.scrollTop || 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouching) return;
      const touchCurrentY = e.touches[0].clientY;
      const diffY = touchStartY - touchCurrentY;
      const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const scrollDiff = currentScrollY - scrollStartY;
      
      // If scrolling down at all, reveal details
      if ((diffY < -10 || scrollDiff > 10) && !isDetailsRevealed) {
        setIsDetailsRevealed(true);
      }
    };

    const handleTouchEnd = () => {
      isTouching = false;
    };

    // Also check modal scroll if it becomes scrollable
    const handleModalScroll = () => {
      if (modalRef.current) {
        const scrollTop = modalRef.current.scrollTop;
        // If scrolled at all (even 1px), reveal details
        if (scrollTop > 0 && !isDetailsRevealed) {
          setIsDetailsRevealed(true);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    const modal = modalRef.current;
    if (modal) {
      modal.addEventListener('scroll', handleModalScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (modal) {
        modal.removeEventListener('scroll', handleModalScroll);
      }
    };
  }, [isOpen, isDetailsRevealed]);

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
      <div 
        ref={modalRef}
        className={`business-apps-modal business-apps-modal-mobile ${isDetailsRevealed ? 'details-revealed' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="business-apps-modal-header">
          <div className="business-apps-modal-header-content">
            <h3 className="business-apps-modal-title">{app.product_name}</h3>
            <button className="business-apps-modal-close" onClick={onClose} aria-label="Close modal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Full Screen Video Container */}
        <div 
          ref={videoContainerRef}
          className={`business-apps-modal-video-container business-apps-modal-video-container-mobile ${isDetailsRevealed ? 'details-revealed' : ''}`}
          style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ position: 'relative', flex: 1, minHeight: 0, width: '100%' }}>
            {/* Thumbnail - shown initially, hidden when video loads */}
            {app.thumbnail_url && (
              <div className={`business-apps-modal-video-thumbnail-container ${isVideoLoaded ? 'video-loaded' : ''}`}>
                <Image
                  src={app.thumbnail_url}
                  alt={app.product_name}
                  fill
                  className="business-apps-modal-video-thumbnail"
                  priority
                  sizes="100vw"
                />
              </div>
            )}
            
            {/* Video - loaded in background, shown when ready */}
            {app.vimeo_id ? (
              (() => {
                const startFrag = app.vimeo_id === '1151206257' ? '#t=10s' : '';
                return (
                  <iframe
                    ref={iframeRef}
                    src={`https://player.vimeo.com/video/${app.vimeo_id}?autoplay=1&loop=1&controls=0&title=0&byline=0&portrait=0&muted=0&badge=0&dnt=1&background=1${startFrag}`}
                    className="business-apps-modal-video"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    onLoad={() => setIsVideoLoaded(true)}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      zIndex: isVideoLoaded ? 2 : 0,
                      opacity: isVideoLoaded ? 1 : 0,
                      transition: 'opacity 0.5s ease'
                    }}
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
                  onLoadedData={() => {
                    setIsVideoLoaded(true);
                    if (videoRef.current) {
                      videoRef.current.play().catch(() => {});
                    }
                  }}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    zIndex: isVideoLoaded ? 2 : 0,
                    opacity: isVideoLoaded ? 1 : 0,
                    transition: 'opacity 0.5s ease'
                  }}
                />
                {isMuted && isVideoLoaded && (
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
          
          {/* Reveal Button - Clickable area below video */}
          {!isDetailsRevealed && (
            <button 
              className="business-apps-modal-reveal-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDetailsRevealed(true);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDetailsRevealed(true);
              }}
              aria-label="View product details"
            >
              <span>View Product Details</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          )}
        </div>

        {/* Scrollable Product Details Section */}
        <div 
          className={`business-apps-modal-description-section ${isDetailsRevealed ? 'revealed' : 'hidden'}`}
          onClick={(e) => {
            if (!isDetailsRevealed) {
              e.preventDefault();
              e.stopPropagation();
              setIsDetailsRevealed(true);
            }
          }}
          onTouchEnd={(e) => {
            if (!isDetailsRevealed) {
              e.preventDefault();
              e.stopPropagation();
              setIsDetailsRevealed(true);
            }
          }}
          style={{ cursor: !isDetailsRevealed ? 'pointer' : 'default' }}
        >
          <div className="business-apps-modal-description-content">
            {app.description && (
              <p className="business-apps-modal-description-text">{app.description}</p>
            )}
            {app.features && app.features.length > 0 && (
              <div className="business-apps-modal-features">
                <h4 className="business-apps-modal-features-title">Core Features</h4>
                <div className="business-apps-modal-features-grid">
                  {app.features.map((feature, index) => {
                    const IconComponent = featureIcons[feature.icon];
                    return (
                      <div
                        key={index}
                        className="business-apps-modal-feature-card"
                        style={{
                          animationDelay: `${index * 0.1}s`
                        }}
                      >
                        {IconComponent ? <IconComponent size={20} color="#CDFC2E" /> : null}
                        <span className="business-apps-modal-feature-title">{feature.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {app.tech_stack && app.tech_stack.length > 0 && (
              <div className="business-apps-modal-tech-stack">
                <h4 className="business-apps-modal-tech-title">Technology Stack</h4>
                <div className="business-apps-modal-tech-badges">
                  {app.tech_stack.map((tech, index) => {
                    const techImageMap: Record<string, string> = {
                      'React': '/technology/React.png',
                      'Next.js': '/technology/Next Js.png',
                      'Supabase': '/technology/Supabase.png',
                      'OpenAI API': '/technology/Open AI.png',
                      'Claude': '/technology/Claude.png',
                    };
                    const imagePath = techImageMap[tech];
                    
                    return (
                      <div key={index} className="business-apps-modal-tech-badge">
                        {imagePath ? (
                          <Image
                            src={imagePath}
                            alt={tech}
                            width={100}
                            height={50}
                            className="business-apps-modal-tech-image"
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {app.target_market && (
              <div className="business-apps-modal-target-section">
                <p className="business-apps-modal-target-text">
                  <strong>Designed For:</strong> {app.target_market}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MobileBusinessApps() {
  const [selectedApp, setSelectedApp] = useState<BusinessApp | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [timerProgress, setTimerProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const updateWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setContainerWidth(width);
        }
      };
      updateWidth();
      const resizeObserver = new ResizeObserver(updateWidth);
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  // Auto-advance timer (4 seconds)
  useEffect(() => {
    // Reset timer when slide changes
    setTimerProgress(0);
    
    // Clear any existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Start new timer
    const duration = 4000; // 4 seconds
    const interval = 50; // Update every 50ms for smooth animation
    const steps = duration / interval;
    let step = 0;

    timerIntervalRef.current = setInterval(() => {
      step++;
      const progress = (step / steps) * 100;
      setTimerProgress(progress);

      if (step >= steps) {
        // Timer complete - advance to next slide
        setCurrentIndex((prev) => (prev + 1) % mockBusinessApps.length);
        clearInterval(timerIntervalRef.current!);
      }
    }, interval);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [currentIndex]);

  const handleCardClick = (app: BusinessApp) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApp(null);
  };

  const handlePrev = () => {
    setIsAnimating(true);
    setCurrentIndex(prev => prev === 0 ? mockBusinessApps.length - 1 : prev - 1);
    setTimeout(() => setIsAnimating(false), 800);
  };
  const handleNext = () => {
    setIsAnimating(true);
    setCurrentIndex(prev => (prev + 1) % mockBusinessApps.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(false);
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    const diffX = touchStartX.current - touchCurrentX;
    const diffY = touchStartY.current - touchCurrentY;
    
    // Check if horizontal swipe is greater than vertical (to avoid conflicts with vertical scroll)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      setIsDragging(true);
      isDraggingRef.current = true;
      e.preventDefault(); // Prevent vertical scroll during horizontal swipe
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) {
      touchStartX.current = null;
      touchStartY.current = null;
      setIsDragging(false);
      isDraggingRef.current = false;
      return;
    }

    // Check if the touch target is a button (navigation arrow)
    const target = e.target as HTMLElement;
    if (target.closest('.business-apps-mobile-device-arrow')) {
      // Don't open modal if clicking on navigation button
      touchStartX.current = null;
      touchStartY.current = null;
      setIsDragging(false);
      isDraggingRef.current = false;
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;
    const threshold = 50; // Minimum swipe distance

    const wasDragging = isDraggingRef.current;
    setIsDragging(false);
    isDraggingRef.current = false;

    if (Math.abs(diffX) > threshold && wasDragging) {
      // Swipe detected - navigate
      setIsAnimating(true);
      if (diffX > 0) {
        // Swipe left - go to next
        setCurrentIndex(prev => (prev + 1) % mockBusinessApps.length);
      } else {
        // Swipe right - go to previous
        setCurrentIndex(prev => prev === 0 ? mockBusinessApps.length - 1 : prev - 1);
      }
      setTimeout(() => setIsAnimating(false), 800);
    } else if (!wasDragging && Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
      // Tap detected - open modal (only if not on a button)
      handleCardClick(currentApp);
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };


  const currentApp = mockBusinessApps[currentIndex];
  const currentVimeoStart = currentApp?.vimeo_id === '1151206257' ? '#t=10s' : '';

  return (
    <section className="business-apps-section">
      <div className="business-apps-container">
        <div className="business-apps-header">
          <p className="business-apps-eyebrow">OUR WORK</p>
          <h2 className="business-apps-title">Business Apps</h2>
        </div>

        {/* Desktop-style Device Mockup */}
        <div className="business-apps-mobile-device-container">
          <div 
            className="business-apps-mobile-device-wrapper"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              ref={frameRef}
              className={`business-apps-mobile-device-frame ${isAnimating ? 'ambient-move' : ''}`}
              onClick={(e) => {
                handleCardClick(currentApp);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div 
                className="business-apps-mobile-device-screen"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(currentApp);
                }}
                style={{ cursor: 'pointer', position: 'relative', zIndex: 3 }}
              >
                {/* Loading Background Thumbnail */}
                {currentApp.thumbnail_url && (
                  <Image
                    src={currentApp.thumbnail_url}
                    alt={currentApp.product_name}
                    fill
                    className="business-apps-mobile-device-thumbnail"
                    priority
                    sizes="(max-width: 768px) 272px, 272px"
                  />
                )}
                {currentApp.vimeo_id ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${currentApp.vimeo_id}?autoplay=1&loop=1&controls=0&title=0&byline=0&portrait=0&muted=1&background=1${currentVimeoStart}`}
                    className="business-apps-mobile-device-video"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : currentApp.video_url ? (
                  <video
                    src={currentApp.video_url}
                    className="business-apps-mobile-device-video"
                    loop
                    muted
                    playsInline
                    autoPlay
                  />
                ) : null}
              </div>
            </div>
            <button
              className="business-apps-mobile-device-arrow business-apps-mobile-device-arrow-left"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous product"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              className="business-apps-mobile-device-arrow business-apps-mobile-device-arrow-right"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next product"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            <div className="business-apps-mobile-device-glow"></div>
          </div>
          
          {/* Timer Progress Bar with Frosted Glass Container */}
          <div className="business-apps-mobile-timer-container-main">
            <div className="business-apps-mobile-timer-line-main">
              <div 
                className="business-apps-mobile-timer-progress-main"
                style={{ width: `${timerProgress}%` }}
              />
            </div>
            {/* Frosted Glass Product Info Container */}
            <div 
              className="business-apps-mobile-product-preview-glass"
              onClick={() => handleCardClick(currentApp)}
              style={{ cursor: 'pointer' }}
            >
              <div className="business-apps-mobile-product-preview-content">
                <div className="business-apps-mobile-product-preview-text">
                  <h3 className="business-apps-mobile-product-name-preview">{currentApp.product_name}</h3>
                  <p className="business-apps-mobile-product-tagline-preview">{currentApp.tagline}</p>
                </div>
                <button 
                  className="business-apps-mobile-product-preview-arrow"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(currentApp);
                  }}
                  aria-label="View product details"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
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

