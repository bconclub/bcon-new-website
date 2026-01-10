'use client';

import { useState } from 'react';
// PHASE 2: Commented out - will show Coming Soon modal
// import ServicesDetail from '@/sections/ServicesDetail/ServicesDetail';
import StaggeredMenu from '@/components/StaggeredMenu/StaggeredMenu';
import ComingSoonModal from '@/components/ComingSoonModal/ComingSoonModal';
// PHASE 2: Commented out
// import GradualBlur from '@/effects/GradualBlur/GradualBlur';

export default function Services() {
  // PHASE 2: Show Coming Soon modal instead of services page
  const [showComingSoon, setShowComingSoon] = useState(true);

  const menuItems = [
    { label: 'Work', ariaLabel: 'View our work', link: '/work' },
    { label: 'Solutions', ariaLabel: 'View our solutions', link: '/services' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/#contact' }
  ];

  const socialItems = [
    { label: 'Instagram', link: 'https://www.instagram.com/bconclub/' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/company/bconclub' },
    { label: 'YouTube', link: 'https://www.youtube.com/@bconclub' },
    { label: 'Facebook', link: 'https://www.facebook.com/bconclub' },
    { label: 'X', link: 'https://x.com/bconclub' }
  ];

  const handleMenuItemClick = (item: { label: string; ariaLabel: string; link: string }) => {
    // Show Coming Soon modal for internal page links
    if (!item.link.startsWith('/#')) {
      setShowComingSoon(true);
    }
  };

  return (
    <>
      {/* StaggeredMenu Header */}
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={false}
        accentColor="#CCFF00"
        onItemClick={handleMenuItemClick}
      />

      {/* PHASE 2: Coming Soon Modal - shown when page is accessed directly */}
      <ComingSoonModal isOpen={showComingSoon} onClose={() => setShowComingSoon(false)} />

      {/* PHASE 2: Commented out - will be enabled in Phase 2 */}
      {/* <ServicesDetail />

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
      /> */}
    </>
  );
}



