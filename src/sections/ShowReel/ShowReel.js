import React, { useState, useRef, useEffect } from 'react';
import showreelThumbnail from '../../assets/images/Showreel Thumbnail.png';
import './ShowReel.css';

function ShowReel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [player, setPlayer] = useState(null);
  // ✅ NEW: State to track if video is ready to play
  const [videoLoaded, setVideoLoaded] = useState(false);
  const iframeRef = useRef(null);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
    setVideoLoaded(false); // Reset video loaded state
    if (player) {
      player.pause();
    }
  };

  useEffect(() => {
    if (isModalOpen && window.Vimeo) {
      const vimeoPlayer = new window.Vimeo.Player(iframeRef.current);
      setPlayer(vimeoPlayer);

      // ✅ NEW: Mark video as loaded when ready
      vimeoPlayer.on('loaded', () => {
        setVideoLoaded(true);
      });

      // Auto-close when video ends
      vimeoPlayer.on('ended', () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'unset';
      });

      return () => {
        vimeoPlayer.off('ended');
        vimeoPlayer.off('loaded');
      };
    }
  }, [isModalOpen]);

  // Load Vimeo Player API
  useEffect(() => {
    if (!window.Vimeo) {
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
              <svg className="circle-text" viewBox="0 0 200 200" width="200" height="200">
                <defs>
                  <path
                    id="circlePath"
                    d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
                  />
                </defs>
                <text className="rotating-text">
                  <textPath href="#circlePath" startOffset="0%">
                    PLAY OUR SHOWREEL • PLAY OUR SHOWREEL • 
                  </textPath>
                </text>
              </svg>
              <div className="play-icon-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
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
            
            {/* ✅ NEW: Thumbnail image that shows while video loads */}
            {!videoLoaded && (
              <div className="video-thumbnail">
                <img 
                src={showreelThumbnail} 
                alt="Showreel Thumbnail" 
                />
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              </div>
            )}
            
            {/* ✅ Video container - hidden until loaded */}
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

export default ShowReel;