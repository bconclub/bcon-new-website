'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './ComingSoonModal.css';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetInTouch?: () => void; // Optional callback for "Get in Touch" button
}

export default function ComingSoonModal({ isOpen, onClose, onGetInTouch }: ComingSoonModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Animate modal in
    if (modalRef.current && backdropRef.current) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );

      gsap.fromTo(
        modalRef.current,
        { scale: 0.95, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', delay: 0.1 }
      );
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    if (modalRef.current && backdropRef.current) {
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.2 });
      gsap.to(modalRef.current, {
        scale: 0.95,
        opacity: 0,
        y: 20,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: onClose
      });
    } else {
      onClose();
    }
  };

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="coming-soon-modal-backdrop" ref={backdropRef} onClick={handleClose}>
      <div
        className="coming-soon-modal"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="coming-soon-modal-close"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="coming-soon-modal-content">
          <h2 className="coming-soon-modal-title">
            Magic Brewing{' '}
            <span className="coming-soon-modal-icon">🧪</span>
          </h2>
          <p className="coming-soon-modal-message">
            We're working on this part now
          </p>
        </div>

        <div className="coming-soon-modal-actions">
          <button 
            className="coming-soon-modal-button" 
            onClick={() => {
              handleClose();
              if (onGetInTouch) {
                onGetInTouch();
              } else {
                // Default: scroll to contact section or navigate to homepage with contact hash
                if (typeof window !== 'undefined') {
                  if (window.location.pathname === '/') {
                    // Small delay to ensure modal closes first
                    setTimeout(() => {
                      const contactSection = document.getElementById('contact');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 300);
                  } else {
                    // Navigate to homepage with contact hash
                    window.location.href = '/#contact';
                  }
                }
              }
            }}
          >
            Talk to us
          </button>
        </div>
      </div>
    </div>
  );
}

