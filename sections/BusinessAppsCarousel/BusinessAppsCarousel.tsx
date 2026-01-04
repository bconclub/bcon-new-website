'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'motion/react';
import './BusinessAppsCarousel.css';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface BusinessApp {
  id: string;
  product_name: string;
  product_type: string;
  video_url?: string;
  vimeo_id?: string;
  tagline: string;
  description: string;
  features: Feature[];
  tech_stack: string[];
  target_market?: string;
  cta_primary?: string;
  cta_secondary?: string;
}

// Helper function to get tech image path
const getTechImage = (techName: string): string | null => {
  const techImageMap: Record<string, string> = {
    'React': '/technology/React.png',
    'Next.js': '/technology/Next Js.png',
    'Next Js': '/technology/Next Js.png',
    'Claude': '/technology/Claude.png',
  };
  
  // Try exact match first
  if (techImageMap[techName]) {
    return techImageMap[techName];
  }
  
  // Try case-insensitive match
  const lowerTech = techName.toLowerCase();
  for (const [key, value] of Object.entries(techImageMap)) {
    if (key.toLowerCase() === lowerTech) {
      return value;
    }
  }
  
  return null;
};

// Icon components
const getIcon = (iconName: string) => {
  const icons = {
    'clipboard-check': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <path d="M9 14l2 2 4-4"/>
      </svg>
    ),
    'calendar-check': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <path d="M9 16l2 2 4-4"/>
      </svg>
    ),
    'trending-up': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    'users': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    'activity': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    'layers': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
    'zap': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    'shield': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    'sparkles': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.5-6.5l-.7.7M6.2 17.8l-.7.7m12.1-.7l.7.7M6.9 6.2l-.7.7M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/>
      </svg>
    ),
    'calendar': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    'layout-dashboard': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    'user-circle': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    'message-circle': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    ),
    'refresh-cw': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/>
        <polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>
    ),
    'settings': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
      </svg>
    ),
    'dollar-sign': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  };
  return icons[iconName] || icons['activity'];
};

// Mock data - replace with Supabase query
const mockBusinessApps: BusinessApp[] = [
  {
    id: '1',
    product_name: 'PROXe',
    product_type: 'Business AI System',
    vimeo_id: '1151323707',
    tagline: 'AI-powered operating system for growing businesses',
    description: 'Complete AI infrastructure that gives businesses intelligent capabilities without hiring aggressively. 24/7 AI assistants handle inquiries, qualify leads, and book meetings automatically across multiple channels.',
    features: [
      {
        icon: 'activity',
        title: '24/7 Intelligence',
        description: 'AI assistants that never sleep — handle inquiries, qualify leads, book meetings automatically'
      },
      {
        icon: 'layers',
        title: 'Multi-Channel',
        description: 'Works across website, WhatsApp, email, and voice — seamless experience'
      },
      {
        icon: 'zap',
        title: 'Smart Automation',
        description: 'Learns from every interaction, gets smarter with use, adapts to your business'
      },
      {
        icon: 'shield',
        title: 'Enterprise Security',
        description: 'Bank-level encryption, SOC 2 compliant, full data ownership'
      }
    ],
    tech_stack: ['React', 'Next.js', 'Supabase', 'OpenAI', 'Claude', 'WhatsApp API'],
    target_market: 'Growing businesses needing intelligent automation without aggressive hiring',
    cta_primary: '/work/proxe',
    cta_secondary: '/demo/proxe'
  },
  {
    id: '2',
    product_name: 'Turquoise Holidays',
    product_type: 'Travel Platform',
    vimeo_id: '1151323881',
    tagline: 'AI-powered travel platform with intelligent booking',
    description: 'Complete travel website with AI itinerary generation. Drop a document, system creates packages automatically. Real-time booking, instant confirmations, and automated payment processing.',
    features: [
      {
        icon: 'sparkles',
        title: 'AI Itinerary Builder',
        description: 'Drop documents, AI creates complete travel packages with pricing, activities, bookings'
      },
      {
        icon: 'calendar',
        title: 'Real-Time Booking',
        description: 'Live availability, instant confirmations, automated payment processing'
      },
      {
        icon: 'layout-dashboard',
        title: 'Smart Admin',
        description: 'Manage packages, track bookings, analytics — all in one dashboard'
      },
      {
        icon: 'user-circle',
        title: 'Customer Portal',
        description: 'Travelers view itineraries, make payments, get real-time updates'
      }
    ],
    tech_stack: ['Next.js', 'React', 'Supabase', 'OpenAI', 'Stripe', 'Razorpay'],
    target_market: 'Travel agencies and tour operators needing automated package creation and booking',
    cta_primary: '/work/turquoise-holidays'
  },
  {
    id: '3',
    product_name: 'Adipoli Restaurant',
    product_type: 'Restaurant Platform',
    vimeo_id: '1151324148',
    tagline: 'Smart restaurant platform with WhatsApp ordering',
    description: 'Modern restaurant website with real-time updates and direct WhatsApp ordering. No commissions. Update daily specials and events in real-time — changes appear instantly.',
    features: [
      {
        icon: 'message-circle',
        title: 'WhatsApp Ordering',
        description: 'Customers order directly via WhatsApp — no app download, no commissions'
      },
      {
        icon: 'refresh-cw',
        title: 'Live Feature Display',
        description: 'Update daily specials, events in real-time — changes appear instantly'
      },
      {
        icon: 'settings',
        title: 'Smart Admin',
        description: 'Manage menu, track orders, update features — complete control in one dashboard'
      },
      {
        icon: 'dollar-sign',
        title: 'Zero Commission',
        description: 'Own your customer relationship, keep 100% revenue, no middleman'
      }
    ],
    tech_stack: ['Next.js', 'React', 'Supabase', 'WhatsApp Business API'],
    target_market: 'Restaurants wanting direct customer relationships without third-party platforms',
    cta_primary: '/work/adipoli-restaurant'
  },
  {
    id: '4',
    product_name: 'Pilot Academy',
    product_type: 'Training Platform',
    vimeo_id: '1151206257',
    tagline: 'Complete pilot onboarding platform',
    description: 'Custom onboarding microsite for pilot training with tests, booking, and instructor dashboard. Full Meta Ads pixel integration with UTM tracking and ROI analytics.',
    features: [
      {
        icon: 'clipboard-check',
        title: 'Assessment Engine',
        description: 'Custom tests to qualify aspiring pilots — automated scoring and filtering'
      },
      {
        icon: 'calendar-check',
        title: 'Booking Intelligence',
        description: 'Real-time availability, automated confirmations, calendar sync for instructors'
      },
      {
        icon: 'trending-up',
        title: 'Conversion Tracking',
        description: 'Full Meta Ads integration with pixel tracking, UTM parameters, ROI analytics'
      },
      {
        icon: 'users',
        title: 'Instructor Dashboard',
        description: 'Manage students, track progress, schedule sessions — complete control'
      }
    ],
    tech_stack: ['React', 'Next.js', 'Supabase', 'Custom Testing Engine', 'Meta Ads API'],
    target_market: 'Aviation training institutes and pilot schools needing streamlined onboarding and conversion tracking',
    cta_primary: '/work/pilot-academy'
  }
];

export default function BusinessAppsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [businessApps, setBusinessApps] = useState<BusinessApp[]>(mockBusinessApps);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    features: false,
    tech: false,
    target: false
  });
  const [expandedMobileItems, setExpandedMobileItems] = useState<Record<string, boolean>>({});
  const [expandedMobileSections, setExpandedMobileSections] = useState<Record<string, Record<string, boolean>>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  
  // Mobile carousel refs
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | HTMLIFrameElement | null)[]>([]);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [mobileCurrentIndex, setMobileCurrentIndex] = useState(0);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleMobileItem = (appId: string) => {
    setExpandedMobileItems(prev => ({
      ...prev,
      [appId]: !prev[appId]
    }));
  };

  const toggleMobileSection = (appId: string, section: string) => {
    setExpandedMobileSections(prev => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        [section]: !prev[appId]?.[section]
      }
    }));
  };

  // Mobile carousel handlers
  const handleMobileNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setModalOpen(false); // Close modal when changing cards
    setMobileCurrentIndex((prev) => (prev + 1) % businessApps.length);
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating, businessApps.length]);

  const handleMobilePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setModalOpen(false); // Close modal when changing cards
    setMobileCurrentIndex((prev) => (prev - 1 + businessApps.length) % businessApps.length);
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating, businessApps.length]);

  const handleMobileDotClick = useCallback((index: number) => {
    if (isAnimating || index === mobileCurrentIndex) return;
    setIsAnimating(true);
    setModalOpen(false); // Close modal when changing cards
    setMobileCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating, mobileCurrentIndex]);

  // Touch handlers for swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleMobileNext();
    } else if (isRightSwipe) {
      handleMobilePrev();
    }
  };

  // Mouse/trackpad wheel handler for navigation
  useEffect(() => {
    const carouselElement = mobileCarouselRef.current;
    if (!carouselElement) return;

    const handleWheel = (e: WheelEvent) => {
      // Only handle horizontal scrolling
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        if (e.deltaX > 0) {
          handleMobileNext();
        } else {
          handleMobilePrev();
        }
      }
    };

    carouselElement.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      carouselElement.removeEventListener('wheel', handleWheel);
    };
  }, [handleMobileNext, handleMobilePrev]);

  // Video autoplay with IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    mobileCardRefs.current.forEach((cardRef, index) => {
      if (!cardRef) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const videoRef = videoRefs.current[index];
            if (!videoRef) return;

            if (entry.isIntersecting && index === mobileCurrentIndex) {
              // Card is visible and active - play video
              if (videoRef instanceof HTMLVideoElement) {
                videoRef.play().catch(() => {
                  // Autoplay failed, ignore
                });
              }
            } else {
              // Card is not visible or inactive - pause video
              if (videoRef instanceof HTMLVideoElement) {
                videoRef.pause();
              }
            }
          });
        },
        {
          threshold: 0.5,
          rootMargin: '0px'
        }
      );

      observer.observe(cardRef);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [mobileCurrentIndex, businessApps.length]);

  // Center modal when opened
  useEffect(() => {
    if (modalOpen && modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      setModalPosition({
        x: (windowWidth - rect.width) / 2,
        y: (windowHeight - rect.height) / 2
      });
    } else {
      // Reset position when closed
      setModalPosition({ x: 0, y: 0 });
    }
  }, [modalOpen]);

  // Handle modal drag
  const handleModalTouchStart = (e: React.TouchEvent) => {
    if (!modalRef.current) return;
    setIsDragging(true);
    const touch = e.touches[0];
    const rect = modalRef.current.getBoundingClientRect();
    setDragStart({
      x: touch.clientX - rect.left - modalPosition.x,
      y: touch.clientY - rect.top - modalPosition.y
    });
  };

  const handleModalTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !modalRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const rect = modalRef.current.getBoundingClientRect();
    
    let newX = touch.clientX - dragStart.x;
    let newY = touch.clientY - dragStart.y;
    
    // Keep modal within viewport
    newX = Math.max(0, Math.min(newX, windowWidth - rect.width));
    newY = Math.max(0, Math.min(newY, windowHeight - rect.height));
    
    setModalPosition({ x: newX, y: newY });
  };

  const handleModalTouchEnd = () => {
    setIsDragging(false);
  };

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % businessApps.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, businessApps.length]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + businessApps.length) % businessApps.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, businessApps.length]);

  const handleDotClick = useCallback((index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const currentApp = businessApps[currentIndex];

  if (businessApps.length === 0) {
    return null;
  }

  return (
    <section className="business-apps-section" aria-label="Business Apps" ref={containerRef}>
      <div className="business-apps-container">
        {/* Header */}
        <motion.div
          className="business-apps-header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="business-apps-eyebrow">OUR WORK</p>
          <h2 className="business-apps-title">Business Apps</h2>
        </motion.div>

        {/* Mobile Carousel - Only visible on <768px */}
        <div className="business-apps-mobile-carousel-wrapper">
          <div
            className="business-apps-mobile-carousel"
            ref={mobileCarouselRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{
              transform: `translateX(-${mobileCurrentIndex * 100}%)`,
              transition: isAnimating ? 'transform 0.4s ease-in-out' : 'none',
              touchAction: 'pan-x'
            }}
          >
            {businessApps.map((app, index) => {
              const isActive = index === mobileCurrentIndex;
              return (
                <div
                  key={app.id}
                  ref={(el) => {
                    mobileCardRefs.current[index] = el;
                  }}
                  className={`business-apps-mobile-card ${isActive ? 'active' : 'inactive'}`}
                >
                  {/* 1. VIDEO SECTION */}
                  <div className="business-apps-mobile-video-section">
                    {app.vimeo_id ? (
                      <iframe
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        src={`https://player.vimeo.com/video/${app.vimeo_id}?autoplay=${isActive ? 1 : 0}&loop=1&controls=0&title=0&byline=0&portrait=0&muted=1&background=${isActive ? 1 : 0}`}
                        className="business-apps-mobile-video"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        style={{
                          opacity: isActive ? 1 : 0.6,
                          transition: 'opacity 0.5s ease'
                        }}
                      />
                    ) : app.video_url ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        src={app.video_url}
                        className="business-apps-mobile-video"
                        autoPlay={isActive}
                        loop
                        muted
                        playsInline
                        style={{
                          opacity: isActive ? 1 : 0.6,
                          transition: 'opacity 0.5s ease'
                        }}
                      />
                    ) : null}
                  </div>

                  {/* 2. CONTENT SECTION */}
                  <div className="business-apps-mobile-content-section">
                    {/* Header - Clickable to open modal */}
                    <div className="business-apps-mobile-header">
                      <div 
                        className="business-apps-mobile-header-content"
                        onClick={() => setModalOpen(true)}
                      >
                        <h3 className="business-apps-mobile-product-name">
                          {app.product_name}
                          <svg 
                            className="business-apps-mobile-lightning-icon"
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                          </svg>
                        </h3>
                        <p className="business-apps-mobile-product-tagline">{app.tagline}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows - Mobile */}
          <button
            className="business-apps-mobile-nav-arrow business-apps-mobile-nav-arrow-left"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleMobilePrev();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            aria-label="Previous product"
            disabled={isAnimating}
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <button
            className="business-apps-mobile-nav-arrow business-apps-mobile-nav-arrow-right"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleMobileNext();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            aria-label="Next product"
            disabled={isAnimating}
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className="business-apps-mobile-dots">
            {businessApps.map((_, index) => (
              <button
                key={index}
                className={`business-apps-mobile-dot ${index === mobileCurrentIndex ? 'active' : ''}`}
                onClick={() => handleMobileDotClick(index)}
                aria-label={`Go to product ${index + 1}`}
                aria-current={index === mobileCurrentIndex}
              />
            ))}
          </div>
        </div>

        {/* Product Display Card - Desktop Only */}
        <div className="business-apps-card-wrapper business-apps-desktop-only">
          <motion.div
            className="business-apps-card"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
          <div className="business-apps-card-content">
            {/* Left Side - Device Mockup */}
            <motion.div
              ref={mockupRef}
              className="business-apps-mockup-container"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            >
              <div className="business-apps-phone-frame">
                {/* Notch */}
                <div className="business-apps-phone-notch"></div>
                
                {/* Screen */}
                <div className="business-apps-phone-screen">
                  {currentApp.vimeo_id ? (
                    <iframe
                      key={currentApp.id}
                      src={`https://player.vimeo.com/video/${currentApp.vimeo_id}?autoplay=1&loop=1&controls=0&title=0&byline=0&portrait=0&muted=1&background=1`}
                      className="business-apps-screen-video"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      style={{
                        opacity: isAnimating ? 0 : 1,
                        transition: 'opacity 0.5s ease'
                      }}
                    />
                  ) : currentApp.video_url ? (
                    <video
                      key={currentApp.id}
                      src={currentApp.video_url}
                      className="business-apps-screen-video"
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        opacity: isAnimating ? 0 : 1,
                        transition: 'opacity 0.5s ease'
                      }}
                    />
                  ) : null}
                </div>
              </div>
              
              {/* Glow Effect */}
              <div className="business-apps-mockup-glow"></div>
            </motion.div>

            {/* Right Side - Product Info */}
            <motion.div
              className="business-apps-product-info"
              key={currentApp.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {/* Product Header */}
              <div className="business-apps-product-header">
                <h3 className="business-apps-product-name">{currentApp.product_name}</h3>
                <p className="business-apps-product-tagline">{currentApp.tagline}</p>
              </div>

              {/* Features Section */}
              <div className="business-apps-features-section">
                <button
                  className="business-apps-accordion-header"
                  onClick={() => toggleSection('features')}
                  aria-expanded={expandedSections.features}
                >
                  <h4 className="business-apps-features-title">Core Features</h4>
                  <svg
                    className="business-apps-accordion-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      transform: expandedSections.features ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <motion.div
                  className="business-apps-accordion-content"
                  initial={false}
                  animate={{
                    height: expandedSections.features ? 'auto' : 0,
                    opacity: expandedSections.features ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="business-apps-features-list">
                    {currentApp.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        className="business-apps-feature-item"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      >
                        <div className="business-apps-feature-icon">
                          {getIcon(feature.icon)}
                        </div>
                        <div className="business-apps-feature-content">
                          <h5 className="business-apps-feature-title">{feature.title}</h5>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Tech Stack */}
              <div className="business-apps-tech-stack">
                <button
                  className="business-apps-accordion-header"
                  onClick={() => toggleSection('tech')}
                  aria-expanded={expandedSections.tech}
                >
                  <h4 className="business-apps-tech-title">Technology Stack</h4>
                  <svg
                    className="business-apps-accordion-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      transform: expandedSections.tech ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <motion.div
                  className="business-apps-accordion-content"
                  initial={false}
                  animate={{
                    height: expandedSections.tech ? 'auto' : 0,
                    opacity: expandedSections.tech ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="business-apps-tech-badges">
                    {currentApp.tech_stack.map((tech, index) => {
                      const techImage = getTechImage(tech);
                      return (
                        <motion.div
                          key={index}
                          className="business-apps-tech-badge"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 1.1 + index * 0.05 }}
                        >
                          {techImage ? (
                            <img
                              src={techImage}
                              alt={tech}
                              className="business-apps-tech-image"
                            />
                          ) : (
                            <span className="business-apps-tech-text">{tech}</span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Target Market (Optional) */}
              {currentApp.target_market && (
                <div className="business-apps-target-market">
                  <button
                    className="business-apps-accordion-header"
                    onClick={() => toggleSection('target')}
                    aria-expanded={expandedSections.target}
                  >
                    <h4 className="business-apps-target-title">Target Market</h4>
                    <svg
                      className="business-apps-accordion-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{
                        transform: expandedSections.target ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  <motion.div
                    className="business-apps-accordion-content"
                    initial={false}
                    animate={{
                      height: expandedSections.target ? 'auto' : 0,
                      opacity: expandedSections.target ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="business-apps-target-text">
                      {currentApp.target_market}
                    </p>
                  </motion.div>
                </div>
              )}

              {/* CTAs */}
              <div className="business-apps-ctas">
                {currentApp.cta_primary && (
                  <a href={currentApp.cta_primary} className="business-apps-cta-primary">
                    View Full Case Study →
                  </a>
                )}
                {currentApp.cta_secondary && (
                  <a href={currentApp.cta_secondary} className="business-apps-cta-secondary">
                    See Live Demo →
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Navigation - Arrows on Sides of Card - Desktop Only */}
        <motion.button
          className="business-apps-nav-arrow business-apps-nav-arrow-left"
          onClick={handlePrev}
          aria-label="Previous product"
          disabled={isAnimating}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </motion.button>

        <motion.button
          className="business-apps-nav-arrow business-apps-nav-arrow-right"
          onClick={handleNext}
          aria-label="Next product"
          disabled={isAnimating}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </motion.button>

        {/* Dots Navigation - Centered - Desktop Only */}
        <motion.div
          className="business-apps-dots-container"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="business-apps-dots">
            {businessApps.map((_, index) => (
              <button
                key={index}
                className={`business-apps-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to product ${index + 1}`}
                aria-current={index === currentIndex}
              />
            ))}
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
