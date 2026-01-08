'use client';

import { useState, useRef, useEffect } from 'react';
import './WorkHeroVideo.css';

interface VimeoPlayer {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  getVolume: () => Promise<number>;
  setCurrentTime: (seconds: number) => Promise<void>;
  getDuration: () => Promise<number>;
  getCurrentTime: () => Promise<number>;
  on: (event: string, callback: (data?: any) => void) => void;
  off: (event: string, callback: (data?: any) => void) => void;
}

declare global {
  interface Window {
    Vimeo: {
      Player: new (element: HTMLIFrameElement) => VimeoPlayer;
    };
  }
}

export default function WorkHeroVideo() {
  const [isMuted, setIsMuted] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [player, setPlayer] = useState<VimeoPlayer | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTogglingRef = useRef(false); // Prevent double-triggering
  const VIDEO_ID = '1151194408';

  // Load Vimeo Player API
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Vimeo) {
      const script = document.createElement('script');
      script.src = 'https://player.vimeo.com/api/player.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Initialize Vimeo player once iframe is ready
  useEffect(() => {
    if (!iframeRef.current) return;

    const checkAndInit = () => {
      if (window.Vimeo && iframeRef.current && !player) {
        try {
          const vimeoPlayer = new window.Vimeo.Player(iframeRef.current);
          setPlayer(vimeoPlayer);

          const START_TIME = 7; // Start video at 7 seconds

          const handleReady = () => {
            setFadeIn(true);
            vimeoPlayer.setVolume(0).catch(() => {});
            // Set video to start at 7 seconds
            vimeoPlayer.setCurrentTime(START_TIME).then(() => {
              vimeoPlayer.play().catch((err) => {
                console.log('Play error:', err);
              });
            }).catch(() => {
              // If setCurrentTime fails, try playing anyway
              vimeoPlayer.play().catch(() => {});
            });
          };

          // Handle video end - loop back to 7 seconds
          const handleEnded = () => {
            vimeoPlayer.setCurrentTime(START_TIME).then(() => {
              vimeoPlayer.play().catch(() => {});
            }).catch(() => {});
          };

          // Monitor time to loop back to 7 seconds before video ends (prevent end screen)
          const handleTimeUpdate = async (data: { seconds: number; duration: number }) => {
            // If video is within 1 second of the end, loop back to 7 seconds immediately
            if (data.duration - data.seconds < 1) {
              vimeoPlayer.setCurrentTime(START_TIME).then(() => {
                vimeoPlayer.play().catch(() => {});
              }).catch(() => {});
            }
          };

          vimeoPlayer.on('loaded', handleReady);
          vimeoPlayer.on('ended', handleEnded);
          vimeoPlayer.on('timeupdate', handleTimeUpdate);
          
          // Also try to play after iframe loads
          const timeoutId = setTimeout(() => {
            if (vimeoPlayer) {
              vimeoPlayer.setVolume(0).catch(() => {});
              vimeoPlayer.setCurrentTime(START_TIME).then(() => {
                vimeoPlayer.play().catch(() => {});
                setFadeIn(true);
              }).catch(() => {
                vimeoPlayer.play().catch(() => {});
                setFadeIn(true);
              });
            }
          }, 1000);

          return () => {
            clearTimeout(timeoutId);
            vimeoPlayer.off('loaded', handleReady);
            vimeoPlayer.off('ended', handleEnded);
            vimeoPlayer.off('timeupdate', handleTimeUpdate);
          };
        } catch (error) {
          console.log('Player init error:', error);
        }
      }
    };

    // Wait for Vimeo API to load
    if (window.Vimeo) {
      checkAndInit();
    } else {
      const interval = setInterval(() => {
        if (window.Vimeo) {
          clearInterval(interval);
          checkAndInit();
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, []); // Remove player dependency to avoid re-initialization

  // Intersection Observer for scroll-triggered playback
  useEffect(() => {
    if (!containerRef.current || !player) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Set to 7 seconds before playing
            player.setCurrentTime(7).then(() => {
              player.play().catch(() => {});
            }).catch(() => {
              player.play().catch(() => {});
            });
          } else {
            player.pause().catch(() => {});
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [player]);

  const toggleMute = async () => {
    // Prevent double-triggering
    if (isTogglingRef.current) {
      return;
    }
    
    if (!player) {
      console.log('Player not initialized');
      return;
    }

    isTogglingRef.current = true;

    try {
      // Use state-based toggle for more reliability
      const shouldMute = !isMuted;
      
      if (shouldMute) {
        // Mute: set volume to 0
        await player.setVolume(0);
        // Verify it was set
        const verifyVolume = await player.getVolume();
        if (verifyVolume === 0) {
          setIsMuted(true);
        } else {
          // Retry once
          await player.setVolume(0);
          setIsMuted(true);
        }
      } else {
        // Unmute: set volume to 1
        await player.setVolume(1);
        // Verify it was set
        const verifyVolume = await player.getVolume();
        if (verifyVolume > 0) {
          setIsMuted(false);
        } else {
          // Retry once
          await player.setVolume(1);
          setIsMuted(false);
        }
      }
    } catch (error) {
      console.log('Mute toggle error:', error);
      // Fallback: toggle state and try to set volume
      const shouldMute = !isMuted;
      setIsMuted(shouldMute);
      
      // Try to set volume without verification
      try {
        if (shouldMute) {
          await player.setVolume(0);
        } else {
          await player.setVolume(1);
        }
      } catch (retryError) {
        console.log('Retry mute toggle error:', retryError);
      }
    } finally {
      // Reset flag after a short delay
      setTimeout(() => {
        isTogglingRef.current = false;
      }, 300);
    }
  };

  // Build Vimeo URL with parameters to hide branding, end screen, and next video suggestions
  // Loop parameter added, but we also handle manual looping to start from 7 seconds
  const vimeoUrl = `https://player.vimeo.com/video/${VIDEO_ID}?autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0&badge=0&controls=0&dnt=1&background=1&responsive=1&sidedock=0`;

  return (
    <section className="work-hero-video-section" ref={containerRef}>
      <div 
        className={`work-hero-video-container ${fadeIn ? 'fade-in' : ''}`}
      >
        <iframe
          ref={iframeRef}
          src={vimeoUrl}
          className="work-hero-video"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Our Work"
        ></iframe>
        
        {/* Mute/Unmute Button */}
        {player && (
          <button 
            className="work-hero-mute-button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleMute();
            }}
            onTouchStart={(e) => {
              // Prevent default to avoid double-triggering with onClick
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Only trigger on touchEnd, not touchStart
              toggleMute();
            }}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            type="button"
          >
            {isMuted ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 12C16.5 10.23 15.5 8.71 14 7.97V10.18L16.45 12.63C16.48 12.43 16.5 12.22 16.5 12Z" fill="white"/>
                <path d="M19 12C19 12.94 18.8 13.82 18.46 14.64L19.97 16.15C20.62 14.91 21 13.5 21 12C21 7.72 18.01 4.14 14 3.23V5.29C16.89 6.15 19 8.83 19 12Z" fill="white"/>
                <path d="M3.27 4L2 5.27L7.73 11H3V13H7.73L12 17.27V20.73C12 21.5 12.5 22 13.27 22C13.55 22 13.82 21.92 14.05 21.77L16.73 19.09L19.73 22.09L21 20.82L3.27 4Z" fill="white"/>
                <path d="M12 4L9.91 6.09L12 8.18V4Z" fill="white"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9V15H7L12 20V4L7 9H3Z" fill="white"/>
                <path d="M16.5 12C16.5 10.23 15.5 8.71 14 7.97V16.03C15.5 15.29 16.5 13.77 16.5 12Z" fill="white"/>
                <path d="M14 3.23V5.29C16.89 6.15 19 8.83 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.72 18.01 4.14 14 3.23Z" fill="white"/>
              </svg>
            )}
          </button>
        )}
      </div>
    </section>
  );
}
