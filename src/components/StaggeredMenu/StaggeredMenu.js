import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './StaggeredMenu.css';
import logoUrl from '../../assets/images/BCON-Logo.webp';

const StaggeredMenu = ({
  position = 'right',
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = false,
  accentColor = '#CCFF00',
  onMenuOpen,
  onMenuClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const panelRef = useRef(null);
  const itemsRef = useRef([]);
  const iconRef = useRef(null);
  const prelayersRef = useRef([]);

  // ✅ Scroll detection for frosted glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    if (!isOpen) {
      openMenu();
    } else {
      closeMenu();
    }
  };

  const openMenu = () => {
    setIsOpen(true);
    onMenuOpen?.();

    // Animate prelayers
    gsap.fromTo(
      prelayersRef.current,
      { x: position === 'right' ? '100%' : '-100%' },
      {
        x: 0,
        duration: 0.6,
        ease: 'power3.inOut',
        stagger: 0.08
      }
    );

    // Animate panel
    gsap.fromTo(
      panelRef.current,
      { x: position === 'right' ? '100%' : '-100%' },
      {
        x: 0,
        duration: 0.7,
        ease: 'power3.inOut'
      }
    );

    // Animate menu items
    gsap.fromTo(
      itemsRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.08,
        delay: 0.2
      }
    );

    // Animate icon to X
    gsap.to(iconRef.current.children[0], { rotation: 45, y: 0, duration: 0.3 });
    gsap.to(iconRef.current.children[1], { rotation: -45, y: 0, duration: 0.3 });
  };

  const closeMenu = () => {
    setIsOpen(false);
    onMenuClose?.();

    // Animate items out
    gsap.to(itemsRef.current, {
      y: -30,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      stagger: 0.04
    });

    // Animate panel out
    gsap.to(panelRef.current, {
      x: position === 'right' ? '100%' : '-100%',
      duration: 0.5,
      ease: 'power3.inOut',
      delay: 0.1
    });

    // Animate prelayers out
    gsap.to(prelayersRef.current, {
      x: position === 'right' ? '100%' : '-100%',
      duration: 0.5,
      ease: 'power3.inOut',
      stagger: 0.05
    });

    // Animate icon back
    gsap.to(iconRef.current.children[0], { rotation: 0, y: -3, duration: 0.3 });
    gsap.to(iconRef.current.children[1], { rotation: 0, y: 3, duration: 0.3 });
  };

  return (
    <div
      className={`staggered-menu-wrapper ${isOpen ? 'fixed-wrapper' : ''}`}
      data-open={isOpen || undefined}
      data-position={position}
      style={{ '--sm-accent': accentColor }}
    >
      {/* ✅ Header with logo and menu button */}
      <header className={`staggered-menu-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="sm-logo">
          <img src={logoUrl} alt="BCON Logo" className="sm-logo-img" />
        </div>

        <button
          className="sm-toggle"
          onClick={toggleMenu}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          <span className="sm-toggle-textWrap">
            <span className="sm-toggle-textInner">
              <span className="sm-toggle-line">Menu</span>
              <span className="sm-toggle-line">Close</span>
            </span>
          </span>
          <span className="sm-icon" ref={iconRef}>
            <span className="sm-icon-line" style={{ transform: 'translateY(-3px)' }} />
            <span className="sm-icon-line" style={{ transform: 'translateY(3px)' }} />
          </span>
        </button>
      </header>

      {/* ✅ Prelayers for staggered effect */}
      <div className="sm-prelayers">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="sm-prelayer"
            ref={(el) => (prelayersRef.current[i] = el)}
            style={{
              background: i === 0 ? 'rgba(0, 0, 0, 0.3)' : i === 1 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.7)',
              transform: position === 'right' ? 'translateX(100%)' : 'translateX(-100%)'
            }}
          />
        ))}
      </div>

      {/* ✅ Menu Panel */}
      <nav
        className="staggered-menu-panel"
        ref={panelRef}
        style={{ transform: position === 'right' ? 'translateX(100%)' : 'translateX(-100%)' }}
      >
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" data-numbering={displayItemNumbering || undefined}>
            {items.map((item, index) => (
              <li key={index} className="sm-panel-itemWrap">
                <a
                  href={item.link}
                  className="sm-panel-item"
                  aria-label={item.ariaLabel}
                  ref={(el) => (itemsRef.current[index] = el)}
                  onClick={closeMenu}
                >
                  <span className="sm-panel-itemLabel">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* ✅ Social Links */}
          {displaySocials && socialItems.length > 0 && (
            <div className="sm-socials" ref={(el) => (itemsRef.current[items.length] = el)}>
              <h3 className="sm-socials-title">Follow Us</h3>
              <ul className="sm-socials-list">
                {socialItems.map((social, index) => (
                  <li key={index}>
                    <a
                      href={social.link}
                      className="sm-socials-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default StaggeredMenu;