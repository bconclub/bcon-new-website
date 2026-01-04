'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import './WorkCard.css';

export interface WorkCardProps {
  id: string;
  clientName: string;
  projectTitle: string;
  projectType?: string;
  thumbnailUrl?: string;
  thumbnailAspectRatio?: 'square' | 'tall' | 'story' | 'wide' | 'auto';
  heroMediaUrl?: string;
  heroMediaType?: 'image' | 'video';
  featured?: boolean;
  onClick: () => void;
}

export default function WorkCard({
  id,
  clientName,
  projectTitle,
  projectType,
  thumbnailUrl,
  thumbnailAspectRatio = 'auto',
  heroMediaUrl,
  heroMediaType,
  featured,
  onClick,
}: WorkCardProps) {
  const imageUrl = thumbnailUrl || heroMediaUrl;
  const isVideo = heroMediaType === 'video' || (heroMediaUrl && heroMediaUrl.match(/\.(mp4|webm)$/i));

  const getAspectRatioClass = () => {
    switch (thumbnailAspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'tall':
        return 'aspect-tall';
      case 'story':
        return 'aspect-story';
      case 'wide':
        return 'aspect-wide';
      default:
        return 'aspect-auto';
    }
  };

  return (
    <motion.div
      className={`work-card ${getAspectRatioClass()}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="work-card-media">
        {imageUrl ? (
          <>
            {isVideo ? (
              <video
                src={imageUrl}
                className="work-card-video"
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <Image
                src={imageUrl}
                alt={projectTitle}
                fill
                className="work-card-image"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            )}
            {isVideo && (
              <div className="work-card-play-overlay">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="rgba(0, 0, 0, 0.6)" />
                  <path d="M10 8l6 4-6 4V8z" fill="#FFFFFF" />
                </svg>
              </div>
            )}
          </>
        ) : (
          <div className="work-card-placeholder">
            <span>{projectTitle.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div className="work-card-overlay">
          <div className="work-card-badges">
            {featured && (
              <span className="work-card-badge work-card-badge-featured">FEATURED</span>
            )}
            {clientName && (
              <span className="work-card-badge work-card-badge-client">{clientName}</span>
            )}
          </div>
          <div className="work-card-info">
            <h3 className="work-card-title">{projectTitle}</h3>
            {projectType && (
              <span className="work-card-type">{projectType}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

