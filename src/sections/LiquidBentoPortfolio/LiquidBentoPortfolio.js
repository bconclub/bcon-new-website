import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LiquidBentoPortfolio.css';

gsap.registerPlugin(ScrollTrigger);

const sampleItems = [
  { id: 1, type: 'image', src: '/portfolio/WC Event.jpg', ratio: '1:1', title: 'Event Ads' },
  { id: 2, type: 'video', src: '/portfolio/Global Pride Awards.mp4', ratio: '16:9', title: 'Event Launch' },
  { id: 3, type: 'image', src: '/portfolio/11PC Event.jpg', ratio: '4:5', title: 'Event Ads' },
  { id: 4, type: 'video', src: '/portfolio/OR Move With.mp4', ratio: '9:16', title: 'Brand Video' },
  { id: 5, type: 'image', src: '/portfolio/Come to Dubai.png', ratio: '1:1', title: 'Instagram Post' },
  { id: 6, type: 'video', src: '/portfolio/Nexus Algo Intro.mp4', ratio: '16:9', title: 'YouTube Content' },
  { id: 7, type: 'video', src: '/portfolio/Mini Chopper.mp4', ratio: '9:16', title: 'Product Ads' },
  { id: 8, type: 'video', src: '/portfolio/Vyjayanthi Movies.mp4', ratio: '16:9', title: 'Website Video' },
  { id: 9, type: 'image', src: '/portfolio/11PC Launch.jpg', ratio: '4:5', title: 'Brand Launch' },
  { id: 10, type: 'video', src: '/portfolio/11PC Love All.mp4', ratio: '9:16', title: 'Social Media' },
  { id: 11, type: 'video', src: '/portfolio/Laptopstore Offer.mp4', ratio: '1:1', title: 'Brand Offer' },
  { id: 12, type: 'video', src: '/portfolio/Birdbox Reel.mp4', ratio: '9:16', title: 'Social Reel' },
  { id: 13, type: 'video', src: '/portfolio/Project K Final Timeline.mp4', ratio: '16:9', title: 'Brand Asset' },
  { id: 14, type: 'image', src: '/portfolio/Birdbox Launching Soon.jpg', ratio: '1:1', title: 'Launch Ads' },
  { id: 15, type: 'video', src: '/portfolio/Portable Juicer.mp4', ratio: '1:1', title: 'Product Ads' },
  { id: 16, type: 'video', src: '/portfolio/11PC 3 Days to Go.mp4', ratio: '9:16', title: 'Launch Ads' }
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
  const [portfolioItems] = useState(shuffleArray(sampleItems));
  const itemsRef = useRef([]);
  const videoRefs = useRef([]);

  useEffect(() => {
    itemsRef.current.forEach((item) => {
      if (!item) return;

      gsap.fromTo(
        item,
        {
          opacity: 0,
          y: 60,
          scale: 0.8,
          rotation: Math.random() * 10 - 5
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 1.2,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Intersection Observer for videos
  useEffect(() => {
    const observers = videoRefs.current.map((video) => {
      if (!video) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(video);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);

  const getRatioClass = (ratio) => {
    if (ratio === '1:1') return 'ratio-square';
    if (ratio === '9:16') return 'ratio-portrait';
    if (ratio === '16:9') return 'ratio-landscape';
    if (ratio === '4:5') return 'ratio-instagram';
    return 'ratio-square';
  };

  let videoIndex = 0;

  return (
    <section className="liquid-bento-section">
      <div className="bento-header">
        <h2 className="bento-heading">Our Work</h2>
        <p className="bento-subheading">Creative excellence across all platforms</p>
      </div>

      <div className="liquid-bento-grid">
        {portfolioItems.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => (itemsRef.current[index] = el)}
            className={`bento-item ${getRatioClass(item.ratio)}`}
          >
            <div className="bento-item-inner">
              {item.type === 'video' ? (
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[videoIndex++] = el;
                  }}
                  src={item.src}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="bento-media"
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
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
      <a href="/work" className="view-work-button">
      View All Work
      </a>
    </section>
  );
};

export default LiquidBentoPortfolio;