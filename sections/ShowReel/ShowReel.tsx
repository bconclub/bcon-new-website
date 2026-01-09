'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
// Image will be loaded from public folder
const showreelThumbnail = '/portfolio/Showreel Thumbnail.webp';
const showreelVideo = '/portfolio/Showreel.mp4';
import './ShowReel.css';

export default function ShowReel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
    setVideoLoaded(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (isModalOpen && videoRef.current) {
      // Start loading the video when modal opens
      videoRef.current.load();
    }
  }, [isModalOpen]);

  return (
    <>
      <section className="showreel-section">
        <div className="showreel-content">
          <button className="showreel-trigger" onClick={openModal}>
            <div className="rotating-circle">
              <svg className="circle-text" viewBox="0 0 200 200" width="216" height="216">
                <defs>
                  <path
                    id="circlePath"
                    d="M 100, 100 m -55, 0 a 55,55 0 1,1 110,0 a 55,55 0 1,1 -110,0"
                  />
                </defs>
                <text className="rotating-text">
                  <textPath href="#circlePath" startOffset="0%">
                    PLAY OUR SHOWREEL • PLAY OUR SHOWREEL • 
                  </textPath>
                </text>
              </svg>
              <div className="play-icon-center">
                <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
                  <path d="M15 10L28 20L15 30V10Z" fill="#CCFF00"/>
                </svg>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="showreel-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M7 7L23 23M23 7L7 23" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            {/* Thumbnail image that shows while video loads */}
            {!videoLoaded && (
              <div className="video-thumbnail">
                <Image 
                  src={showreelThumbnail} 
                  alt="Showreel Thumbnail"
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              </div>
            )}
            
            {/* Video container - hidden until loaded */}
            <div className="video-container" style={{ opacity: videoLoaded ? 1 : 0 }}>
              <video
                ref={videoRef}
                src={showreelVideo}
                autoPlay
                playsInline
                muted
                loop={false}
                onLoadedData={() => {
                  setVideoLoaded(true);
                  if (videoRef.current) {
                    videoRef.current.play().catch(() => {});
                  }
                }}
                onEnded={closeModal}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

