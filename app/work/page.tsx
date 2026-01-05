'use client';

import { useEffect, useState } from 'react';
import StaggeredMenu from '@/components/StaggeredMenu/StaggeredMenu';
import ComingSoonModal from '@/components/ComingSoonModal/ComingSoonModal';
// PHASE 2: Commented out - will show Coming Soon modal
// import StoryHighlights, { StoryHighlight } from '@/sections/StoryHighlights/StoryHighlights';
// import CategoryToggle from '@/sections/CategoryToggle/CategoryToggle';
// import CaseStudyModal from '@/sections/CaseStudyModal/CaseStudyModal';
// import { ResponsiveSection } from '@/components/ResponsiveSection';
// import * as Mobile from '@/components/mobile';
// import * as Desktop from '@/components/desktop';
import './work.css';

interface WorkItem {
  id: string;
  client_name: string;
  project_title: string;
  project_type?: string;
  category: 'creative' | 'tech';
  thumbnail_url?: string;
  thumbnail_aspect_ratio?: 'square' | 'tall' | 'story' | 'wide' | 'auto';
  hero_media_url?: string;
  hero_media_type?: 'image' | 'video';
  description?: string;
  challenge?: string;
  solution?: string;
  approach?: string;
  tech_stack?: string[];
  metrics?: Array<{ label: string; description?: string }>;
  live_url?: string;
  industry?: string;
  work_media?: Array<{
    id: string;
    media_url: string;
    media_type: 'image' | 'video';
    aspect_ratio?: string;
    section: 'creative' | 'tech';
    caption?: string;
    order_index: number;
  }>;
}

export default function Work() {
  // PHASE 2: Show Coming Soon modal instead of work page
  const [showComingSoon, setShowComingSoon] = useState(true);
  
  // PHASE 2: Commented out - will be enabled in Phase 2
  // const [activeCategory, setActiveCategory] = useState<'creative' | 'tech'>('creative');
  // const [selectedWorkItem, setSelectedWorkItem] = useState<WorkItem | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [storyHighlights, setStoryHighlights] = useState<StoryHighlight[]>([]);
  // const [loading, setLoading] = useState(true);

  // PHASE 2: Commented out
  // useEffect(() => {
  //   fetchStoryHighlights();
  // }, []);

  // PHASE 2: Commented out - will be enabled in Phase 2
  // const fetchStoryHighlights = async () => {
  //   try {
  //     const response = await fetch('/api/story-highlights');
  //     const result = await response.json();
  //     
  //     if (result.data) {
  //       const highlights: StoryHighlight[] = result.data.map((item: any) => ({
  //         id: item.id,
  //         label: item.title,
  //         thumbnail: item.thumbnail_url,
  //         gradient: getGradientForCategory(item.category),
  //         filterTag: item.filter_tag,
  //         onClick: () => {
  //           if (item.filter_tag) {
  //             if (item.filter_tag === 'creative' || item.filter_tag === 'tech') {
  //               setActiveCategory(item.filter_tag as 'creative' | 'tech');
  //             }
  //           }
  //         },
  //       }));
  //       setStoryHighlights(highlights);
  //     } else {
  //       setStoryHighlights(getDefaultHighlights());
  //     }
  //   } catch (error) {
  //     console.error('Error fetching story highlights:', error);
  //     setStoryHighlights(getDefaultHighlights());
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // PHASE 2: Commented out
  // const getDefaultHighlights = (): StoryHighlight[] => {
  //   return [
  //     {
  //       id: 'featured',
  //       label: 'Featured',
  //       gradient: 'linear-gradient(135deg, #CDFC2E 0%, #6B2FE8 100%)',
  //       onClick: () => {},
  //     },
  //     {
  //       id: 'creative',
  //       label: 'Creative',
  //       gradient: 'linear-gradient(135deg, #CDFC2E 0%, #06B6D4 100%)',
  //       onClick: () => setActiveCategory('creative'),
  //     },
  //     {
  //       id: 'technology',
  //       label: 'Technology',
  //       gradient: 'linear-gradient(135deg, #6B2FE8 0%, #06B6D4 100%)',
  //       onClick: () => setActiveCategory('tech'),
  //     },
  //     {
  //       id: 'recent',
  //       label: 'Recent',
  //       gradient: 'linear-gradient(135deg, #06B6D4 0%, #CDFC2E 100%)',
  //       onClick: () => {},
  //     },
  //     {
  //       id: 'client-stories',
  //       label: 'Client Stories',
  //       gradient: 'linear-gradient(135deg, #CDFC2E 0%, #6B2FE8 50%, #06B6D4 100%)',
  //       onClick: () => {},
  //     },
  //   ];
  // };

  // PHASE 2: Commented out
  // const getGradientForCategory = (category: string): string => {
  //   const gradients: Record<string, string> = {
  //     featured: 'linear-gradient(135deg, #CDFC2E 0%, #6B2FE8 100%)',
  //     creative: 'linear-gradient(135deg, #CDFC2E 0%, #06B6D4 100%)',
  //     technology: 'linear-gradient(135deg, #6B2FE8 0%, #06B6D4 100%)',
  //     recent: 'linear-gradient(135deg, #06B6D4 0%, #CDFC2E 100%)',
  //     'client-stories': 'linear-gradient(135deg, #CDFC2E 0%, #6B2FE8 50%, #06B6D4 100%)',
  //   };
  //   return gradients[category.toLowerCase()] || gradients.featured;
  // };

  // PHASE 2: Commented out
  // const handleCardClick = (workItem: any) => {
  //   fetch(`/api/work/${workItem.id}`)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       if (result.data) {
  //         setSelectedWorkItem(result.data);
  //       } else {
  //         setSelectedWorkItem(workItem);
  //       }
  //       setIsModalOpen(true);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching work item details:', error);
  //       setSelectedWorkItem(workItem);
  //       setIsModalOpen(true);
  //     });
  // };

  // PHASE 2: Commented out
  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  //   setSelectedWorkItem(null);
  // };

  // Menu configuration
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/' },
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
    // PHASE 2: Show Coming Soon modal for non-homepage links
    if (item.link !== '/') {
      setShowComingSoon(true);
    }
  };

  // PHASE 2: Commented out - will be enabled in Phase 2
  // if (loading) {
  //   return (
  //     <>
  //       <StaggeredMenu
  //         position="right"
  //         items={menuItems}
  //         socialItems={socialItems}
  //         displaySocials={true}
  //         displayItemNumbering={false}
  //         accentColor="#CCFF00"
  //       />
  //       <div className="work-page-loading">
  //         <div className="work-loading-spinner" />
  //         <p>Loading our work...</p>
  //       </div>
  //     </>
  //   );
  // }

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
      
      {/* PHASE 2: Coming Soon Modal - shown when page is accessed directly */}
      <ComingSoonModal isOpen={showComingSoon} onClose={() => setShowComingSoon(false)} />

      {/* PHASE 2: Commented out - will be enabled in Phase 2 */}
      {/* <div className="work-page">
        <header className="work-page-header">
          <h1 className="work-page-title">Our Work</h1>
          <div className="work-page-header-actions">
            <button className="work-header-icon" aria-label="Search">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </header>

        {storyHighlights.length > 0 && (
          <StoryHighlights highlights={storyHighlights} />
        )}

        <CategoryToggle
          activeCategory={activeCategory}
          onToggle={setActiveCategory}
        />

        <ResponsiveSection
          mobile={<Mobile.WorkGrid category={activeCategory} onCardClick={handleCardClick} />}
          desktop={<Desktop.WorkGrid category={activeCategory} onCardClick={handleCardClick} />}
        />

        <CaseStudyModal
          workItem={selectedWorkItem}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div> */}
    </>
  );
}
