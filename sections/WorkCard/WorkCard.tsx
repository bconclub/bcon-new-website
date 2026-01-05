'use client';

import { useState, useEffect } from 'react';
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
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const imageUrl = thumbnailUrl || heroMediaUrl;
  const isVideo = heroMediaType === 'video' || (heroMediaUrl && heroMediaUrl.match(/\.(mp4|webm)$/i));
  
  // Validate URL - check if it's a valid, non-empty URL
  const isValidUrl = (url?: string): boolean => {
    if (!url || url.trim() === '') return false;
    // Check if it's a valid URL format or a valid path
    try {
      // If it starts with http/https, validate as URL
      if (url.startsWith('http://') || url.startsWith('https://')) {
        new URL(url);
        return true;
      }
      // If it's a relative path, check if it's not empty
      if (url.startsWith('/')) {
        return url.length > 1;
      }
      return true;
    } catch {
      return false;
    }
  };
  
  const hasValidMedia = isValidUrl(imageUrl) && !imageError && !videoError;
  
  // Reset states when URL changes
  useEffect(() => {
    setImageError(false);
    setVideoError(false);
    setImageLoaded(false);
  }, [imageUrl]);
  
  // Pre-validate image URL on mount (only for relative paths to avoid CORS issues)
  useEffect(() => {
    if (imageUrl && !isVideo && imageUrl.startsWith('/')) {
      // Only pre-validate relative paths to avoid CORS issues with external URLs
      const img = new window.Image();
      img.onerror = () => {
        setImageError(true);
      };
      img.onload = () => {
        setImageLoaded(true);
      };
      img.src = imageUrl;
    }
  }, [imageUrl, isVideo]);
  
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
        {hasValidMedia ? (
          <>
            {isVideo ? (
              <>
                <video
                  src={imageUrl!}
                  className="work-card-video"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onError={() => {
                    setVideoError(true);
                    console.warn('Video failed to load:', imageUrl);
                  }}
                />
                <div className="work-card-play-overlay">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="rgba(0, 0, 0, 0.6)" />
                    <path d="M10 8l6 4-6 4V8z" fill="#FFFFFF" />
                  </svg>
                </div>
              </>
            ) : (
              <>
                <Image
                  src={imageUrl!}
                  alt={projectTitle}
                  fill
                  className="work-card-image"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  onError={(e) => {
                    setImageError(true);
                    console.warn('Image failed to load:', imageUrl);
                  }}
                  onLoad={() => setImageLoaded(true)}
                  unoptimized
                />
                {!imageLoaded && (
                  <div className="work-card-image-loading">
                    <div className="work-card-loading-spinner" />
                  </div>
                )}
              </>
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

