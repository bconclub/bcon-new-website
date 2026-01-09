'use client';

import { useState } from 'react';
import StaggeredMenu from '@/components/StaggeredMenu/StaggeredMenu';
import ComingSoonModal from '@/components/ComingSoonModal/ComingSoonModal';

export default function About() {
  const [showComingSoon, setShowComingSoon] = useState(true);

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'Work', ariaLabel: 'View our work', link: '/work' },
    { label: 'Services', ariaLabel: 'View our services', link: '/services' },
    { label: 'Hire Us', ariaLabel: 'Get in touch', link: '/' }
  ];

  const socialItems = [
    { label: 'Instagram', link: 'https://www.instagram.com/bconclub/' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/company/bconclub' },
    { label: 'YouTube', link: 'https://www.youtube.com/@bconclub' }
  ];

  const handleMenuItemClick = (item: { label: string; ariaLabel: string; link: string }) => {
    if (item.link !== '/') {
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

