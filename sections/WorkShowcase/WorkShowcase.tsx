'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './WorkShowcase.css';

gsap.registerPlugin(ScrollTrigger);

interface WorkItem {
  id: number;
  title: string;
  description: string;
  image?: string;
  video?: string;
  link?: string;
}

interface WorkShowcaseProps {
  title: string;
  subtitle?: string;
  items: WorkItem[];
  accentColor?: string;
  layout?: 'left' | 'right'; // 'left' = work on left, text on right | 'right' = work on right, text on left
}

export default function WorkShowcase({
  title,
  subtitle,
  items,
  accentColor = '#CCFF00',
  layout = 'left'
}: WorkShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate items on scroll
    itemsRef.current.forEach((item, index) => {
      if (item) {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 60,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              end: 'top 50%',
              toggleActions: 'play none none reverse'
            },
            delay: index * 0.1
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [items]);

  const handleItemClick = (item: WorkItem) => {
    if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className={`work-showcase-section work-showcase-${layout}`} ref={sectionRef}>
      <div className="work-showcase-container">
        <div className="work-showcase-header">
          <h2 className="work-showcase-title">{title}</h2>
          {subtitle && <p className="work-showcase-subtitle">{subtitle}</p>}
        </div>
        
        <div className="work-showcase-split">
          {/* Work Media Side */}
          <div className="work-showcase-media-side">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="work-showcase-media-item"
                 ref={(el) => { itemsRef.current[index] = el; }}
                onClick={() => handleItemClick(item)}
                style={{ cursor: item.link ? 'pointer' : 'default' }}
              >
                <div className="work-item-media">
                  {item.video ? (
                    <video
                      src={item.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="work-item-video"
                    />
                  ) : item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="work-item-image"
                    />
                  ) : (
                    <div className="work-item-placeholder" style={{ backgroundColor: accentColor + '20' }}>
                      <div className="work-item-placeholder-icon">+</div>
                    </div>
                  )}
                  {item.link && (
                    <div className="work-item-overlay">
                      <div className="work-item-link-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="15 3 21 3 21 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Text Content Side */}
          <div className="work-showcase-text-side">
            {items.map((item, index) => (
              <div key={item.id} className="work-item-text-content">
                <h3 className="work-item-title">{item.title}</h3>
                {item.description && (
                  <p className="work-item-description">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

