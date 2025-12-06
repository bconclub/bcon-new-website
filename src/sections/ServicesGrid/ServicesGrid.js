import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ServicesGrid.css';

gsap.registerPlugin(ScrollTrigger);

const ServicesGrid = () => {
  const gridRef = useRef(null);
  const cardsRef = useRef([]);
  const imageRefs = useRef([]);

  const services = [
    {
      id: 1,
      title: 'AI Strategy Consulting',
      description: 'Data-first roadmaps to align AI with growth goals',
      image: '/BRain.png'
    },
    {
      id: 2,
      title: 'Human X AI Marketing',
      description: 'Human creativity amplified with AI decisioning and ops'
    },
    {
      id: 3,
      title: 'AI-Powered Content',
      description: 'Scaled content engines with AI-assisted production'
    },
    {
      id: 4,
      title: 'Smart Webistes',
      description: 'High-performance sites with intelligent personalisation'
    },
    {
      id: 5,
      title: 'AI-Driven Ads',
      description: 'Adaptive ad systems tuned for ROAS and CAC targets'
    },
    {
      id: 6,
      title: 'Conversation AI - PROXe',
      description: 'Launch and manage PROXe deployments with governance'
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

  // 3D tilt effect on mouse move
  const handleMouseMove = (e, index) => {
    const image = imageRefs.current[index];
    if (!image) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    image.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  const handleMouseLeave = (index) => {
    const image = imageRefs.current[index];
    if (!image) return;
    
    image.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  };

  return (
    <div className="services-grid-container" ref={gridRef}>
      <div className="services-grid">
        {services.map((service, index) => (
          <div 
            key={service.id} 
            className="service-card"
            ref={(el) => (cardsRef.current[index] = el)}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <div className="service-content">
              <h3 className="service-title">{service.title}</h3>
              <div className="service-image">
                {service.image ? (
                  <img 
                    ref={(el) => (imageRefs.current[index] = el)}
                    src={service.image} 
                    alt={service.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesGrid;