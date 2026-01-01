'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ServicesGrid.css';

gsap.registerPlugin(ScrollTrigger);

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
}

export default function ServicesGrid() {
  const router = useRouter();
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const services: Service[] = [
    {
      id: 1,
      title: 'AI in Business',
      description: 'Turn your business into an intelligent system.',
      image: '/BRain.png'
    },
    {
      id: 2,
      title: 'Brand Marketing',
      description: 'Marketing that thinks, adapts, and performs.',
      image: '/Gulb Icon.png'
    },
    {
      id: 3,
      title: 'Business Apps',
      description: 'Digital platforms built to learn and convert.',
      image: '/Business Apps.png'
    }
  ];

  useEffect(() => {
    // Let CSS handle the initial entrance animation
    // GSAP will handle scroll-triggered animations if needed
    cardsRef.current.forEach((card) => {
      if (card) {
        // Ensure cards are visible after CSS animation completes
        gsap.set(card, { clearProps: 'all' });
      }
    });
  }, []);

  // Handle scroll to service when navigating from another page with hash
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#service-')) {
        const serviceId = hash.replace('#service-', '');
        setTimeout(() => {
          const element = document.getElementById(`service-${serviceId}`);
          if (element) {
            // Scroll to the beginning of the service section with offset for header
            // This ensures heading and content are visible
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 500);
      }
    };

    // Check on mount
    handleHashScroll();

    // Also listen for hash changes
    window.addEventListener('hashchange', handleHashScroll);
    
    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
    };
  }, []);

  // Handle click outside to deselect card on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectedCard && window.innerWidth <= 1024) {
        // Check if click is outside any service card
        const target = e.target as HTMLElement;
        const clickedCard = target.closest('.service-card');
        if (!clickedCard) {
          setSelectedCard(null);
        }
      }
    };

    if (selectedCard) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [selectedCard]);


  return (
    <div className="services-grid-container" ref={gridRef}>
      <div className="services-grid">
        {services.map((service, index) => {
          const isEven = index % 2 === 0;
          const isSelected = selectedCard === service.id;
          
          const handleCardClick = (e: React.MouseEvent) => {
            const isMobile = window.innerWidth <= 1024;
            if (isMobile) {
              // Mobile: two-step process
              if (isSelected) {
                // Second click: navigate to service page
                e.preventDefault();
                router.push(`/services#service-${service.id}`);
                // Scroll to the service section after navigation
                setTimeout(() => {
                  const element = document.getElementById(`service-${service.id}`);
                  if (element) {
                    // Scroll to the beginning of the service section with offset for header
                    // This ensures heading and content are visible
                    const headerOffset = 100;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }, 300);
                setSelectedCard(null); // Reset selection after navigation
              } else {
                // First click: activate card (show accent light and button)
                e.preventDefault();
                setSelectedCard(service.id);
              }
            } else {
              // Desktop: navigate immediately
              e.preventDefault();
              router.push(`/services#service-${service.id}`);
              // Scroll to the service section after navigation
              setTimeout(() => {
                const element = document.getElementById(`service-${service.id}`);
                if (element) {
                  // Scroll to the beginning of the service section with offset for header
                  // This ensures heading and content are visible
                  const headerOffset = 100;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                  
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                }
              }, 300);
            }
          };

          return (
            <div 
              key={service.id} 
              className={`service-card ${isEven ? 'service-card-left' : 'service-card-right'} ${isSelected ? 'service-card-selected' : ''}`}
              ref={(el) => (cardsRef.current[index] = el)}
              onClick={handleCardClick}
            >
              <div className="service-content">
                <div className="service-image">
                  {service.image ? (
                    <img 
                      src={service.image} 
                      alt={service.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  ) : (
                    <div className="service-image-placeholder"></div>
                  )}
                </div>
                <div className="service-text">
                  <h3 className="service-title">{service.title}</h3>
                  {service.description && (
                    <p className="service-description">{service.description}</p>
                  )}
                </div>
              </div>
              <div className="service-arrow">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 15L15 5M15 5H8M15 5V12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

