'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectCard, { ProjectCardProps } from '../ProjectCard/ProjectCard';
import './FeaturedWorkGrid.css';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedWorkGridProps {
  projects: ProjectCardProps[];
  title?: string;
}

export default function FeaturedWorkGrid({ projects, title = 'Featured Work' }: FeaturedWorkGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 40,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
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
  }, [projects]);

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="featured-work-section" ref={sectionRef}>
      {title && (
        <div className="featured-work-header">
          <h2 className="featured-work-title">{title}</h2>
        </div>
      )}
      <div className="featured-work-grid">
        {projects.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => { cardsRef.current[index] = el; }}
            className="featured-work-card-wrapper"
          >
            <ProjectCard {...project} />
          </div>
        ))}
      </div>
    </section>
  );
}


