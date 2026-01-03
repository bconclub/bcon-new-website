'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ShowcaseCard.css';

gsap.registerPlugin(ScrollTrigger);

interface ShowcaseCardProps {
  image: string;
  caption: string;
  side: 'left' | 'right';
  accentColor?: string;
  index?: number;
  aspectRatio?: '16:9' | '9:16';
}

export default function ShowcaseCard({
  image,
  caption,
  side,
  accentColor = '#CCFF00',
  index = 0,
  aspectRatio = '16:9'
}: ShowcaseCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 60,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse'
        },
        delay: index * 0.15
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`showcase-card showcase-card-${side}`}
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      <div 
        className="showcase-image-wrapper"
        style={{ 
          aspectRatio: aspectRatio === '16:9' ? '16 / 9' : '9 / 16'
        }}
      >
        <img
          src={image}
          alt={caption}
          className="showcase-image"
          loading="lazy"
        />
      </div>
      <div className="showcase-caption">
        <p>{caption}</p>
      </div>
    </div>
  );
}

