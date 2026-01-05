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
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    // PHASE 2: Commented out - will show Coming Soon modal
    // { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
    // PHASE 2: Commented out - will show Coming Soon modal
    // { label: 'Work', ariaLabel: 'View our work', link: '/work' },
    { label: 'Work', ariaLabel: 'View our work', link: '/work' },
    // PHASE 2: Commented out - will show Coming Soon modal
    // { label: 'Services', ariaLabel: 'View our services', link: '/services' },
    { label: 'Services', ariaLabel: 'View our services', link: '/services' },
    // PHASE 2: Commented out - will show Coming Soon modal
    // { label: 'Hire Us', ariaLabel: 'Get in touch', link: '/contact' }
    { label: 'Hire Us', ariaLabel: 'Get in touch', link: '/contact' }
  ];

  const handleMenuItemClick = (item: { label: string; ariaLabel: string; link: string }) => {
    // PHASE 2: Show Coming Soon modal for non-homepage links
    if (item.link !== '/') {
      setShowComingSoon(true);
    }
  };

  const socialItems = [
    { label: 'Instagram', link: 'https://www.instagram.com/bconclub/' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/company/bconclub' },
    { label: 'YouTube', link: 'https://www.youtube.com/@bconclub' }
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
      <ComingSoonModal isOpen={showComingSoon} onClose={() => setShowComingSoon(false)} />

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
          <ServicesGrid />
        </div>
      </section>

      {/* ==================== SECTION 4: PORTFOLIO DUPLICATE ==================== */}
      <LiquidBentoPortfolio />

      {/* ==================== SECTION 5: BUSINESS APPS SECTION ==================== */}
      <ResponsiveSection
        mobile={<Mobile.BusinessApps />}
        desktop={<Desktop.BusinessApps />}
      />

      {/* ==================== SECTION 6: Contact ==================== */}
      <ContactSection />

      {/* ==================== FOOTER ==================== */}
      <Footer />

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

