'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ShowcaseSection.css';

gsap.registerPlugin(ScrollTrigger);

interface ShowcaseSectionProps {
  title: string;
  eyebrow?: string;
  subheader?: string;
  children: React.ReactNode;
  accentColor?: string;
}

export default function ShowcaseSection({
  title,
  eyebrow,
  subheader,
  children,
  accentColor = '#CCFF00'
}: ShowcaseSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    gsap.fromTo(
      headerRef.current,
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 60%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="showcase-section" ref={sectionRef}>
      <div className="showcase-section-container">
        <div className="showcase-header-wrapper">
          {eyebrow && (
            <h1 className="showcase-eyebrow" ref={headerRef}>{eyebrow}</h1>
          )}
          {subheader && (
            <h2 
              className="showcase-subheader" 
              style={{ color: accentColor }}
            >
              {subheader}
            </h2>
          )}
          {!subheader && (
            <h2 className="showcase-header" ref={headerRef}>{title}</h2>
          )}
        </div>
        <div className="showcase-cards-container">
          {children}
        </div>
      </div>
    </section>
  );
}

