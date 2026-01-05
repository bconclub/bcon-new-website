'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import WorkHeroVideo from '@/sections/WorkHeroVideo/WorkHeroVideo';
import './LiquidBentoPortfolio.css';

gsap.registerPlugin(ScrollTrigger);

// Helper function to properly encode image paths with spaces
// encodeURI preserves slashes but encodes spaces and special characters
const encodeImagePath = (path: string): string => {
  return encodeURI(path);
};

interface PortfolioItem {
  id: string | number;
  type: 'vimeo' | 'video' | 'image';
  src: string;
  ratio: string;
  title: string;
  isPaired?: boolean;
  highlights?: string[];
  description?: string;
}

// Featured Vimeo item stays first
const featuredVimeoItem: PortfolioItem = { id: 'thar-ai-ad', type: 'vimeo', src: '1143755754', ratio: '9:16', title: 'Thar AI Ad' };

// Raw items - will be normalized
const rawAllItems: PortfolioItem[] = [
  featuredVimeoItem,
  { id: 'comet-ai', type: 'video', src: '/portfolio/Comet Ai Video.mp4', ratio: '1:1', title: 'Comet AI' },
  { id: 'campa-cola', type: 'video', src: '/portfolio/Campa Cola.mp4', ratio: '9:16', title: 'Campa Cola' },
  { id: 2, type: 'video', src: '/portfolio/Birdbox Reel.mp4', ratio: '9:16', title: 'Social Reel' },
  { id: 3, type: 'image', src: '/portfolio/Come to Dubai.png', ratio: '1:1', title: 'Instagram Post' },
  { id: 4, type: 'video', src: '/portfolio/WOW VFX.mp4', ratio: '16:9', title: 'Event Launch' },
  { id: 5, type: 'video', src: '/portfolio/Laptopstore Offer.mp4', ratio: '1:1', title: 'Brand Offer' },
  { id: 6, type: 'image', src: '/portfolio/Laptopstore-Product-Ad.jpg', ratio: '1:1', title: 'Product Ad' },
  { id: 7, type: 'video', src: '/portfolio/Mini Chopper.mp4', ratio: '9:16', title: 'Product Ads' },
  { id: 8, type: 'video', src: '/portfolio/Nexus Algo Intro.mp4', ratio: '16:9', title: 'YouTube Content' },
  { id: 9, type: 'video', src: '/portfolio/OR Move With.mp4', ratio: '9:16', title: 'Brand Video' },
  { id: 10, type: 'video', src: '/portfolio/Portable Juicer.mp4', ratio: '1:1', title: 'Product Ads' },
  { id: 11, type: 'video', src: '/portfolio/Vyjayanthi Movies.mp4', ratio: '16:9', title: 'Website Video' },
  { id: 12, type: 'image', src: '/portfolio/WC Event.jpg', ratio: '1:1', title: 'Event Ads' },
  { id: 13, type: 'video', src: '/portfolio/WC Facility.mp4', ratio: '16:9', title: 'Brand Asset' },
  { id: 14, type: 'video', src: '/portfolio/WOW VFX.mp4', ratio: '1:1', title: 'VFX Showreel' }
];

const rawMobileItems: PortfolioItem[] = [
  { id: 'm-thar-ai-ad', type: 'vimeo', src: '1143755754', ratio: '9:16', title: 'Thar AI Ad' },
  { id: 'm-comet-ai', type: 'video', src: '/portfolio/Comet Ai Video.mp4', ratio: '1:1', title: 'Comet AI' },
  { id: 'm-campa-cola', type: 'video', src: '/portfolio/Campa Cola.mp4', ratio: '9:16', title: 'Campa Cola' },
  { id: 'm-2', type: 'video', src: '/portfolio/Vyjayanthi Movies.mp4', ratio: '16:9', title: 'Website Video' },
  { id: 'm-3', type: 'image', src: '/portfolio/Come to Dubai.png', ratio: '1:1', title: 'Instagram Post' },
  { id: 'm-4', type: 'video', src: '/portfolio/Birdbox Reel.mp4', ratio: '9:16', title: 'Social Reel' },
  { id: 'm-5', type: 'video', src: '/portfolio/Laptopstore Offer.mp4', ratio: '1:1', title: 'Brand Offer' },
  { id: 'm-6', type: 'video', src: '/portfolio/WC Facility.mp4', ratio: '16:9', title: 'Brand Asset' }
];

// Normalize aspect ratios - keep actual video ratios: 9:16, 1:1, 16:9, 4:3
const normalizeRatio = (ratio: string): string => {
  if (ratio === '9:16' || ratio === '1:1' || ratio === '16:9' || ratio === '4:3') {
    return ratio;
  }
  
  if (ratio === '4:5' || ratio === '3:4' || ratio === '2:3') {
    return '9:16';
  }
  
  if (ratio === '21:9' || ratio === '5:4') {
    return '16:9';
  }
  
  return '1:1';
};

// Normalize item ratios
const normalizeItemRatios = (items: PortfolioItem[]): PortfolioItem[] => {
  return items.map(item => ({
    ...item,
    ratio: normalizeRatio(item.ratio)
  }));
};

// Normalize all items
const allItems = normalizeItemRatios(rawAllItems);
const mobileItems = normalizeItemRatios(rawMobileItems);

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Intelligent arrangement: Mix items to avoid same-sized items next to each other horizontally
const arrangeItemsIntelligently = (items: PortfolioItem[], columnCount: number): PortfolioItem[] => {
  if (columnCount <= 2) {
    return items;
  }

  const verticalItems = items.filter(item => item.ratio === '9:16');
  const squareItems = items.filter(item => item.ratio === '1:1');
  const landscapeItems = items.filter(item => item.ratio === '16:9');
  const standardItems = items.filter(item => item.ratio === '4:3');

  const arranged: PortfolioItem[] = [];
  
  const pools: Record<string, PortfolioItem[]> = {
    '9:16': [...verticalItems],
    '1:1': [...squareItems],
    '16:9': [...landscapeItems],
    '4:3': [...standardItems]
  };

  const poolIndices: Record<string, number> = {
    '9:16': 0,
    '1:1': 0,
    '16:9': 0,
    '4:3': 0
  };

  const getNextFromPool = (ratio: string): PortfolioItem | null => {
    const pool = pools[ratio];
    if (!pool || poolIndices[ratio] >= pool.length) return null;
    return pool[poolIndices[ratio]++];
  };

  const hasAvailable = (ratio: string): boolean => {
    return pools[ratio] !== undefined && poolIndices[ratio] < pools[ratio].length;
  };

  const totalItems = items.length;
  
  while (arranged.length < totalItems) {
    const usedInRow = new Set<string>();
    
    for (let col = 0; col < columnCount; col++) {
      if (arranged.length >= totalItems) break;
      
      const ratios = ['9:16', '1:1', '16:9', '4:3'];
      let item: PortfolioItem | null = null;
      let selectedRatio: string | null = null;
      
      for (const ratio of ratios) {
        if (!usedInRow.has(ratio) && hasAvailable(ratio)) {
          item = getNextFromPool(ratio);
          if (item) {
            selectedRatio = ratio;
            usedInRow.add(ratio);
            break;
          }
        }
      }
      
      if (!item) {
        for (const ratio of ratios) {
          if (hasAvailable(ratio)) {
            item = getNextFromPool(ratio);
            if (item) {
              selectedRatio = ratio;
              break;
            }
          }
        }
      }
      
      if (item) {
        arranged.push(item);
      }
    }
  }

  return arranged.length > 0 ? arranged : items;
};

interface LiquidBentoPortfolioProps {
  eyebrowText?: string;
  headingText?: string;
  isBusinessApps?: boolean;
}

export default function LiquidBentoPortfolio({ 
  eyebrowText = 'Our Work', 
  headingText = 'Creative',
  isBusinessApps = false
}: LiquidBentoPortfolioProps) {
  const [visibleCount, setVisibleCount] = useState(8);
  const [secondSectionVisibleCount, setSecondSectionVisibleCount] = useState(8);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [columnCount, setColumnCount] = useState(5);
  const [playedMap, setPlayedMap] = useState<Record<string, boolean>>({});
  const [vimeoLoadedMap, setVimeoLoadedMap] = useState<Record<string, boolean>>({});
  const [vimeoLoadingMap, setVimeoLoadingMap] = useState<Record<string, boolean>>({});
  const [vimeoLoadingProgress, setVimeoLoadingProgress] = useState<Record<string, number>>({});
  const [vimeoThumbnails, setVimeoThumbnails] = useState<Record<string, string>>({});
  const [clickedVideos, setClickedVideos] = useState<Record<string, boolean>>({});
  const [inViewMap, setInViewMap] = useState<Record<string, boolean>>({});
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<Record<string, HTMLVideoElement>>({});
  const vimeoIframeRefs = useRef<Record<string, HTMLIFrameElement>>({});
  
  // Second section state
  const [secondSectionPlayedMap, setSecondSectionPlayedMap] = useState<Record<string, boolean>>({});
  const [secondSectionVimeoLoadedMap, setSecondSectionVimeoLoadedMap] = useState<Record<string, boolean>>({});
  const [secondSectionVimeoLoadingMap, setSecondSectionVimeoLoadingMap] = useState<Record<string, boolean>>({});
  const [secondSectionVimeoLoadingProgress, setSecondSectionVimeoLoadingProgress] = useState<Record<string, number>>({});
  const [secondSectionVimeoThumbnails, setSecondSectionVimeoThumbnails] = useState<Record<string, string>>({});
  const [secondSectionClickedVideos, setSecondSectionClickedVideos] = useState<Record<string, boolean>>({});
  const [secondSectionInViewMap, setSecondSectionInViewMap] = useState<Record<string, boolean>>({});
  const secondSectionItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const secondSectionVideoRefs = useRef<Record<string, HTMLVideoElement>>({});
  const secondSectionVimeoIframeRefs = useRef<Record<string, HTMLIFrameElement>>({});

  // Second section items
  const allSecondSectionItems = useMemo(() => {
    const rawItems: PortfolioItem[] = [
      { id: 'thar-ai-ad', type: 'vimeo', src: '1143755754', ratio: '9:16', title: 'Thar AI Ad' },
      { id: 'vyjayanthi-movies-intro', type: 'vimeo', src: '1143763635', ratio: '16:9', title: 'Vyjayanthi Movies Intro' },
      { id: 'laptopstore-swap-deals', type: 'vimeo', src: '1143775448', ratio: '1:1', title: 'Laptopstore Swap Deals' },
      { id: 'campa-cola-ai-ad', type: 'vimeo', src: '1143776342', ratio: '9:16', title: 'Campa Cola AI Ad' },
      { id: 'comet-ai-ad', type: 'vimeo', src: '1143777731', ratio: '4:3', title: 'Comet AI Ad' },
      { id: 'organix-rosa-brand', type: 'vimeo', src: '1143785386', ratio: '9:16', title: 'Organix Rosa Brand' },
      { id: 'birdbox-brand-video', type: 'vimeo', src: '1143892769', ratio: '9:16', title: 'Birdbox Brand Video' },
      { id: '11pc-launch', type: 'image', src: '/portfolio/11PC Launch.jpg', ratio: '1:1', title: '11PC Launch' },
      { id: '11pc-event', type: 'image', src: '/portfolio/11PC Event.jpg', ratio: '1:1', title: '11PC Event' },
      { id: 'birdbox-launching-soon', type: 'image', src: '/portfolio/Birdbox Launching Soon.jpg', ratio: '1:1', title: 'Birdbox Launching Soon' },
      { id: 'come-to-dubai', type: 'image', src: '/portfolio/Come to Dubai.png', ratio: '1:1', title: 'Come to Dubai' },
      { id: 'laptopstore-product-ad', type: 'image', src: '/portfolio/Laptopstore-Product-Ad.jpg', ratio: '1:1', title: 'Laptopstore Product Ad' },
      { id: 'wc-event', type: 'image', src: '/portfolio/WC Event.jpg', ratio: '1:1', title: 'WC Event' }
    ];
    return normalizeItemRatios(rawItems);
  }, []);

  // Intelligently arranged items
  const desktopItems = useMemo(() => {
    const shuffled = shuffleArray(allItems.slice(1));
    const arranged = arrangeItemsIntelligently([featuredVimeoItem, ...shuffled], 5);
    return arranged;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        setDeviceType('mobile');
        setColumnCount(2);
        setVisibleCount(6);
        setSecondSectionVisibleCount(allSecondSectionItems.length);
      } else if (width < 1200) {
        setDeviceType('tablet');
        setColumnCount(3);
        setVisibleCount(6);
        setSecondSectionVisibleCount(allSecondSectionItems.length);
      } else {
        setDeviceType('desktop');
        setColumnCount(5);
        setVisibleCount(10);
        setSecondSectionVisibleCount(allSecondSectionItems.length);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [allSecondSectionItems.length]);

  // GSAP animations with ScrollTrigger
  useEffect(() => {
    secondSectionItemsRef.current.forEach((item, index) => {
      if (!item) return;
      
      gsap.fromTo(
        item,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: index * 0.03,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger && secondSectionItemsRef.current.includes(trigger.vars.trigger as HTMLDivElement)) {
          trigger.kill();
        }
      });
    };
  }, []);

  const getRatioClass = (ratio: string): string => {
    if (ratio === '9:16') return 'ratio-stories';
    if (ratio === '1:1') return 'ratio-square';
    if (ratio === '16:9') return 'ratio-landscape';
    if (ratio === '4:3') return 'ratio-standard';
    return 'ratio-square';
  };

  // Fetch Vimeo thumbnail
  const fetchVimeoThumbnail = async (videoId: string, setThumbnailMap: React.Dispatch<React.SetStateAction<Record<string, string>>>): Promise<string> => {
    if (setThumbnailMap === setVimeoThumbnails && vimeoThumbnails[videoId]) {
      return vimeoThumbnails[videoId];
    }
    if (setThumbnailMap === setSecondSectionVimeoThumbnails && secondSectionVimeoThumbnails[videoId]) {
      return secondSectionVimeoThumbnails[videoId];
    }

    let thumbnail: string;
    const thumbnailMap: Record<string, string> = {
      '1143755754': '/portfolio/thumbnails/That AI Thumbnail.webp',
      '1143775448': '/portfolio/thumbnails/LS Swap Thumbnail.webp',
      '1143776342': '/portfolio/thumbnails/Campa Cola AI Ad.webp',
      '1143777731': '/portfolio/thumbnails/Comet AI Ad.webp',
      '1143785386': '/portfolio/thumbnails/Organix Rosa Move In.webp',
      '1143892769': '/portfolio/thumbnails/Birdbox Claude Thumbnail.webp'
    };

    thumbnail = thumbnailMap[videoId] || `https://vumbnail.com/${videoId}.jpg`;
    
    setThumbnailMap((prev) => ({ ...prev, [videoId]: thumbnail }));
    return thumbnail;
  };

  const items = deviceType === 'mobile' ? mobileItems : desktopItems;
  const visibleItems = useMemo(() => {
    const arranged = arrangeItemsIntelligently(items, columnCount);
    return arranged.slice(0, visibleCount);
  }, [items, columnCount, visibleCount]);

  const handlePlay = async (id: string | number, src: string) => {
    const idStr = String(id);
    if (playedMap[idStr]) {
      handlePause(id);
      return;
    }
    
    const item = visibleItems.find(i => String(i.id) === idStr);
    const isVimeo = item?.type === 'vimeo';
    
    if (!isVimeo) {
      Object.keys(videoRefs.current).forEach((videoId) => {
        if (videoId !== idStr && videoRefs.current[videoId]) {
          const otherVid = videoRefs.current[videoId];
          if (otherVid.pause && !otherVid.paused) {
            otherVid.pause();
          }
          if (otherVid.currentTime !== undefined) {
            otherVid.currentTime = 0;
          }
        }
      });
    }
    
    setPlayedMap((prev) => {
      const newMap: Record<string, boolean> = {};
      Object.keys(prev).forEach((videoId) => {
        if (videoId !== idStr) {
          newMap[videoId] = false;
        }
      });
      newMap[idStr] = true;
      return newMap;
    });
    
    if (isVimeo) {
      setVimeoLoadingMap((prev) => ({ ...prev, [idStr]: true }));
      setVimeoLoadingProgress((prev) => ({ ...prev, [idStr]: 0 }));
      
      const progressInterval = setInterval(() => {
        setVimeoLoadingProgress((prev) => {
          const current = prev[idStr] || 0;
          if (current >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [idStr]: current + 10 };
        });
      }, 100);
      
      await fetchVimeoThumbnail(src, setVimeoThumbnails);
      setVimeoLoadedMap((prev) => ({ ...prev, [idStr]: true }));
      
      setTimeout(() => {
        setVimeoLoadingProgress((prev) => ({ ...prev, [idStr]: 100 }));
        setTimeout(() => {
          setVimeoLoadingMap((prev) => ({ ...prev, [idStr]: false }));
          setVimeoLoadingProgress((prev) => ({ ...prev, [idStr]: 0 }));
        }, 200);
      }, 500);
      return;
    }
    
    const vid = videoRefs.current[idStr];
    if (!vid) return;
    
    if (!vid.src && src) {
      vid.src = src;
      vid.load();
    }
    
    const waitForBuffer = (): Promise<void> => {
      return new Promise((resolve) => {
        if (vid.readyState >= 3) {
          resolve();
        } else {
          const onCanPlay = () => {
            vid.removeEventListener('canplay', onCanPlay);
            resolve();
          };
          vid.addEventListener('canplay', onCanPlay);
          setTimeout(() => {
            vid.removeEventListener('canplay', onCanPlay);
            resolve();
          }, 3000);
        }
      });
    };
    
    await waitForBuffer();
    
    try {
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
    } catch (error) {
      console.log('Play interrupted:', error);
    }
  };

  const handlePause = (id: string | number) => {
    const idStr = String(id);
    const item = visibleItems.find(i => String(i.id) === idStr);
    const isVimeo = item?.type === 'vimeo';
    
    if (!isVimeo) {
      const vid = videoRefs.current[idStr];
      if (vid && vid.pause && !vid.paused) {
        vid.pause();
        if (vid.currentTime !== undefined) {
          vid.currentTime = 0;
        }
      }
    }
    
    setPlayedMap((prev) => ({ ...prev, [idStr]: false }));
  };

  // Business Apps specific items - 16:9 and 9:16 videos
  const businessAppsItems = useMemo(() => {
    if (!isBusinessApps) return [];
    
    // Create items for carousel with project details
    return [
      { 
        id: 'ba-tech-video', 
        type: 'vimeo' as const, 
        src: '1151200145', 
        ratio: '9:16', 
        title: 'PROXe AI System',
        description: 'An intelligent AI-powered system for business automation',
        highlights: [
          'AI-powered automation',
          'Real-time analytics dashboard',
          'Custom workflow builder',
          'Multi-platform integration'
        ]
      },
      { 
        id: 'ba-16-9-2', 
        type: 'vimeo' as const, 
        src: '1151200982', 
        ratio: '9:16', 
        title: 'Turquoise Travel App',
        description: 'A comprehensive travel management platform',
        highlights: [
          'Trip planning & booking',
          'Real-time flight tracking',
          'Hotel & activity recommendations',
          'Social travel sharing'
        ]
      },
      { 
        id: 'ba-9-16-1', 
        type: 'vimeo' as const, 
        src: '1151208224', 
        ratio: '9:16', 
        title: 'Adipoli RestauApp System',
        description: 'Complete restaurant management solution',
        highlights: [
          'Table reservation system',
          'Menu management',
          'Order tracking',
          'Customer loyalty program'
        ]
      },
      { 
        id: 'ba-9-16-2', 
        type: 'vimeo' as const, 
        src: '1151206257', 
        ratio: '9:16', 
        title: 'Pilot Academy Onboarding',
        description: 'Streamlined onboarding platform for pilot training',
        highlights: [
          'Interactive training modules',
          'Progress tracking',
          'Certification management',
          'Performance analytics'
        ]
      },
    ];
  }, [isBusinessApps]);

  const secondSectionItems = useMemo(() => {
    if (columnCount <= 2) {
      const mobileOrder = [
        'thar-ai-ad',
        'vyjayanthi-movies-intro',
        'laptopstore-swap-deals',
        'campa-cola-ai-ad',
        'comet-ai-ad',
        'birdbox-launching-soon'
      ];
      const ordered = mobileOrder
        .map(id => allSecondSectionItems.find(item => String(item.id) === id))
        .filter((item): item is PortfolioItem => Boolean(item));
      const remaining = allSecondSectionItems.filter(item => !mobileOrder.includes(String(item.id)));
      const combined = [...ordered, ...remaining];
      return combined.slice(0, 6);
    }

    // For desktop/tablet: Always include all images, then add videos to fill remaining slots
    const imageItems = allSecondSectionItems.filter(item => item.type === 'image');
    const videoItems = allSecondSectionItems.filter(item => item.type !== 'image');
    
    const maxVisible =
      columnCount >= 5 ? 12 :
      columnCount >= 3 ? 9 :
      6;

    // Always include all images, then add shuffled videos to fill remaining slots
    const shuffledVideos = shuffleArray(videoItems);
    const videosToInclude = shuffledVideos.slice(0, Math.max(0, maxVisible - imageItems.length));
    const combined = [...imageItems, ...videosToInclude];
    
    const arranged = arrangeItemsIntelligently(combined, columnCount);
    return arranged.slice(0, maxVisible);
  }, [allSecondSectionItems, columnCount]);

  const handleSecondSectionPlay = async (id: string | number, src: string) => {
    const idStr = String(id);
    if (secondSectionPlayedMap[idStr]) {
      handleSecondSectionPause(id);
      return;
    }
    
    const item = secondSectionItems.find(i => String(i.id) === idStr);
    const isVimeo = item?.type === 'vimeo';
    
    if (!isVimeo) {
      Object.keys(secondSectionVideoRefs.current).forEach((videoId) => {
        if (videoId !== idStr && secondSectionVideoRefs.current[videoId]) {
          const otherVid = secondSectionVideoRefs.current[videoId];
          if (otherVid.pause && !otherVid.paused) {
            otherVid.pause();
          }
          if (otherVid.currentTime !== undefined) {
            otherVid.currentTime = 0;
          }
        }
      });
    }
    
    setSecondSectionPlayedMap((prev) => {
      const newMap: Record<string, boolean> = {};
      Object.keys(prev).forEach((videoId) => {
        if (videoId !== idStr) {
          newMap[videoId] = false;
        }
      });
      newMap[idStr] = true;
      return newMap;
    });
    
    if (isVimeo) {
      setSecondSectionVimeoLoadingMap((prev) => ({ ...prev, [idStr]: true }));
      setSecondSectionVimeoLoadingProgress((prev) => ({ ...prev, [idStr]: 0 }));
      
      const progressInterval = setInterval(() => {
        setSecondSectionVimeoLoadingProgress((prev) => {
          const current = prev[idStr] || 0;
          if (current >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [idStr]: current + 10 };
        });
      }, 100);
      
      await fetchVimeoThumbnail(src, setSecondSectionVimeoThumbnails);
      setSecondSectionVimeoLoadedMap((prev) => ({ ...prev, [idStr]: true }));
      
      setTimeout(() => {
        setSecondSectionVimeoLoadingProgress((prev) => ({ ...prev, [idStr]: 100 }));
        setTimeout(() => {
          setSecondSectionVimeoLoadingMap((prev) => ({ ...prev, [idStr]: false }));
          setSecondSectionVimeoLoadingProgress((prev) => ({ ...prev, [idStr]: 0 }));
        }, 200);
      }, 500);
      return;
    }
    
    const vid = secondSectionVideoRefs.current[idStr];
    if (!vid) return;
    
    if (!vid.src && src) {
      vid.src = src;
      vid.load();
    }
    
    const waitForBuffer = (): Promise<void> => {
      return new Promise((resolve) => {
        if (vid.readyState >= 3) {
          resolve();
        } else {
          const onCanPlay = () => {
            vid.removeEventListener('canplay', onCanPlay);
            resolve();
          };
          vid.addEventListener('canplay', onCanPlay);
          setTimeout(() => {
            vid.removeEventListener('canplay', onCanPlay);
            resolve();
          }, 3000);
        }
      });
    };
    
    await waitForBuffer();
    
    try {
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
    } catch (error) {
      console.log('Play interrupted:', error);
    }
  };

  const handleSecondSectionPause = (id: string | number) => {
    const idStr = String(id);
    const item = secondSectionItems.find(i => String(i.id) === idStr);
    const isVimeo = item?.type === 'vimeo';
    
    if (!isVimeo) {
      const vid = secondSectionVideoRefs.current[idStr];
      if (vid && vid.pause && !vid.paused) {
        vid.pause();
        if (vid.currentTime !== undefined) {
          vid.currentTime = 0;
        }
      }
    }
    
    setSecondSectionPlayedMap((prev) => ({ ...prev, [idStr]: false }));
  };

  // IntersectionObserver for lazy loading (second section)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const itemId = entry.target.getAttribute('data-item-id');
          if (entry.isIntersecting && itemId) {
            setSecondSectionInViewMap((prev) => ({ ...prev, [itemId]: true }));
            // Check both secondSectionItems and businessAppsItems
            const item = secondSectionItems.find(i => String(i.id) === itemId) || 
                        (isBusinessApps ? businessAppsItems.find(i => String(i.id) === itemId) : null);
            if (item && item.type === 'vimeo' && !secondSectionVimeoThumbnails[item.src]) {
              fetchVimeoThumbnail(item.src, setSecondSectionVimeoThumbnails);
            }
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    secondSectionItemsRef.current.forEach((el) => {
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      secondSectionItemsRef.current.forEach((el) => {
        if (el) {
          observer.unobserve(el);
        }
      });
    };
  }, [secondSectionItems, secondSectionVimeoThumbnails, isBusinessApps, businessAppsItems]);

  // Pre-fetch thumbnails for all second section Vimeo videos on mount
  useEffect(() => {
    allSecondSectionItems.forEach((item) => {
      if (item.type === 'vimeo') {
        fetchVimeoThumbnail(item.src, setSecondSectionVimeoThumbnails).catch((error) => {
          console.warn(`Failed to fetch thumbnail for ${item.src}:`, error);
        });
      }
    });
  }, [allSecondSectionItems]);

  // Pre-fetch thumbnails for Business Apps Vimeo videos on mount
  useEffect(() => {
    if (isBusinessApps) {
      businessAppsItems.forEach((item) => {
        if (item.type === 'vimeo') {
          fetchVimeoThumbnail(item.src, setSecondSectionVimeoThumbnails).catch((error) => {
            console.warn(`Failed to fetch thumbnail for ${item.src}:`, error);
          });
        }
      });
    }
  }, [isBusinessApps, businessAppsItems]);

  // Mark all vimeo items as load-ready
  useEffect(() => {
    setSecondSectionVimeoLoadedMap((prev) => {
      const next = { ...prev };
      allSecondSectionItems.forEach((item) => {
        if (item.type === 'vimeo') {
          next[String(item.id)] = true;
        }
      });
      // Also mark Business Apps Vimeo items as load-ready
      if (isBusinessApps) {
        businessAppsItems.forEach((item) => {
          if (item.type === 'vimeo') {
            next[String(item.id)] = true;
          }
        });
      }
      return next;
    });
  }, [allSecondSectionItems, isBusinessApps, businessAppsItems]);

  // Update Vimeo iframe src when play state changes (second section)
  useEffect(() => {
    const changedIds = Object.keys(secondSectionPlayedMap).filter(id => {
      const iframe = secondSectionVimeoIframeRefs.current[id];
      if (!iframe || !secondSectionVimeoLoadedMap[id]) return false;
      const item = secondSectionItems.find(i => String(i.id) === id && i.type === 'vimeo');
      if (!item) return false;
      const newSrc = secondSectionPlayedMap[id]
        ? `https://player.vimeo.com/video/${item.src}?autoplay=1&loop=1&controls=0&title=0&byline=0&portrait=0&responsive=1`
        : `https://player.vimeo.com/video/${item.src}?loop=1&controls=0&title=0&byline=0&portrait=0&responsive=1`;
      return iframe.src !== newSrc;
    });

    changedIds.forEach((id) => {
      const iframe = secondSectionVimeoIframeRefs.current[id];
      const item = secondSectionItems.find(i => String(i.id) === id && i.type === 'vimeo');
      if (iframe && item) {
        const newSrc = secondSectionPlayedMap[id]
          ? `https://player.vimeo.com/video/${item.src}?autoplay=1&loop=1&controls=0&title=0&byline=0&portrait=0&responsive=1`
          : `https://player.vimeo.com/video/${item.src}?loop=1&controls=0&title=0&byline=0&portrait=0&responsive=1`;
        iframe.src = newSrc;
      }
    });
  }, [secondSectionPlayedMap, secondSectionVimeoLoadedMap, secondSectionItems]);

  const renderPortfolioItem = (
    item: PortfolioItem,
    index: number,
    sectionPlayedMap: Record<string, boolean>,
    sectionVimeoLoadedMap: Record<string, boolean>,
    setSectionVimeoLoadedMap: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
    sectionVimeoLoadingMap: Record<string, boolean>,
    sectionVimeoThumbnails: Record<string, string>,
    setSectionVimeoThumbnails: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    sectionItemsRef: React.MutableRefObject<(HTMLDivElement | null)[]>,
    sectionVideoRefs: React.MutableRefObject<Record<string, HTMLVideoElement>>,
    sectionHandlePlay: (id: string | number, src: string) => Promise<void>,
    sectionHandlePause: (id: string | number) => void,
    sectionInViewMap: Record<string, boolean>
  ) => {
    const isInView = sectionInViewMap[String(item.id)] || false;

    return (
      <div
        key={item.id}
        ref={(el) => {
          sectionItemsRef.current[index] = el;
        }}
        data-item-id={String(item.id)}
        className={`bento-item ${getRatioClass(item.ratio)}`}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('.bento-play-button')) return;
          if (item.type === 'video' || item.type === 'vimeo') {
            sectionHandlePlay(item.id, item.src);
          }
        }}
      >
        <div className="bento-item-inner">
          {item.type === 'vimeo' ? (
            <>
              {sectionVimeoThumbnails[item.src] && (
                <img
                  src={sectionVimeoThumbnails[item.src]}
                  alt=""
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    opacity: 0,
                    pointerEvents: 'none',
                    visibility: 'hidden'
                  }}
                  aria-hidden="true"
                />
              )}
              {(!sectionVimeoLoadedMap[String(item.id)] || !sectionPlayedMap[String(item.id)]) && (
                <>
                  {sectionVimeoThumbnails[item.src] ? (
                    <img
                      src={encodeImagePath(sectionVimeoThumbnails[item.src])}
                      alt={item.title}
                      className="bento-media"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        console.warn(`Thumbnail failed to load for ${item.src}`);
                        const imgElement = e.target as HTMLImageElement;
                        // Try alternative path if original fails
                        const originalSrc = imgElement.src;
                        const decodedSrc = decodeURI(originalSrc);
                        if (decodedSrc !== originalSrc) {
                          const altSrc = sectionVimeoThumbnails[item.src].replace(/\s+/g, '%20');
                          if (altSrc !== originalSrc) {
                            imgElement.src = altSrc;
                            return;
                          }
                        }
                        imgElement.style.display = 'none';
                        const placeholder = (e.target as HTMLElement).parentElement?.querySelector('.vimeo-placeholder') as HTMLElement;
                        if (placeholder) {
                          placeholder.style.display = 'flex';
                        }
                      }}
                      onLoad={() => {
                        // Hide placeholder when thumbnail loads successfully
                        const placeholder = document.querySelector(`[data-item-id="${item.id}"] .vimeo-placeholder`) as HTMLElement;
                        if (placeholder) {
                          placeholder.style.display = 'none';
                        }
                      }}
                    />
                  ) : (
                    <div 
                      className="bento-media vimeo-placeholder"
                      style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5))',
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '14px',
                        fontFamily: 'Anybody, sans-serif'
                      }}
                    >
                      {item.title}
                    </div>
                  )}
                </>
              )}
              {sectionVimeoLoadingMap[String(item.id)] && (() => {
                const progressMap = sectionVimeoLoadingMap === vimeoLoadingMap ? vimeoLoadingProgress : secondSectionVimeoLoadingProgress;
                const progress = progressMap[String(item.id)] || 0;
                return (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 4,
                    width: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '3px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: '#CCFF00',
                        borderRadius: '2px',
                        transition: 'width 0.1s ease'
                      }} />
                    </div>
                    <div style={{
                      color: '#CCFF00',
                      fontSize: '10px',
                      fontFamily: 'Anybody, sans-serif',
                      fontWeight: 600,
                      textAlign: 'center'
                    }}>
                      {progress}%
                    </div>
                  </div>
                );
              })()}
              {sectionVimeoLoadedMap[String(item.id)] ? (
                <iframe
                  key={`vimeo-${item.id}`}
                  ref={(el) => {
                    const refsMap = sectionVimeoLoadedMap === vimeoLoadedMap ? vimeoIframeRefs : secondSectionVimeoIframeRefs;
                    if (el) {
                      refsMap.current[String(item.id)] = el;
                    }
                  }}
                  src={`https://player.vimeo.com/video/${item.src}?autoplay=${sectionPlayedMap[String(item.id)] ? 1 : 0}&loop=1&controls=0&title=0&byline=0&portrait=0&muted=1${item.ratio === '1:1' ? '' : '&responsive=1'}`}
                  className="bento-media"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  onLoad={() => {
                    if (sectionVimeoLoadingMap === vimeoLoadingMap) {
                      setVimeoLoadingMap((prev) => ({ ...prev, [String(item.id)]: false }));
                    } else {
                      setSecondSectionVimeoLoadingMap((prev) => ({ ...prev, [String(item.id)]: false }));
                    }
                  }}
                  onError={(e) => {
                    console.error(`Vimeo iframe error for ${item.id} (${item.src}):`, e);
                  }}
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    pointerEvents: 'none', 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    border: 'none',
                    display: 'block',
                    borderRadius: '14px'
                  }}
                />
              ) : null}
              {!sectionPlayedMap[String(item.id)] && (
                <button
                  type="button"
                  className="bento-play-button"
                  onClick={() => {
                    if (!sectionVimeoLoadedMap[String(item.id)]) {
                      setSectionVimeoLoadedMap((prev) => ({ ...prev, [String(item.id)]: true }));
                    }
                    sectionHandlePlay(item.id, item.src);
                  }}
                  aria-label={`Play ${item.title}`}
                >
                  <span className="bento-play-icon">▶</span>
                </button>
              )}
            </>
          ) : item.type === 'video' ? (
            <>
              {sectionPlayedMap[String(item.id)] ? (
                <video
                  src={item.src}
                  autoPlay={true}
                  loop={true}
                  playsInline
                  preload="none"
                  className="bento-media"
                  controls={false}
                  onLoadedMetadata={(e) => {
                    if (e.target) {
                      (e.target as HTMLVideoElement).currentTime = 0;
                    }
                  }}
                  onError={(e) => {
                    console.warn(`Video failed to load: ${item.src}`, e);
                  }}
                  onWaiting={(e) => {
                    const target = e.target as HTMLVideoElement;
                    if (target && !target.paused) {
                      target.pause();
                      setTimeout(() => {
                        if (target && sectionPlayedMap[String(item.id)]) {
                          target.play().catch(() => {});
                        }
                      }, 100);
                    }
                  }}
                  ref={(el) => {
                    if (el) {
                      sectionVideoRefs.current[String(item.id)] = el;
                    }
                  }}
                />
              ) : (
                <div 
                  className="bento-media" 
                  style={{ 
                    width: '100%',
                    minHeight: '200px',
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5))'
                  }} 
                />
              )}
              {!sectionPlayedMap[String(item.id)] && (
                <button
                  type="button"
                  className="bento-play-button"
                  onClick={() => sectionHandlePlay(item.id, item.src)}
                  aria-label={`Play ${item.title}`}
                >
                  <span className="bento-play-icon">▶</span>
                </button>
              )}
            </>
          ) : (
            <>
              <img
                src={encodeImagePath(item.src)}
                alt=""
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  opacity: 0,
                  pointerEvents: 'none',
                  visibility: 'hidden'
                }}
                aria-hidden="true"
                onError={(e) => {
                  console.warn(`Image failed to load for sizing: ${item.src}`);
                }}
              />
              <img
                src={encodeImagePath(item.src)}
                alt={item.title}
                loading="lazy"
                className="bento-media"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  const imgElement = e.target as HTMLImageElement;
                  console.error(`Image failed to load: ${item.src}`, {
                    attemptedSrc: imgElement.src,
                    originalSrc: item.src,
                    encodedSrc: encodeImagePath(item.src)
                  });
                  
                  // Hide the failed image
                  imgElement.style.display = 'none';
                  
                  // Show placeholder
                  const itemContainer = (e.target as HTMLElement).closest('[data-item-id]');
                  if (itemContainer) {
                    const placeholder = itemContainer.querySelector('.image-placeholder') as HTMLElement;
                    if (placeholder) {
                      placeholder.style.display = 'flex';
                    }
                  }
                }}
                onLoad={() => {
                  console.log(`Image loaded successfully: ${item.src}`);
                  // Hide placeholder when image loads successfully
                  const placeholder = document.querySelector(`[data-item-id="${item.id}"] .image-placeholder`) as HTMLElement;
                  if (placeholder) {
                    placeholder.style.display = 'none';
                  }
                }}
                onLoad={() => {
                  // Hide placeholder when image loads successfully
                  const placeholder = document.querySelector(`[data-item-id="${item.id}"] .image-placeholder`) as HTMLElement;
                  if (placeholder) {
                    placeholder.style.display = 'none';
                  }
                }}
              />
              <div 
                className="bento-media image-placeholder"
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'none',
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5))',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '14px',
                  fontFamily: 'Anybody, sans-serif'
                }}
              >
                {item.title}
              </div>
            </>
          )}
          <div className="bento-overlay">
            <h3 className="bento-title">{item.title}</h3>
          </div>
        </div>
      </div>
    );
  };

  // Use business apps items if isBusinessApps is true, otherwise use secondSectionItems
  const displayItems = isBusinessApps ? businessAppsItems : secondSectionItems;

  return (
    <>
      <section className="liquid-bento-section">
        <div className="bento-header">
          <p className="bento-eyebrow">{eyebrowText}</p>
          <h2 className="bento-heading">{headingText}</h2>
        </div>

        {/* Hero Video - Mobile Only */}
        {!isBusinessApps && (
          <div style={{ width: '100%', clear: 'both', marginBottom: '40px' }}>
        <WorkHeroVideo />
          </div>
        )}

        {isBusinessApps ? (
          <div className="business-apps-carousel">
            {/* Left Arrow - Positioned on left side */}
            <button
              className="business-apps-nav-button business-apps-nav-prev"
              onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : displayItems.length - 1))}
              aria-label="Previous project"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>

            <div className="business-apps-carousel-container">
              <div 
                className="business-apps-slides"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                  transition: 'transform 0.5s ease-in-out'
                }}
              >
                {displayItems.map((item, index) => (
                  <div key={item.id} className="business-apps-slide">
                    <div className="business-apps-slide-content">
                      <div className="business-apps-media">
                        {renderPortfolioItem(item, index, secondSectionPlayedMap, secondSectionVimeoLoadedMap, setSecondSectionVimeoLoadedMap, secondSectionVimeoLoadingMap, secondSectionVimeoThumbnails, setSecondSectionVimeoThumbnails, secondSectionItemsRef, secondSectionVideoRefs, handleSecondSectionPlay, handleSecondSectionPause, secondSectionInViewMap)}
                      </div>
                      <div className="business-apps-details">
                        <h3 className="business-apps-details-title">{item.title}</h3>
                        {item.description && (
                          <p className="business-apps-details-description">{item.description}</p>
                        )}
                        {item.highlights && item.highlights.length > 0 && (
                          <div className="business-apps-highlights">
                            <h4 className="business-apps-highlights-title">Key Features</h4>
                            <ul className="business-apps-highlights-list">
                              {item.highlights.map((highlight, idx) => (
                                <li key={idx} className="business-apps-highlight-item">
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow - Positioned on right side */}
            <button
              className="business-apps-nav-button business-apps-nav-next"
              onClick={() => setCurrentSlide((prev) => (prev < displayItems.length - 1 ? prev + 1 : 0))}
              aria-label="Next project"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>

            {/* Dots - Positioned on right side vertically */}
            <div className="business-apps-dots">
              {displayItems.map((_, index) => (
                <button
                  key={index}
                  className={`business-apps-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
        <div className="liquid-bento-grid">
            {displayItems.map((item, index) => 
            renderPortfolioItem(item, index, secondSectionPlayedMap, secondSectionVimeoLoadedMap, setSecondSectionVimeoLoadedMap, secondSectionVimeoLoadingMap, secondSectionVimeoThumbnails, setSecondSectionVimeoThumbnails, secondSectionItemsRef, secondSectionVideoRefs, handleSecondSectionPlay, handleSecondSectionPause, secondSectionInViewMap)
          )}
        </div>
        )}

        {!isBusinessApps && (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/work" className="view-work-button">
            View All Work
          </Link>
        </div>
        )}
      </section>
    </>
  );
}



