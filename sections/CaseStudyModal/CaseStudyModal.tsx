'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import './CaseStudyModal.css';

interface WorkMedia {
  id: string;
  media_url: string;
  media_type: 'image' | 'video';
  aspect_ratio?: string;
  section: 'creative' | 'tech';
  caption?: string;
  order_index: number;
}

interface Metric {
  label: string;
  description?: string;
}

interface WorkItem {
  id: string;
  client_name: string;
  project_title: string;
  project_type?: string;
  category: 'creative' | 'tech';
  hero_media_url?: string;
  hero_media_type?: 'image' | 'video';
  description?: string;
  challenge?: string;
  solution?: string;
  approach?: string;
  tech_stack?: string[];
  metrics?: Metric[];
  live_url?: string;
  industry?: string;
  work_media?: WorkMedia[];
}

interface CaseStudyModalProps {
  workItem: WorkItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CaseStudyModal({ workItem, isOpen, onClose }: CaseStudyModalProps) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [expandedMediaIndex, setExpandedMediaIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!workItem) return null;

  const creativeMedia = workItem.work_media?.filter(m => m.section === 'creative') || [];
  const techMedia = workItem.work_media?.filter(m => m.section === 'tech') || [];
  const allMedia = [...creativeMedia, ...techMedia].sort((a, b) => a.order_index - b.order_index);

  const isVideo = (url?: string) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|mov)$/i) || workItem.hero_media_type === 'video';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="case-study-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={modalRef}
            className="case-study-modal"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="case-study-modal-header">
              <button className="case-study-modal-close" onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <button className="case-study-modal-share" onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: workItem.project_title,
                    text: workItem.description,
                    url: window.location.href,
                  });
                }
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="2" />
                  <path d="M13.5 6.5L16.5 9.5M7.5 13.5L10.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="case-study-modal-content">
              {/* Hero Media */}
              {workItem.hero_media_url && (
                <div className="case-study-hero">
                  {isVideo(workItem.hero_media_url) ? (
                    <video
                      src={workItem.hero_media_url}
                      className="case-study-hero-video"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <Image
                      src={workItem.hero_media_url}
                      alt={workItem.project_title}
                      fill
                      className="case-study-hero-image"
                      sizes="100vw"
                      priority
                    />
                  )}
                </div>
              )}

              {/* Project Info */}
              <div className="case-study-info">
                <h1 className="case-study-title">{workItem.project_title}</h1>
                <div className="case-study-meta">
                  {workItem.client_name && (
                    <span className="case-study-client">{workItem.client_name}</span>
                  )}
                  {workItem.industry && (
                    <span className="case-study-industry">• {workItem.industry}</span>
                  )}
                </div>
                {workItem.project_type && (
                  <div className="case-study-tags">
                    <span className="case-study-tag">{workItem.project_type}</span>
                  </div>
                )}
                {workItem.description && (
                  <p className="case-study-description">{workItem.description}</p>
                )}
              </div>

              {/* Preview Cards */}
              {allMedia.length > 0 && (
                <div className="case-study-preview-section">
                  <div className="case-study-preview-scroll">
                    {allMedia.map((media, index) => (
                      <div
                        key={media.id}
                        className="case-study-preview-card"
                        onClick={() => setExpandedMediaIndex(index)}
                      >
                        {isVideo(media.media_url) ? (
                          <video
                            src={media.media_url}
                            className="case-study-preview-media"
                            muted
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <Image
                            src={media.media_url}
                            alt={media.caption || `Preview ${index + 1}`}
                            fill
                            className="case-study-preview-media"
                            sizes="(max-width: 768px) 200px, 300px"
                          />
                        )}
                        {isVideo(media.media_url) && (
                          <div className="case-study-preview-play">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" fill="rgba(0, 0, 0, 0.6)" />
                              <path d="M10 8l6 4-6 4V8z" fill="#FFFFFF" />
                            </svg>
                          </div>
                        )}
                        {media.caption && (
                          <div className="case-study-preview-caption">{media.caption}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Details */}
              {(workItem.challenge || workItem.solution || workItem.approach) && (
                <div className="case-study-details">
                  {workItem.challenge && (
                    <div className="case-study-detail-section">
                      <h2 className="case-study-detail-title">Challenge</h2>
                      <p className="case-study-detail-text">{workItem.challenge}</p>
                    </div>
                  )}
                  {workItem.solution && (
                    <div className="case-study-detail-section">
                      <h2 className="case-study-detail-title">Solution</h2>
                      <p className="case-study-detail-text">{workItem.solution}</p>
                    </div>
                  )}
                  {workItem.approach && (
                    <div className="case-study-detail-section">
                      <h2 className="case-study-detail-title">Approach</h2>
                      <p className="case-study-detail-text">{workItem.approach}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Work Showcase */}
              {(creativeMedia.length > 0 || techMedia.length > 0) && (
                <div className="case-study-showcase">
                  {creativeMedia.length > 0 && (
                    <div className="case-study-showcase-section">
                      <h2 className="case-study-showcase-title">Creative we're delivering</h2>
                      <div className="case-study-showcase-grid">
                        {creativeMedia.map((media) => (
                          <div key={media.id} className="case-study-showcase-item">
                            {isVideo(media.media_url) ? (
                              <video
                                src={media.media_url}
                                className="case-study-showcase-media"
                                muted
                                loop
                                playsInline
                              />
                            ) : (
                              <Image
                                src={media.media_url}
                                alt={media.caption || 'Creative work'}
                                fill
                                className="case-study-showcase-media"
                                sizes="(max-width: 768px) 50vw, 33vw"
                              />
                            )}
                            {media.caption && (
                              <div className="case-study-showcase-caption">{media.caption}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {techMedia.length > 0 && (
                    <div className="case-study-showcase-section">
                      <h2 className="case-study-showcase-title">Tech we're delivering</h2>
                      <div className="case-study-showcase-grid">
                        {techMedia.map((media) => (
                          <div key={media.id} className="case-study-showcase-item">
                            {isVideo(media.media_url) ? (
                              <video
                                src={media.media_url}
                                className="case-study-showcase-media"
                                muted
                                loop
                                playsInline
                              />
                            ) : (
                              <Image
                                src={media.media_url}
                                alt={media.caption || 'Tech work'}
                                fill
                                className="case-study-showcase-media"
                                sizes="(max-width: 768px) 50vw, 33vw"
                              />
                            )}
                            {media.caption && (
                              <div className="case-study-showcase-caption">{media.caption}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tech Stack */}
              {workItem.tech_stack && workItem.tech_stack.length > 0 && (
                <div className="case-study-tech-stack">
                  <h2 className="case-study-tech-stack-title">Tech Stack</h2>
                  <div className="case-study-tech-stack-badges">
                    {workItem.tech_stack.map((tech, index) => (
                      <span key={index} className="case-study-tech-badge">{tech}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metrics */}
              {workItem.metrics && workItem.metrics.length > 0 && (
                <div className="case-study-metrics">
                  <h2 className="case-study-metrics-title">Results</h2>
                  <div className="case-study-metrics-grid">
                    {workItem.metrics.map((metric, index) => (
                      <div key={index} className="case-study-metric-card">
                        <div className="case-study-metric-label">{metric.label}</div>
                        {metric.description && (
                          <div className="case-study-metric-description">{metric.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="case-study-cta">
                {workItem.live_url && (
                  <a
                    href={workItem.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="case-study-cta-btn case-study-cta-btn-primary"
                  >
                    View Live Project
                  </a>
                )}
                <a
                  href="/#contact"
                  className="case-study-cta-btn case-study-cta-btn-secondary"
                >
                  Contact Us
                </a>
              </div>
            </div>

            {/* Expanded Media Modal */}
            <AnimatePresence>
              {expandedMediaIndex !== null && allMedia[expandedMediaIndex] && (
                <motion.div
                  className="case-study-expanded-media"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setExpandedMediaIndex(null)}
                >
                  <button
                    className="case-study-expanded-close"
                    onClick={() => setExpandedMediaIndex(null)}
                  >
                    ×
                  </button>
                  {isVideo(allMedia[expandedMediaIndex].media_url) ? (
                    <video
                      src={allMedia[expandedMediaIndex].media_url}
                      className="case-study-expanded-video"
                      controls
                      autoPlay
                    />
                  ) : (
                    <Image
                      src={allMedia[expandedMediaIndex].media_url}
                      alt={allMedia[expandedMediaIndex].caption || 'Expanded view'}
                      fill
                      className="case-study-expanded-image"
                      sizes="100vw"
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

