import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LiquidBentoPortfolio.css';

gsap.registerPlugin(ScrollTrigger);

const LiquidBentoPortfolio = () => {
  const containerRef = useRef(null);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const itemsRef = useRef([]);

  // ✅ Sample portfolio data - Replace with your actual content
  const sampleItems = [
    { id: 1, type: 'image', src: '/portfolio/WC Event.jpg', ratio: '1:1', title: 'Brand Launch' },
    { id: 2, type: 'video', src: '/portfolio/Global Pride Awards.mp4', ratio: '16:9', title: 'Event Launch' },
    { id: 3, type: 'image', src: '/portfolio/11PC Event.jpg', ratio: '4:5', title: 'Web Design' },
    { id: 4, type: 'video', src: '/portfolio/OR Move With.mp4', ratio: '9:16', title: 'Product Ad' },
    { id: 5, type: 'image', src: '/portfolio/Come to Dubai.png', ratio: '1:1', title: 'Instagram Post' },
    { id: 6, type: 'video', src: '/portfolio/Nexus Algo Intro.mp4', ratio: '16:9', title: 'YouTube Content' },
    { id: 7, type: 'video', src: '/portfolio/Mini Chopper.mp4', ratio: '9:16', title: 'Branding' },
    { id: 8, type: 'video', src: '/portfolio/Vyjayanthi Movies.mp4', ratio: '16:9', title: 'Reels' },
    { id: 9, type: 'image', src: '/portfolio/11PC Launch.jpg', ratio: '4:5', title: 'Campaign' },
    { id: 10, type: 'video', src: '/portfolio/11PC Love All.mp4', ratio: '9:16', title: 'Social Media' },
    { id: 11, type: 'video', src: '/portfolio/Laptopstore Offer.mp4', ratio: '1:1', title: 'Story Ad' },
    { id: 12, type: 'video', src: '/portfolio/Birdbox Reel.mp4', ratio: '9:16', title: 'Website' },
    { id: 13, type: 'video', src: '/portfolio/WC Spend a Day.mp4', ratio: '16:9', title: 'Ad Campaign' },
    { id: 14, type: 'image', src: '/portfolio/Birdbox Launching Soon.jpg', ratio: '1:1', title: 'Content' },
    { id: 15, type: 'video', src: '/portfolio/Portable Juicer.mp4', ratio: '1:1', title: 'Brand Video' },
    { id: 16, type: 'video', src: '/portfolio/11PC 3 Days to Go.mp4', ratio: '9:16', title: 'Story' }
  ];

  useEffect(() => {
    // Initialize with sample items - only run once on mount
    setPortfolioItems(sampleItems);
  }, []); // Empty dependency array is intentional

  // ✅ Memoized shuffle function
  const shuffleItems = React.useCallback(() => {
    // Randomly reorder items with liquid transition
    const shuffled = [...portfolioItems].sort(() => Math.random() - 0.5);
    
    gsap.to(itemsRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      stagger: 0.03,
      onComplete: () => {
        setPortfolioItems(shuffled);
        gsap.fromTo(itemsRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.6, stagger: 0.03 }
        );
      }
    });
  }, [portfolioItems]);

  useEffect(() => {
    if (portfolioItems.length === 0) return;

    // ✅ Liquid morphing animation on scroll
    itemsRef.current.forEach((item, index) => {
      if (!item) return;

      // Random direction for each item
      const directions = ['left', 'right', 'top', 'bottom'];
      const direction = directions[Math.floor(Math.random() * directions.length)];
      
      let fromVars = { opacity: 0, scale: 0.8 };
      
      switch(direction) {
        case 'left':
          fromVars.x = -100;
          break;
        case 'right':
          fromVars.x = 100;
          break;
        case 'top':
          fromVars.y = -100;
          break;
        case 'bottom':
          fromVars.y = 100;
          break;
        default:
          break;
      }

      gsap.fromTo(item, 
        fromVars,
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // ✅ Auto-shuffle if idle (after 5 seconds of no scroll)
    let idleTimer;
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        shuffleItems();
      }, 5000);
    };

    window.addEventListener('scroll', resetIdleTimer);
    resetIdleTimer();

    return () => {
      window.removeEventListener('scroll', resetIdleTimer);
      clearTimeout(idleTimer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [portfolioItems, shuffleItems]);

  const getRatioClass = (ratio) => {
    switch(ratio) {
      case '1:1': return 'ratio-square';
      case '9:16': return 'ratio-portrait';
      case '16:9': return 'ratio-landscape';
      case '4:5': return 'ratio-instagram';
      default: return 'ratio-square';
    }
  };

  return (
    <section className="liquid-bento-section">
      <div className="bento-header">
        <h2 className="bento-heading">Our Work</h2>
        <p className="bento-subheading">Creative excellence across all platforms</p>
      </div>

      <div className="liquid-bento-grid" ref={containerRef}>
        {portfolioItems.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => (itemsRef.current[index] = el)}
            className={`bento-item ${getRatioClass(item.ratio)}`}
            onClick={() => window.open(`/project/${item.id}`, '_blank')}
          >
            <div className="bento-item-inner">
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="bento-media"
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.title}
                  className="bento-media"
                />
              )}
              <div className="bento-overlay">
                <h3 className="bento-title">{item.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LiquidBentoPortfolio;