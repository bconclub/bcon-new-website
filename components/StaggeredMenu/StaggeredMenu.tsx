'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import './StaggeredMenu.css';
import Image from 'next/image';
// Image will be loaded from public folder
const logoUrl = '/BCON White logo.webp';

interface MenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}

interface SocialItem {
  label: string;
  link: string;
}

interface StaggeredMenuProps {
  position?: 'left' | 'right';
  items?: MenuItem[];
  socialItems?: SocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  accentColor?: string;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  onItemClick?: (item: MenuItem) => void; // PHASE 2: Callback for menu item clicks
}

export default function StaggeredMenu({
  position = 'right',
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = false,
  accentColor = '#CCFF00',
  onMenuOpen,
  onMenuClose,
  onItemClick // PHASE 2: Callback for menu item clicks
}: StaggeredMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);
  const iconRef = useRef<HTMLSpanElement>(null);
  const prelayersRef = useRef<(HTMLDivElement | null)[]>([]);
  const pathname = usePathname();

  // Scroll detection for frosted glass effect
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
    if (prelayersRef.current.length > 0) {
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
    }

    // Animate panel
    if (panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { x: position === 'right' ? '100%' : '-100%' },
        {
          x: 0,
          duration: 0.7,
          ease: 'power3.inOut'
        }
      );
    }

    // Animate menu items
    if (itemsRef.current.length > 0) {
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
    }

    // Animate icon to X
    if (iconRef.current && iconRef.current.children.length >= 2) {
      gsap.to(iconRef.current.children[0] as HTMLElement, { rotation: 45, y: 0, duration: 0.3 });
      gsap.to(iconRef.current.children[1] as HTMLElement, { rotation: -45, y: 0, duration: 0.3 });
    }
  };

  const closeMenu = () => {
    if (!isOpen) return;
    
    setIsOpen(false);
    onMenuClose?.();

    // Animate items out
    if (itemsRef.current.length > 0) {
      gsap.to(itemsRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        stagger: 0.04
      });
    }

    // Animate panel out
    if (panelRef.current) {
      gsap.to(panelRef.current, {
        x: position === 'right' ? '100%' : '-100%',
        duration: 0.5,
        ease: 'power3.inOut',
        delay: 0.1
      });
    }

    // Animate prelayers out
    if (prelayersRef.current.length > 0) {
      gsap.to(prelayersRef.current, {
        x: position === 'right' ? '100%' : '-100%',
        duration: 0.5,
        ease: 'power3.inOut',
        stagger: 0.05
      });
    }

    // Animate icon back
    if (iconRef.current && iconRef.current.children.length >= 2) {
      gsap.to(iconRef.current.children[0] as HTMLElement, { rotation: 0, y: -3, duration: 0.3 });
      gsap.to(iconRef.current.children[1] as HTMLElement, { rotation: 0, y: 3, duration: 0.3 });
    }
  };

  // Handle click outside to close menu
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking on the menu button or header
      const target = event.target as HTMLElement;
      if (target.closest('.sm-toggle') || target.closest('.staggered-menu-header')) {
        return;
      }
      
      // Don't close if clicking inside the menu panel
      if (panelRef.current && panelRef.current.contains(target)) {
        return;
      }

      // Close menu if clicking anywhere else
      closeMenu();
    };

    // Add event listener with a small delay to avoid immediate closure
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, position]);

  const isExternalLink = (link: string) => {
    return link.startsWith('http') || link.startsWith('https') || link.startsWith('mailto:') || link.startsWith('tel:');
  };

  return (
    <div
      className={`staggered-menu-wrapper ${isOpen ? 'fixed-wrapper' : ''}`}
      data-open={isOpen || undefined}
      data-position={position}
      style={{ '--sm-accent': accentColor } as React.CSSProperties}
    >
      {/* Header with logo and menu button */}
      <header 
        className={`staggered-menu-header ${isScrolled ? 'scrolled' : ''}`}
      >
        <Link href="/" className="sm-logo" aria-label="Go to homepage" onClick={closeMenu}>
          <Image src={logoUrl} alt="BCON Logo" className="sm-logo-img" width={120} height={40} />
        </Link>

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

      {/* Backdrop overlay - click to close */}
      {isOpen && (
        <div 
          className="sm-backdrop" 
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Prelayers for staggered effect */}
      <div className="sm-prelayers">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="sm-prelayer"
            ref={(el) => { prelayersRef.current[i] = el; }}
            style={{
              background: i === 0 ? 'rgba(0, 0, 0, 0.3)' : i === 1 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.7)',
              transform: position === 'right' ? 'translateX(100%)' : 'translateX(-100%)'
            }}
          />
        ))}
      </div>

      {/* Menu Panel */}
      <nav
        className="staggered-menu-panel"
        ref={panelRef}
        style={{ transform: position === 'right' ? 'translateX(100%)' : 'translateX(-100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" data-numbering={displayItemNumbering || undefined}>
            {items.map((item, index) => {
              const isExternal = isExternalLink(item.link);
              const linkContent = (
                <span className="sm-panel-itemLabel">{item.label}</span>
              );

              // PHASE 2: Show Coming Soon modal for non-homepage internal links
              const handleItemClick = (e: React.MouseEvent) => {
                e.preventDefault();
                closeMenu();
                if (onItemClick) {
                  onItemClick(item);
                }
              };

              // Homepage link should work normally
              const isHomepage = item.link === '/';

              return (
                <li key={index} className="sm-panel-itemWrap">
                  {isExternal ? (
                    <a
                      href={item.link}
                      className="sm-panel-item"
                      aria-label={item.ariaLabel}
                      ref={(el) => { itemsRef.current[index] = el; }}
                      onClick={closeMenu}
                    >
                      {linkContent}
                    </a>
                  ) : isHomepage ? (
                    <Link
                      href={item.link}
                      className="sm-panel-item"
                      aria-label={item.ariaLabel}
                      ref={(el) => { itemsRef.current[index] = el; }}
                      onClick={closeMenu}
                    >
                      {linkContent}
                    </Link>
                  ) : (
                    <button
                      className="sm-panel-item"
                      aria-label={item.ariaLabel}
                      ref={(el) => { itemsRef.current[index] = el; }}
                      onClick={handleItemClick}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        padding: 0, 
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left'
                      }}
                    >
                      {linkContent}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Social Links */}
          {displaySocials && socialItems.length > 0 && (
            <div className="sm-socials" ref={(el) => { itemsRef.current[items.length] = el; }}>
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
}

