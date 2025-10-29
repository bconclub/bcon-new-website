import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './LiquidBentoPortfolio.css';

const allItems = [
  { id: 1, type: 'video', src: '/portfolio/Birdbox Reel.mp4', ratio: '9:16', title: 'Social Reel' },
  { id: 2, type: 'image', src: '/portfolio/Come to Dubai.png', ratio: '1:1', title: 'Instagram Post' },
  { id: 3, type: 'video', src: '/portfolio/Global Pride Awards.mp4', ratio: '16:9', title: 'Event Launch' },
  { id: 4, type: 'video', src: '/portfolio/Laptopstore Offer.mp4', ratio: '1:1', title: 'Brand Offer' },
  { id: 5, type: 'image', src: '/portfolio/Laptopstore-Product-Ad.jpg', ratio: '1:1', title: 'Product Ad' },
  { id: 6, type: 'video', src: '/portfolio/Mini Chopper.mp4', ratio: '9:16', title: 'Product Ads' },
  { id: 7, type: 'video', src: '/portfolio/Nexus Algo Intro.mp4', ratio: '16:9', title: 'YouTube Content' },
  { id: 8, type: 'video', src: '/portfolio/OR Move With.mp4', ratio: '9:16', title: 'Brand Video' },
  { id: 9, type: 'video', src: '/portfolio/Portable Juicer.mp4', ratio: '1:1', title: 'Product Ads' },
  { id: 10, type: 'video', src: '/portfolio/Vyjayanthi Movies.mp4', ratio: '16:9', title: 'Website Video' },
  { id: 11, type: 'image', src: '/portfolio/WC Event.jpg', ratio: '1:1', title: 'Event Ads' },
  { id: 12, type: 'video', src: '/portfolio/WC Facility.mp4', ratio: '16:9', title: 'Brand Asset' },
  { id: 13, type: 'video', src: '/portfolio/WOW VFX.mp4', ratio: '1:1', title: 'VFX Showreel' }
];

const mobileItems = [
  { id: 1, type: 'video', src: '/portfolio/Vyjayanthi Movies.mp4', ratio: '16:9', title: 'Website Video' },
  { id: 2, type: 'image', src: '/portfolio/Come to Dubai.png', ratio: '1:1', title: 'Instagram Post' },
  { id: 3, type: 'video', src: '/portfolio/Birdbox Reel.mp4', ratio: '9:16', title: 'Social Reel' },
  { id: 4, type: 'video', src: '/portfolio/11PC Love All.mp4', ratio: '9:16', title: 'Social Media' },
  { id: 5, type: 'video', src: '/portfolio/Laptopstore Offer.mp4', ratio: '1:1', title: 'Brand Offer' },
  { id: 6, type: 'video', src: '/portfolio/WC Facility.mp4', ratio: '16:9', title: 'Brand Asset' }
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
  const [desktopItems] = useState(shuffleArray(allItems));
  const [visibleCount, setVisibleCount] = useState(13);
  const [deviceType, setDeviceType] = useState('desktop');
  const itemsRef = useRef([]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width <= 768) {
        setDeviceType('mobile');
        setVisibleCount(6);
      } else if (width <= 1024) {
        setDeviceType('tablet');
        setVisibleCount(13);
      } else {
        setDeviceType('desktop');
        setVisibleCount(13);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    itemsRef.current.forEach((item, index) => {
      if (!item) return;
      
      gsap.fromTo(
        item,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.05,
          ease: 'power2.out'
        }
      );
    });
  }, [visibleCount, deviceType]);

  const getRatioClass = (ratio) => {
    if (ratio === '1:1') return 'ratio-square';
    if (ratio === '9:16') return 'ratio-portrait';
    if (ratio === '16:9') return 'ratio-landscape';
    if (ratio === '4:5') return 'ratio-instagram';
    return 'ratio-square';
  };

  const items = deviceType === 'mobile' ? mobileItems : desktopItems;
  const visibleItems = items.slice(0, visibleCount);

  return (
    <section className="liquid-bento-section">
      <div className="bento-header">
        <h2 className="bento-heading">Our Work</h2>
        <p className="bento-subheading">Creative excellence across all platforms</p>
      </div>

      <div className="liquid-bento-grid">
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => (itemsRef.current[index] = el)}
            className={`bento-item ${getRatioClass(item.ratio)}`}
          >
            <div className="bento-item-inner">
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  autoPlay
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