import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LiquidBentoPortfolio.css';

gsap.registerPlugin(ScrollTrigger);

const sampleItems = [
  { id: 1, type: 'image', src: '/portfolio/WC Event.jpg', ratio: '1:1', align: 'center', title: 'Event Ads' },
  { id: 2, type: 'video', src: '/portfolio/Global Pride Awards.mp4', ratio: '16:9', align: 'top', title: 'Event Launch' },
  { id: 3, type: 'image', src: '/portfolio/11PC Event.jpg', ratio: '4:5', align: 'bottom', title: 'Event Ads' },
  { id: 4, type: 'video', src: '/portfolio/OR Move With.mp4', ratio: '9:16', align: 'center', title: 'Brand Video' },
  { id: 5, type: 'image', src: '/portfolio/Come to Dubai.png', ratio: '1:1', align: 'top', title: 'Instagram Post' },
  { id: 6, type: 'video', src: '/portfolio/Nexus Algo Intro.mp4', ratio: '16:9', align: 'bottom', title: 'YouTube Content' },
  { id: 7, type: 'video', src: '/portfolio/Mini Chopper.mp4', ratio: '9:16', align: 'top', title: 'Product Ads' },
  { id: 8, type: 'video', src: '/portfolio/Vyjayanthi Movies.mp4', ratio: '16:9', align: 'center', title: 'Website Video' },
  { id: 9, type: 'image', src: '/portfolio/11PC Launch.jpg', ratio: '4:5', align: 'top', title: 'Brand Launch' },
  { id: 10, type: 'video', src: '/portfolio/11PC Love All.mp4', ratio: '9:16', align: 'bottom', title: 'Social Media' },
  { id: 11, type: 'video', src: '/portfolio/Laptopstore Offer.mp4', ratio: '1:1', align: 'center', title: 'Brand Offer' },
  { id: 12, type: 'video', src: '/portfolio/Birdbox Reel.mp4', ratio: '9:16', align: 'center', title: 'Social Reel' },
  { id: 13, type: 'video', src: '/portfolio/Project K Final Timeline.mp4', ratio: '16:9', align: 'bottom', title: 'Brand Asset' },
  { id: 14, type: 'image', src: '/portfolio/Birdbox Launching Soon.jpg', ratio: '1:1', align: 'top', title: 'Launch Ads' },
  { id: 15, type: 'video', src: '/portfolio/Portable Juicer.mp4', ratio: '1:1', align: 'bottom', title: 'Product Ads' },
  { id: 16, type: 'video', src: '/portfolio/11PC 3 Days to Go.mp4', ratio: '9:16', align: 'top', title: 'Launch Ads' }
];

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const LiquidBentoPortfolio = () => {
  const sectionRef = useRef(null);
  const stripRef = useRef(null);
  const [portfolioItems] = useState(shuffleArray(sampleItems));

  useEffect(() => {
    if (!stripRef.current || !sectionRef.current) return;
  
    const strip = stripRef.current;
    const section = sectionRef.current;
  
    const tween = gsap.to(strip, {
      x: () => -(strip.scrollWidth - window.innerWidth),
      ease: 'none',
    });
  
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: section,
      start: () => window.innerWidth > 768 ? 'top 10%' : 'top 15%',
      end: () => `+=${strip.scrollWidth - window.innerWidth}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      animation: tween
    });
  
    return () => {
      scrollTriggerInstance.kill(true);
      tween.kill();
    };
  }, []);

  const getRatioClass = (ratio) => {
    if (ratio === '1:1') return 'ratio-square';
    if (ratio === '9:16') return 'ratio-portrait';
    if (ratio === '16:9') return 'ratio-landscape';
    if (ratio === '4:5') return 'ratio-instagram';
    return 'ratio-square';
  };

  const getAlignClass = (align) => {
    return `align-${align}`;
  };

  return (
    <section className="liquid-bento-section" ref={sectionRef}>
      <div className="bento-header">
        <h2 className="bento-heading">Our Work</h2>
        <p className="bento-subheading">Creative excellence across all platforms</p>
      </div>

      <div className="bento-strip-wrapper">
        <div className="bento-strip" ref={stripRef}>
          {portfolioItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className={`bento-item ${getRatioClass(item.ratio)} ${getAlignClass(item.align)}`}
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
      </div>
    </section>
  );
};

export default LiquidBentoPortfolio;