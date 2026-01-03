'use client';

import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

export default function ScrollReveal({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom'
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      const isBCON = word.toUpperCase() === 'BCON' || word.toUpperCase() === 'BCON.';
      return (
        <span className={`word ${isBCON ? 'word-bcon' : ''}`} key={index} data-word={isBCON ? 'bcon' : ''}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom',
          end: rotationEnd,
          scrub: true
        }
      }
    );

    const wordElements = el.querySelectorAll('.word');
    const bconWord = el.querySelector('.word-bcon');
    
    // Check if we should skip color animation (for reveal-line-1, reveal-line-2, reveal-line-3)
    const shouldSkipColorAnimation = containerClassName.includes('reveal-line-1') || 
                                     containerClassName.includes('reveal-line-2') || 
                                     containerClassName.includes('reveal-line-3');
    
    // Set initial color based on line type
    let initialColor = '#ffffff';
    if (containerClassName.includes('reveal-line-3')) {
      initialColor = '#CCFF00';
    } else if (containerClassName.includes('reveal-line-1') || containerClassName.includes('reveal-line-2')) {
      initialColor = '#ffffff';
    }
    
    // Set initial colors for all words
    wordElements.forEach((word) => {
      if (word.classList.contains('word-bcon')) {
        gsap.set(word, { color: '#ffffff' }); // BCON starts white
      } else {
        gsap.set(word, { color: initialColor }); // Other words use initial color
      }
    });
    
    gsap.fromTo(
      wordElements,
      { opacity: baseOpacity, willChange: 'opacity' },
      {
        ease: 'none',
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=20%',
          end: wordAnimationEnd,
          scrub: true
        }
      }
    );

    // Special animation for BCON word in reveal-line-3: animate from white to accent color
    if (containerClassName.includes('reveal-line-3') && bconWord) {
      // Animate BCON from white to accent color during scroll
      gsap.to(
        bconWord,
        {
          ease: 'none',
          color: '#CCFF00',
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=20%',
            end: wordAnimationEnd,
            scrub: true
          }
        }
      );
    }

    // Green color wave effect - skip for reveal lines to preserve CSS colors
    if (!shouldSkipColorAnimation) {
      gsap.fromTo(
        wordElements,
        { color: '#CCFF00' },
        {
          ease: 'none',
          color: '#ffffff',
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=20%',
            end: wordAnimationEnd,
            scrub: true
          }
        }
      );
    }

    if (enableBlur) {
      gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: 'none',
          filter: 'blur(0px)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=20%',
            end: wordAnimationEnd,
            scrub: true
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </h2>
  );
}



