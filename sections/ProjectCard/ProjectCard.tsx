'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import './ProjectCard.css';

export interface ProjectCardProps {
  id: string;
  title: string;
  client?: string;
  projectType?: string;
  featuredImage?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  badge?: 'LIVE' | 'FEATURED' | string;
  viewCount?: number;
  onClick?: () => void;
  accentColor?: string;
}

export default function ProjectCard({
  title,
  client,
  projectType,
  featuredImage,
  videoUrl,
  videoThumbnail,
  badge,
  viewCount,
  onClick,
  accentColor = '#CDFC2E'
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const imageSrc = videoThumbnail || featuredImage || '/portfolio/11PC-Launch.jpg';

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoUrl) {
      setVideoPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setVideoPlaying(false);
  };

  return (
    <motion.div
      className="project-card"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="project-card-media">
        {videoPlaying && videoUrl ? (
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="project-card-video"
          />
        ) : (
          <img
            src={imageSrc}
            alt={title}
            className="project-card-image"
            loading="lazy"
          />
        )}
        <div className="project-card-overlay" />
        {badge && (
          <div className="project-card-badge" style={{ '--accent': accentColor } as React.CSSProperties}>
            {badge}
          </div>
        )}
        {viewCount !== undefined && (
          <div className="project-card-metric">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>{viewCount}</span>
          </div>
        )}
      </div>
      <div className="project-card-content">
        <h3 className="project-card-title">{title}</h3>
        {client && <p className="project-card-client">{client}</p>}
        {projectType && (
          <span className="project-card-type" style={{ '--accent': accentColor } as React.CSSProperties}>
            {projectType}
          </span>
        )}
      </div>
    </motion.div>
  );
}



