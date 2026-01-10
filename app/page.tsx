'use client';

import { useState } from 'react';
import Loader from '@/effects/Loader/Loader';
import ScrollReveal from '@/sections/ScrollReveal/ScrollReveal';
import ServicesGrid from '@/sections/ServicesGrid/ServicesGrid';
import LiquidBentoPortfolio from '@/sections/LiquidBentoPortfolio/LiquidBentoPortfolio';
import GradualBlur from '@/effects/GradualBlur/GradualBlur';
import StaggeredMenu from '@/components/StaggeredMenu/StaggeredMenu';
import ComingSoonModal from '@/components/ComingSoonModal/ComingSoonModal';
import ContactSection from '@/sections/ContactSection/ContactSection';
import Footer from '@/sections/Footer/Footer';
import { ResponsiveSection } from '@/components/ResponsiveSection';
import * as Mobile from '@/components/mobile';
import * as Desktop from '@/components/desktop';

export default function Home() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Menu configuration
  const menuItems = [
    { label: 'Work', ariaLabel: 'View our work', link: '/work' },
    { label: 'Solutions', ariaLabel: 'View our solutions', link: '/services' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' } // Scrolls to contact section
  ];

  const handleMenuItemClick = (item: { label: string; ariaLabel: string; link: string }) => {
    // Show Coming Soon modal for internal page links
    // Keep contact (#contact) working - scrolls to contact section
    if (!item.link.startsWith('#')) {
      setShowComingSoon(true);
    }
  };

  const socialItems = [
    { label: 'Instagram', link: 'https://www.instagram.com/bconclub/' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/company/bconclub' },
    { label: 'YouTube', link: 'https://www.youtube.com/@bconclub' },
    { label: 'Facebook', link: 'https://www.facebook.com/bconclub' },
    { label: 'X', link: 'https://x.com/bconclub' }
  ];

  return (
    <>
      {/* StaggeredMenu Header - Fixed at top */}
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={false}
        accentColor="#CCFF00"
        onItemClick={handleMenuItemClick}
      />

      {/* PHASE 2: Coming Soon Modal */}
      <ComingSoonModal 
        isOpen={showComingSoon} 
        onClose={() => setShowComingSoon(false)}
        onGetInTouch={() => {
          setShowComingSoon(false);
          setTimeout(() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 300);
        }}
      />

      {/* Loader Animation */}
      <Loader />

      {/* Hero Section - Responsive */}
      <ResponsiveSection
        mobile={<Mobile.Hero />}
        desktop={<Desktop.Hero />}
      />

      {/* ==================== SECTION 2: SCROLL REVEAL ==================== */}
      <section className="section-two">
        <div className="section-container">
          <div className="reveal-text-container">
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={0}
              blurStrength={20}
              rotationEnd="bottom top"
              wordAnimationEnd="bottom center"
              containerClassName="reveal-line-1"
            >
              Creative minds that code.
            </ScrollReveal>
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={0}
              blurStrength={20}
              rotationEnd="bottom top"
              wordAnimationEnd="bottom center"
              containerClassName="reveal-line-2"
            >
              Technical hands that design.
            </ScrollReveal>
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={0}
              blurStrength={20}
              rotationEnd="bottom top"
              wordAnimationEnd="bottom center"
              containerClassName="reveal-line-3"
            >
              That's rare. That's BCON.
            </ScrollReveal>
          </div>
        </div>
      </section>
    
      {/* ==================== SECTION 3: SERVICES GRID ==================== */}
      <section className="section-three">
        <div className="section-container">
          <h2 className="section-heading">Solutions</h2>
          <ServicesGrid onServiceClick={() => setShowComingSoon(true)} />
        </div>
      </section>

      {/* ==================== SECTION 4: PORTFOLIO DUPLICATE ==================== */}
      <LiquidBentoPortfolio onInternalLinkClick={() => setShowComingSoon(true)} />

      {/* ==================== SECTION 5: BUSINESS APPS SECTION ==================== */}
      <ResponsiveSection
        mobile={<Mobile.BusinessApps />}
        desktop={<Desktop.BusinessApps />}
      />

      {/* ==================== SECTION 6: Contact ==================== */}
      <ContactSection onInternalLinkClick={() => setShowComingSoon(true)} />

      {/* ==================== FOOTER ==================== */}
      <Footer onInternalLinkClick={() => setShowComingSoon(true)} />

      {/* ==================== FIXED FOOTER BLUR ==================== */}
      <GradualBlur 
        target="page"
        position="bottom"
        height="8rem"
        strength={3}
        divCount={8}
        curve="bezier"
        exponential={true}
        opacity={1}
        style={{ zIndex: 50 }} 
      />
    </>
  );
}

