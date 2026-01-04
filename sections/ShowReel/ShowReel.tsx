'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
// Image will be loaded from public folder
const showreelThumbnail = '/assets/images/Showreel Thumbnail.png';
import './ShowReel.css';

interface VimeoPlayer {
  pause: () => void;
  on: (event: string, callback: (data?: any) => void) => void;
  off: (event: string, callback?: (data?: any) => void) => void;
}

// Vimeo Player types are handled by @vimeo/player types package

export default function ShowReel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
    setVideoLoaded(false);
    if (player) {
      player.pause();
    }
  };

  useEffect(() => {
    if (isModalOpen && window.Vimeo && iframeRef.current) {
      const vimeoPlayer = new window.Vimeo.Player(iframeRef.current);
      setPlayer(vimeoPlayer as any);

      const onLoaded = () => {
        setVideoLoaded(true);
      };

      const onEnded = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'unset';
      };

      vimeoPlayer.on('loaded', onLoaded);
      vimeoPlayer.on('ended', onEnded);

      return () => {
        vimeoPlayer.off('ended', onEnded);
        vimeoPlayer.off('loaded', onLoaded);
      };
    }
  }, [isModalOpen]);

  // Load Vimeo Player API
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Vimeo) {
      const script = document.createElement('script');
      script.src = 'https://player.vimeo.com/api/player.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

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
              <iframe
                ref={iframeRef}
                src="https://player.vimeo.com/video/1128657641?autoplay=1&title=0&byline=0&portrait=0&controls=0"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="BCON Showreel"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

