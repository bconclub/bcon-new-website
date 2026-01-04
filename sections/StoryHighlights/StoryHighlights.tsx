'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import './StoryHighlights.css';

export interface StoryHighlight {
  id: string;
  label: string;
  thumbnail?: string;
  gradient?: string;
  onClick?: () => void;
  filterTag?: string; // For filtering work items
}

interface StoryHighlightsProps {
  highlights: StoryHighlight[];
}

export default function StoryHighlights({ highlights }: StoryHighlightsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="story-highlights-section">
      <div
        ref={scrollContainerRef}
        className="story-highlights-container"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {highlights.map((highlight, index) => (
          <motion.button
            key={highlight.id}
            className="story-highlight"
            onClick={highlight.onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <div
              className="story-highlight-circle"
              style={
                highlight.gradient
                  ? {
                      '--gradient': highlight.gradient
                    } as React.CSSProperties
                  : undefined
              }
            >
              {highlight.thumbnail ? (
                <img
                  src={highlight.thumbnail}
                  alt={highlight.label}
                  className="story-highlight-image"
                />
              ) : (
                <div className="story-highlight-placeholder">
                  {highlight.label.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="story-highlight-label">{highlight.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

