import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ServicesGrid.css';

gsap.registerPlugin(ScrollTrigger);

const ServicesGrid = () => {
  const gridRef = useRef(null);
  const cardsRef = useRef([]);

  const services = [
    {
      id: 1,
      title: 'AI Strategy Consulting',
      description: 'Data-driven marketing strategies powered by AI insights'
    },
    {
      id: 2,
      title: 'Performance Marketing',
      description: 'ROI-focused campaigns that drive measurable results'
    },
    {
      id: 3,
      title: 'Brand Building',
      description: 'Create memorable brands that resonate with audiences'
    },
    {
      id: 4,
      title: 'AI Content Creation',
      description: 'Scale your content production with AI-powered tools'
    },
    {
      id: 5,
      title: 'Web & Next-Gen Apps',
      description: 'Modern web experiences and cutting-edge applications'
    },
    {
      id: 6,
      title: 'Analytics & Intelligence',
      description: 'Turn data into actionable business insights'
    }
  ];

  useEffect(() => {
    gsap.set(cardsRef.current, {
      opacity: 0,
      y: -50,
      scale: 0.9,
      rotation: -2
    });

    cardsRef.current.forEach((card, index) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.7,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 50%',
          toggleActions: 'play none none none',
          id: 'services'
        },
        delay: index * 0.1
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.id === 'services') trigger.kill();
      });
    };
  }, []);

  return (
    <div className="services-grid-container" ref={gridRef}>
      <div className="services-grid">
        {services.map((service, index) => (
          <div 
            key={service.id} 
            className="service-card"
            ref={(el) => (cardsRef.current[index] = el)}
          >
            <div className="service-content">
              <h3 className="service-title">{service.title}</h3>
              <div className="service-image" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesGrid;