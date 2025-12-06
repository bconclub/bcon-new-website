import React from 'react';
import LiquidBentoPortfolio from '../sections/LiquidBentoPortfolio/LiquidBentoPortfolio';
import StaggeredMenu from '../components/StaggeredMenu/StaggeredMenu';
import GradualBlur from '../effects/GradualBlur/GradualBlur';

const AllWork = () => {
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/#about' },
    { label: 'Work', ariaLabel: 'View our work', link: '/#work' },
    { label: 'Hire Us', ariaLabel: 'Get in touch', link: 'https://wa.me/919353253817' }
  ];

  const socialItems = [
    { label: 'Instagram', link: 'https://www.instagram.com/bconclub/' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/company/bconclub' },
    { label: 'YouTube', link: 'https://www.youtube.com/@bconclub' }
  ];

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
      />

      {/* All Work Portfolio - shows all items */}
      <LiquidBentoPortfolio />

      {/* Fixed Footer Blur */}
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
};

export default AllWork;
