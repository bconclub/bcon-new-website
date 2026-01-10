'use client';

import { useState } from 'react';
import StaggeredMenu from '@/components/StaggeredMenu/StaggeredMenu';
import ComingSoonModal from '@/components/ComingSoonModal/ComingSoonModal';

export default function About() {
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
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={false}
        accentColor="#CCFF00"
        onItemClick={handleMenuItemClick}
      />
      
      <ComingSoonModal isOpen={showComingSoon} onClose={() => setShowComingSoon(false)} />
    </>
  );
}


