'use client';

import StaggeredMenu from '@/components/StaggeredMenu/StaggeredMenu';
import GradualBlur from '@/effects/GradualBlur/GradualBlur';
import ShowcaseSection from '@/sections/ShowcaseSection/ShowcaseSection';
import ShowcaseCard from '@/sections/ShowcaseCard/ShowcaseCard';

export default function Work() {
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/' },
    { label: 'Work', ariaLabel: 'View our work', link: '/' },
    { label: 'Services', ariaLabel: 'View our services', link: '/' },
    { label: 'Hire Us', ariaLabel: 'Get in touch', link: '/' }
  ];

  const socialItems = [
    { label: 'Instagram', link: 'https://www.instagram.com/bconclub/' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/company/bconclub' },
    { label: 'YouTube', link: 'https://www.youtube.com/@bconclub' }
  ];

  // Creative showcase items (6 items)
  const creativeItems = [
    {
      image: '/portfolio/11PC Launch.jpg',
      caption: 'Brand Identity System',
      side: 'left' as const,
      aspectRatio: '16:9' as const
    },
    {
      image: '/portfolio/Birdbox Launching Soon.jpg',
      caption: 'Marketing Campaign',
      side: 'right' as const,
      aspectRatio: '9:16' as const
    },
    {
      image: '/portfolio/11PC Event.jpg',
      caption: 'Social Media Content',
      side: 'left' as const,
      aspectRatio: '16:9' as const
    },
    {
      image: '/portfolio/WC Event.jpg',
      caption: 'Event Branding & Design',
      side: 'right' as const,
      aspectRatio: '9:16' as const
    },
    {
      image: '/portfolio/Laptopstore-Product-Ad.jpg',
      caption: 'Product Advertising',
      side: 'left' as const,
      aspectRatio: '16:9' as const
    },
    {
      image: '/portfolio/Come to Dubai.png',
      caption: 'Digital Campaign Assets',
      side: 'right' as const,
      aspectRatio: '9:16' as const
    }
  ];

  // Technology showcase items (6 placeholder items)
  const technologyItems = [
    {
      image: '/BRain.png',
      caption: 'AI Dashboard Platform',
      side: 'left' as const,
      aspectRatio: '16:9' as const
    },
    {
      image: '/Business Apps.png',
      caption: 'E-commerce Website',
      side: 'right' as const,
      aspectRatio: '9:16' as const
    },
    {
      image: '/Gulb Icon.png',
      caption: 'CRM Backend System',
      side: 'left' as const,
      aspectRatio: '16:9' as const
    },
    {
      image: '/BRain.png',
      caption: 'Mobile Application',
      side: 'right' as const,
      aspectRatio: '9:16' as const
    },
    {
      image: '/Business Apps.png',
      caption: 'Analytics Platform',
      side: 'left' as const,
      aspectRatio: '16:9' as const
    },
    {
      image: '/Gulb Icon.png',
      caption: 'Enterprise Software',
      side: 'right' as const,
      aspectRatio: '9:16' as const
    }
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

      {/* Section 1: Creative Work */}
      <ShowcaseSection 
        eyebrow="Our Work" 
        subheader="Creative" 
        accentColor="#CDFC2E"
      >
        {creativeItems.map((item, index) => (
          <ShowcaseCard
            key={`creative-${index}`}
            image={item.image}
            caption={item.caption}
            side={item.side}
            accentColor="#CDFC2E"
            index={index}
            aspectRatio={item.aspectRatio || '16:9'}
          />
        ))}
      </ShowcaseSection>

      {/* Section 2: Technology Work */}
      <ShowcaseSection 
        eyebrow="Our Work" 
        subheader="Technology" 
        accentColor="#6B2FE8"
      >
        {technologyItems.map((item, index) => (
          <ShowcaseCard
            key={`technology-${index}`}
            image={item.image}
            caption={item.caption}
            side={item.side}
            accentColor="#6B2FE8"
            index={index}
            aspectRatio={item.aspectRatio || '16:9'}
          />
        ))}
      </ShowcaseSection>

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
}



