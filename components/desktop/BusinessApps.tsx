'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { featureIcons } from '@/components/shared/Icons';
import ComingSoonModal from '@/components/ComingSoonModal/ComingSoonModal';
import './BusinessApps.css';

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  icon: keyof typeof featureIcons;
  title: string;
  description: string;
}

interface BusinessApp {
  id: string;
  product_name: string;
  tagline: string;
  description: string;
  video_url?: string;
  vimeo_id?: string;
  case_study_url: string;
  live_demo_url?: string;
  thumbnail_url?: string;
  features: Feature[];
  tech_stack: string[];
  target_market?: string;
}

// Mock data with detailed information
const mockBusinessApps: BusinessApp[] = [
  {
    id: '1',
    product_name: 'PROXe',
    tagline: 'AI-powered operating system for growing businesses',
    description: 'An intelligent AI-powered system for business automation with real-time analytics, custom workflow builder, and multi-platform integration.',
    vimeo_id: '1151323707',
    thumbnail_url: '/product thumbnail/PROXe Cover.webp',
    case_study_url: '/work/proxe',
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
    tech_stack: ['React', 'Next.js', 'Supabase', 'OpenAI API'],
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
    tech_stack: ['React', 'Next.js', 'Supabase'],
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
    tech_stack: ['React', 'Next.js', 'Supabase'],
    target_market: 'Aviation training institutes and pilot schools needing streamlined student onboarding and conversion tracking'
  },
  {
    id: '4',
    product_name: 'Adiploi Kitchen',
    tagline: 'Smart restaurant platform with WhatsApp ordering',
    description: 'Complete restaurant management solution with table reservations, menu management, order tracking, and customer loyalty programs.',
    vimeo_id: '1151324148',
    thumbnail_url: '/product thumbnail/Adipoli Thumbnail.webp',
    case_study_url: '/work/adiploi-kitchen',
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
    tech_stack: ['React', 'Next.js', 'Supabase'],
    target_market: 'Restaurants and cloud kitchens who want direct customer orders without third-party commissions'
  }
];


export default function DesktopBusinessApps() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timerProgress, setTimerProgress] = useState(0);
  // PHASE 2: Coming Soon modal state
  const [showComingSoon, setShowComingSoon] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLIFrameElement | null)[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentApp = mockBusinessApps[currentIndex];
  const currentVimeoStart = currentApp?.vimeo_id === '1151206257' ? '#t=10s' : '';

  // Fetch from API (optional - uncomment when ready)
  useEffect(() => {
    // const fetchBusinessApps = async () => {
    //   try {
    //     const response = await fetch('/api/work?category=tech&featured=true&status=published');
    //     const result = await response.json();
    //     if (result.data && result.data.length > 0) {
    //       // Transform API data to match BusinessApp interface
    //       // setBusinessApps(result.data);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching business apps:', error);
    //   }
    // };
    // fetchBusinessApps();
  }, []);

  // Animation on scroll
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate device mockup
      if (deviceRef.current) {
        gsap.fromTo(
          deviceRef.current,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      // Animate content
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
      // Toggle arrow highlight when the section is in view
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleClass: { targets: '.business-apps-device-arrow', className: 'highlight' }
        });
      }
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  // Auto-advance timer (6 seconds)
  useEffect(() => {
    // Reset timer when slide changes
    setTimerProgress(0);
    
    // Clear any existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Start new timer
    const duration = 10000; // 10 seconds
    const interval = 50; // Update every 50ms for smooth animation
    const steps = duration / interval;
    let step = 0;

    timerIntervalRef.current = setInterval(() => {
      step++;
      const progress = (step / steps) * 100;
      setTimerProgress(progress);

      if (step >= steps) {
        // Timer complete - advance to next slide
        setCurrentIndex((prev) => (prev === mockBusinessApps.length - 1 ? 0 : prev + 1));
        clearInterval(timerIntervalRef.current!);
      }
    }, interval);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [currentIndex]);

  // Animate on carousel change
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        }
      );
    }

    // rotate only the visual frame so arrows remain stationary
    if (frameRef.current) {
      gsap.to(frameRef.current, {
        rotation: 2,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    }
  }, [currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? mockBusinessApps.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === mockBusinessApps.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section ref={sectionRef} className="business-apps-desktop-section">
      <div className="business-apps-desktop-container">
        {/* Header */}
        <div className="business-apps-desktop-header">
          <p className="business-apps-eyebrow">OUR WORK</p>
          <h2 className="business-apps-desktop-title">Business Apps</h2>
        </div>

        {/* Main Content - Split Screen */}
        <div className="business-apps-desktop-content">
          {/* Left Side - Device Mockup */}
          <div className="business-apps-left-column">
            <div ref={deviceRef} className="business-apps-device-container">
              <div ref={frameRef} className="business-apps-device-frame">
                <div className="business-apps-device-screen">
                  {/* Loading Background Thumbnail */}
                  {currentApp.thumbnail_url && (
                    <Image
                      src={currentApp.thumbnail_url}
                      alt={currentApp.product_name}
                      fill
                      className="business-apps-device-thumbnail"
                      priority
                    />
                  )}
                  {currentApp.vimeo_id ? (
                    <iframe
                      ref={(el) => { videoRefs.current[currentIndex] = el; }}
                      src={`https://player.vimeo.com/video/${currentApp.vimeo_id}?autoplay=${isPlaying ? 1 : 0}&loop=1&controls=0&title=0&byline=0&portrait=0&muted=1&background=1${currentVimeoStart}`}
                      className="business-apps-device-video"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  ) : currentApp.video_url ? (
                    <video
                      src={currentApp.video_url}
                      className="business-apps-device-video"
                      loop
                      muted
                      playsInline
                      autoPlay={isPlaying}
                    />
                  ) : null}
                  {/* play toggle removed: controlled via autoplay and timer */}
                </div>
              </div>
              <button
                className="business-apps-device-arrow business-apps-device-arrow-left"
                onClick={handlePrevious}
                aria-label="Previous product"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <button
                className="business-apps-device-arrow business-apps-device-arrow-right"
                onClick={handleNext}
                aria-label="Next product"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
              <div className="business-apps-device-glow"></div>
            </div>
            
            {/* Timer Progress Bar - Below Device */}
            <div className="business-apps-timer-container">
              <div className="business-apps-timer-line">
                <div 
                  className="business-apps-timer-progress"
                  style={{ width: `${timerProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div ref={contentRef} className="business-apps-details-container">
            {/* Product Header */}
            <div className="business-apps-product-header">
              <h3 className="business-apps-product-name">{currentApp.product_name}</h3>
              <p className="business-apps-product-tagline">{currentApp.tagline}</p>
            </div>

            {/* Features Section */}
            <div className="business-apps-features-section">
              <h4 className="business-apps-features-title">Core Features</h4>
              <div className="business-apps-features-grid">
                {currentApp.features.map((feature, index) => {
                  const IconComponent = featureIcons[feature.icon];
                  return (
                    <div
                      key={index}
                      className="business-apps-feature-card"
                      style={{
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      {IconComponent ? <IconComponent size={20} color="#CDFC2E" /> : null}
                      <span className="business-apps-feature-title">{feature.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="business-apps-tech-section">
              <h4 className="business-apps-tech-title">Technology Stack</h4>
              <div className="business-apps-tech-badges">
                {currentApp.tech_stack.map((tech, index) => {
                  const techImageMap: Record<string, string> = {
                    'React': '/technology/React.png',
                    'Next.js': '/technology/Next Js.png',
                    'Supabase': '/technology/Supabase.png',
                    'OpenAI API': '/technology/Open AI.png',
                    'Claude': '/technology/Claude.png',
                  };
                  const imagePath = techImageMap[tech];
                  
                  return (
                    <div key={index} className="business-apps-tech-badge">
                      {imagePath ? (
                        <Image
                          src={imagePath}
                          alt={tech}
                          width={100}
                          height={50}
                          className="business-apps-tech-image"
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Designed For (if available) */}
            {currentApp.target_market && (
              <div className="business-apps-target-section">
                <p className="business-apps-target-text">
                  <strong>Designed For:</strong> {currentApp.target_market}
                </p>
              </div>
            )}

          </div>
        </div>

        {/* bottom navigation removed */}
      </div>

      {/* PHASE 2: Coming Soon Modal */}
      <ComingSoonModal isOpen={showComingSoon} onClose={() => setShowComingSoon(false)} />
    </section>
  );
}
