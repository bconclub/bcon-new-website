import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LiquidBentoPortfolio.css';

gsap.registerPlugin(ScrollTrigger);

// ✅ Featured Vimeo item stays first
const featuredVimeoItem = { id: 'thar-ai-ad', type: 'vimeo', src: '1143755754', ratio: '9:16', title: 'Thar AI Ad' };

// Raw items - will be normalized
const rawAllItems = [
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

const rawMobileItems = [
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
const normalizeRatio = (ratio) => {
  // Keep actual video ratios as-is
  if (ratio === '9:16' || ratio === '1:1' || ratio === '16:9' || ratio === '4:3') {
    return ratio;
  }
  
  // Map other ratios to closest match
  // Vertical/portrait ratios -> 9:16
  if (ratio === '4:5' || ratio === '3:4' || ratio === '2:3') {
    return '9:16';
  }
  
  // Wide landscape ratios -> 16:9
  if (ratio === '21:9' || ratio === '5:4') {
    return '16:9';
  }
  
  // Square or unknown -> 1:1
  return '1:1';
};

// Normalize item ratios
const normalizeItemRatios = (items) => {
  return items.map(item => ({
    ...item,
    ratio: normalizeRatio(item.ratio)
  }));
};

// Normalize all items to use actual video ratios: 9:16, 1:1, 16:9, or 4:3
const allItems = normalizeItemRatios(rawAllItems);
const mobileItems = normalizeItemRatios(rawMobileItems);

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Intelligent arrangement: Mix items to avoid same-sized items next to each other horizontally
const arrangeItemsIntelligently = (items, columnCount) => {
  if (columnCount <= 2) {
    // For mobile/tablet, just return items as-is
    return items;
  }

  // Separate items by their aspect ratios
  const verticalItems = items.filter(item => item.ratio === '9:16');
  const squareItems = items.filter(item => item.ratio === '1:1');
  const landscapeItems = items.filter(item => item.ratio === '16:9');
  const standardItems = items.filter(item => item.ratio === '4:3');

  const arranged = [];
  
  // Create pools of items by ratio
  const pools = {
    '9:16': [...verticalItems],
    '1:1': [...squareItems],
    '16:9': [...landscapeItems],
    '4:3': [...standardItems]
  };

  // Track indices for each pool
  const poolIndices = {
    '9:16': 0,
    '1:1': 0,
    '16:9': 0,
    '4:3': 0
  };

  // Function to get next item from a pool
  const getNextFromPool = (ratio) => {
    const pool = pools[ratio];
    if (!pool || poolIndices[ratio] >= pool.length) return null;
    return pool[poolIndices[ratio]++];
  };

  // Function to check if an item is available
  const hasAvailable = (ratio) => {
    return pools[ratio] && poolIndices[ratio] < pools[ratio].length;
  };

  // Distribute items row by row, ensuring each row has different sizes
  const totalItems = items.length;
  let rowIndex = 0;
  
  while (arranged.length < totalItems) {
    // Track what ratios are used in current row to avoid duplicates
    const usedInRow = new Set();
    
    // Fill each column in the current row
    for (let col = 0; col < columnCount; col++) {
      if (arranged.length >= totalItems) break;
      
      // Try to find an item with a ratio not yet used in this row
      const ratios = ['9:16', '1:1', '16:9', '4:3'];
      let item = null;
      let selectedRatio = null;
      
      // First, try to find a ratio not used in this row
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
      
      // If all ratios are used or unavailable, get any available item
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
    
    rowIndex++;
  }

  return arranged.length > 0 ? arranged : items;
};

// Curated items for front page - you can customize this list
const curatedFrontPageItems = [
  { id: 'thar-ai-ad', type: 'vimeo', src: '1143755754', ratio: '9:16', title: 'Thar AI Ad' },
  { id: 'vyjayanthi-movies', type: 'vimeo', src: '1143763635', ratio: '16:9', title: 'Vyjayanthi Movies Intro' },
  { id: 'vimeo-7th', type: 'vimeo', src: '1143892769', ratio: '9:16', title: 'Birdbox Brand Video' },
  { id: 'comet-ai-ad', type: 'vimeo', src: '1143777731', ratio: '4:3', title: 'Comet AI Ad' },
  { id: 'laptopstore-swap-deals', type: 'vimeo', src: '1143775448', ratio: '1:1', title: 'Laptopstore Swap Deals' },
  { id: '11pc-launch', type: 'image', src: '/portfolio/11PC Launch.jpg', ratio: '1:1', title: '11PC Launch' },
  { id: 'birdbox-launching', type: 'image', src: '/portfolio/Birdbox Launching Soon.jpg', ratio: '1:1', title: 'Birdbox Launching Soon' },
  { id: 'wc-event-2', type: 'image', src: '/portfolio/WC Event.jpg', ratio: '1:1', title: 'WC Event' }
];

const LiquidBentoPortfolio = ({ showAll = false }) => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [secondSectionVisibleCount, setSecondSectionVisibleCount] = useState(8);
  const [deviceType, setDeviceType] = useState('desktop');
  const [columnCount, setColumnCount] = useState(5);
  const [playedMap, setPlayedMap] = useState({});
  const [vimeoLoadedMap, setVimeoLoadedMap] = useState({});
  const [vimeoLoadingMap, setVimeoLoadingMap] = useState({});
  const [vimeoLoadingProgress, setVimeoLoadingProgress] = useState({});
  const [vimeoThumbnails, setVimeoThumbnails] = useState({});
  const [clickedVideos, setClickedVideos] = useState({});
  const [inViewMap, setInViewMap] = useState({});
  const itemsRef = useRef([]);
  const videoRefs = useRef({});
  const vimeoIframeRefs = useRef({});
  
  // Second section state
  const [secondSectionPlayedMap, setSecondSectionPlayedMap] = useState({});
  const [secondSectionVimeoLoadedMap, setSecondSectionVimeoLoadedMap] = useState({});
  const [secondSectionVimeoLoadingMap, setSecondSectionVimeoLoadingMap] = useState({});
  const [secondSectionVimeoLoadingProgress, setSecondSectionVimeoLoadingProgress] = useState({});
  const [secondSectionVimeoThumbnails, setSecondSectionVimeoThumbnails] = useState({});
  const [secondSectionClickedVideos, setSecondSectionClickedVideos] = useState({});
  const [secondSectionInViewMap, setSecondSectionInViewMap] = useState({});
  const secondSectionItemsRef = useRef([]);
  const secondSectionVideoRefs = useRef({});
  const secondSectionVimeoIframeRefs = useRef({});

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
        setVisibleCount(6); // 2 columns × 3 rows = 6 items
        setSecondSectionVisibleCount(6);
      } else if (width < 1200) {
        setDeviceType('tablet');
        setColumnCount(3);
        setVisibleCount(6); // 3 columns × 2 rows = 6 items
        setSecondSectionVisibleCount(6);
      } else {
        setDeviceType('desktop');
        setColumnCount(5);
        setVisibleCount(10); // 5 columns × 2 rows = 10 items
        setSecondSectionVisibleCount(showAll ? itemsToDisplay.length : 10);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Optimized GSAP animations with ScrollTrigger - only animate when in viewport
  useEffect(() => {
    itemsRef.current.forEach((item, index) => {
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
        if (trigger.vars.trigger && itemsRef.current.includes(trigger.vars.trigger)) {
          trigger.kill();
        }
      });
    };
  }, [visibleCount, deviceType]);

  // Optimized GSAP animations for second section with ScrollTrigger
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
        if (trigger.vars.trigger && secondSectionItemsRef.current.includes(trigger.vars.trigger)) {
          trigger.kill();
        }
      });
    };
  }, []);

  const getRatioClass = (ratio) => {
    // Supported aspect ratios matching actual video sizes
    if (ratio === '9:16') return 'ratio-stories'; // Stories format (vertical/portrait)
    if (ratio === '1:1') return 'ratio-square'; // Square format
    if (ratio === '16:9') return 'ratio-landscape'; // Landscape format
    if (ratio === '4:3') return 'ratio-standard'; // Standard format (for Comet)
    // Default fallback
    return 'ratio-square';
  };

  // Fetch Vimeo thumbnail - use Vimeo's thumbnail service
  const fetchVimeoThumbnail = async (videoId, setThumbnailMap) => {
    if (setThumbnailMap === setVimeoThumbnails && vimeoThumbnails[videoId]) {
      return vimeoThumbnails[videoId];
    }
    if (setThumbnailMap === setSecondSectionVimeoThumbnails && secondSectionVimeoThumbnails[videoId]) {
      return secondSectionVimeoThumbnails[videoId];
    }

    // Use local thumbnails for specific videos, otherwise fetch from Vimeo
    let thumbnail;
    if (videoId === '1143755754') {
      // Thar AI video - use local thumbnail
      thumbnail = '/portfolio/thumbnails/That AI Thumbnail.webp';
    } else if (videoId === '1143775448') {
      // Laptopstore Swap Deals video - use local thumbnail
      thumbnail = '/portfolio/thumbnails/LS Swap Thumbnail.webp';
    } else if (videoId === '1143776342') {
      // Campa Cola AI Ad video - use local thumbnail
      thumbnail = '/portfolio/thumbnails/Campa Cola AI Ad.webp';
    } else if (videoId === '1143777731') {
      // Comet AI Ad video - use local thumbnail
      thumbnail = '/portfolio/thumbnails/Comet AI Ad.webp';
    } else if (videoId === '1143785386') {
      // 6th video - use local thumbnail
      thumbnail = '/portfolio/thumbnails/Organix Rosa Move In.webp';
    } else if (videoId === '1143892769') {
      // Birdbox Claude video - use local thumbnail
      thumbnail = '/portfolio/thumbnails/Birdbox Claude Thumbnail.webp';
    } else {
      // Fetch thumbnail from Vimeo using vumbnail.com service
      thumbnail = `https://vumbnail.com/${videoId}.jpg`;
    }
    
    setThumbnailMap((prev) => ({ ...prev, [videoId]: thumbnail }));
    return thumbnail;
  };

  const items = deviceType === 'mobile' ? mobileItems : desktopItems;
  const visibleItems = useMemo(() => {
    const arranged = arrangeItemsIntelligently(items, columnCount);
    return arranged.slice(0, visibleCount);
  }, [items, columnCount, visibleCount]);

  const handlePlay = async (id, src) => {
    // If already playing, toggle to pause
    if (playedMap[id]) {
      handlePause(id);
      return;
    }
    
    // Find the item to check if it's Vimeo
    const item = visibleItems.find(i => i.id === id);
    const isVimeo = item?.type === 'vimeo';
    
    // Pause all other videos first (only for regular video elements, not Vimeo)
    if (!isVimeo) {
      Object.keys(videoRefs.current).forEach((videoId) => {
        if (videoId !== id && videoRefs.current[videoId]) {
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
    
    // Reset all other videos in playedMap, then set current one to playing
    setPlayedMap((prev) => {
      const newMap = {};
      Object.keys(prev).forEach((videoId) => {
        if (videoId !== id) {
          newMap[videoId] = false;
        }
      });
      newMap[id] = true;
      return newMap;
    });
    
    // For Vimeo, mark as loading, fetch thumbnail, then load
    if (isVimeo) {
      setVimeoLoadingMap((prev) => ({ ...prev, [id]: true }));
      setVimeoLoadingProgress((prev) => ({ ...prev, [id]: 0 }));
      
      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setVimeoLoadingProgress((prev) => {
          const current = prev[id] || 0;
          if (current >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [id]: current + 10 };
        });
      }, 100);
      
      await fetchVimeoThumbnail(src, setVimeoThumbnails);
      setVimeoLoadedMap((prev) => ({ ...prev, [id]: true }));
      
      // Complete progress and remove loading
      setTimeout(() => {
        setVimeoLoadingProgress((prev) => ({ ...prev, [id]: 100 }));
        setTimeout(() => {
          setVimeoLoadingMap((prev) => ({ ...prev, [id]: false }));
          setVimeoLoadingProgress((prev) => ({ ...prev, [id]: 0 }));
        }, 200);
      }, 500);
      return;
    }
    
    const vid = videoRefs.current[id];
    if (!vid) return;
    
    // Only load video source when clicked (not on hover)
    if (!vid.src && src) {
      vid.src = src;
      vid.load();
    }
    
    // Wait for video to have enough data before playing
    const waitForBuffer = () => {
      return new Promise((resolve) => {
        if (vid.readyState >= 3) {
          resolve();
        } else {
          const onCanPlay = () => {
            vid.removeEventListener('canplay', onCanPlay);
            resolve();
          };
          vid.addEventListener('canplay', onCanPlay);
          // Timeout after 3 seconds
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

  const handlePause = (id) => {
    const item = visibleItems.find(i => i.id === id);
    const isVimeo = item?.type === 'vimeo';
    
    // For regular videos, pause the element
    if (!isVimeo) {
      const vid = videoRefs.current[id];
      if (vid && vid.pause && !vid.paused) {
        vid.pause();
        if (vid.currentTime !== undefined) {
          vid.currentTime = 0;
        }
      }
    }
    
    // For Vimeo, just update state - iframe src will update automatically
    setPlayedMap((prev) => ({ ...prev, [id]: false }));
  };

  // Second section items - Vimeo videos and images
  const allSecondSectionItems = useMemo(() => {
    const rawItems = [
      featuredVimeoItem,
      { id: 'vyjayanthi-movies', type: 'vimeo', src: '1143763635', ratio: '16:9', title: 'Vyjayanthi Movies Intro' },
      { id: 'laptopstore-swap-deals', type: 'vimeo', src: '1143775448', ratio: '1:1', title: 'Laptopstore Swap Deals' },
      { id: 'vimeo-4th', type: 'vimeo', src: '1143776342', ratio: '9:16', title: 'Campa Cola AI Ad' },
      { id: 'comet-ai-ad', type: 'vimeo', src: '1143777731', ratio: '4:3', title: 'Comet AI Ad' },
      { id: 'vimeo-6th', type: 'vimeo', src: '1143785386', ratio: '9:16', title: 'Video 6' },
      { id: 'vimeo-7th', type: 'vimeo', src: '1143892769', ratio: '9:16', title: 'Birdbox Brand Video' },
      // Images
      { id: '11pc-launch', type: 'image', src: '/portfolio/11PC Launch.jpg', ratio: '1:1', title: '11PC Launch' },
      { id: '11pc-event', type: 'image', src: '/portfolio/11PC Event.jpg', ratio: '1:1', title: '11PC Event' },
      { id: 'birdbox-launching', type: 'image', src: '/portfolio/Birdbox Launching Soon.jpg', ratio: '1:1', title: 'Birdbox Launching Soon' },
      { id: 'come-to-dubai-2', type: 'image', src: '/portfolio/Come to Dubai.png', ratio: '1:1', title: 'Come to Dubai' },
      { id: 'laptopstore-product-2', type: 'image', src: '/portfolio/Laptopstore-Product-Ad.jpg', ratio: '1:1', title: 'Laptopstore Product Ad' },
      { id: 'wc-event-2', type: 'image', src: '/portfolio/WC Event.jpg', ratio: '1:1', title: 'WC Event' }
    ];
    return normalizeItemRatios(rawItems);
  }, []);

  // Use curated items for front page, all items for AllWork page
  const itemsToDisplay = useMemo(() => {
    if (showAll) {
      return allSecondSectionItems;
    }
    // Use curated items for front page
    const curatedNormalized = normalizeItemRatios(curatedFrontPageItems);
    return curatedNormalized;
  }, [showAll, allSecondSectionItems]);

  // Pre-fetch Vimeo thumbnails for items to display
  useEffect(() => {
    itemsToDisplay.forEach((item) => {

  const secondSectionItems = useMemo(() => {
    const arranged = arrangeItemsIntelligently(itemsToDisplay, columnCount);
    if (showAll) {
      // On AllWork page, show all items (no limit)
      return arranged;
    }
    // On front page, show limited items
    return arranged.slice(0, secondSectionVisibleCount);
  }, [itemsToDisplay, columnCount, secondSectionVisibleCount, showAll]);

  // Load More handlers
  const handleLoadMore = () => {
    const loadAmount = deviceType === 'mobile' ? 4 : 6;
    setVisibleCount(prev => Math.min(prev + loadAmount, items.length));
  };

  const handleSecondSectionLoadMore = () => {
    const loadAmount = deviceType === 'mobile' ? 4 : (deviceType === 'desktop' ? 10 : 6);
    setSecondSectionVisibleCount(prev => Math.min(prev + loadAmount, itemsToDisplay.length));
  };

  // IntersectionObserver for lazy loading (first section)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const itemId = entry.target.dataset.itemId;
          if (entry.isIntersecting && itemId) {
            setInViewMap((prev) => ({ ...prev, [itemId]: true }));
            // Pre-fetch thumbnail when in view
            const item = visibleItems.find(i => i.id === itemId);
            if (item && item.type === 'vimeo' && !vimeoThumbnails[item.src]) {
              fetchVimeoThumbnail(item.src, setVimeoThumbnails);
            }
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    itemsRef.current.forEach((el) => {
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      itemsRef.current.forEach((el) => {
        if (el) {
          observer.unobserve(el);
        }
      });
    };
  }, [visibleItems, vimeoThumbnails]);

  // IntersectionObserver for lazy loading (second section)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const itemId = entry.target.dataset.itemId;
          if (entry.isIntersecting && itemId) {
            setSecondSectionInViewMap((prev) => ({ ...prev, [itemId]: true }));
            // Pre-fetch thumbnail when in view
            const item = secondSectionItems.find(i => i.id === itemId);
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
  }, [secondSectionItems, secondSectionVimeoThumbnails]);

  // Pre-fetch thumbnails for all second section Vimeo videos on mount
  useEffect(() => {
    itemsToDisplay.forEach((item) => {
      if (item.type === 'vimeo') {
        // Always try to fetch thumbnail, function handles caching
        fetchVimeoThumbnail(item.src, setSecondSectionVimeoThumbnails).catch((error) => {
          console.warn(`Failed to fetch thumbnail for ${item.src}:`, error);
        });
      }
    });
  }, [itemsToDisplay]);

  // Update Vimeo iframe src when play state changes (first section) - optimized to only update changed videos
  useEffect(() => {
    const changedIds = Object.keys(playedMap).filter(id => {
      const iframe = vimeoIframeRefs.current[id];
      if (!iframe || !vimeoLoadedMap[id]) return false;
      const item = visibleItems.find(i => i.id === id && i.type === 'vimeo');
      if (!item) return false;
      const newSrc = playedMap[id]
        ? `https://player.vimeo.com/video/${item.src}?autoplay=1&loop=1&controls=0&title=0&byline=0&portrait=0&responsive=1`
        : `https://player.vimeo.com/video/${item.src}?loop=1&controls=0&title=0&byline=0&portrait=0&responsive=1`;
      return iframe.src !== newSrc;
    });

    changedIds.forEach((id) => {
      const iframe = vimeoIframeRefs.current[id];
      const item = visibleItems.find(i => i.id === id && i.type === 'vimeo');
      if (iframe && item) {
        const newSrc = playedMap[id]
          ? `https://player.vimeo.com/video/${item.src}?autoplay=1&loop=1&controls=0&title=0&byline=0&portrait=0&responsive=1`
          : `https://player.vimeo.com/video/${item.src}?loop=1&controls=0&title=0&byline=0&portrait=0&responsive=1`;
        iframe.src = newSrc;
      }
    });
  }, [playedMap, vimeoLoadedMap, visibleItems]);

  // Update Vimeo iframe src when play state changes (second section) - optimized
  useEffect(() => {
    const changedIds = Object.keys(secondSectionPlayedMap).filter(id => {
      const iframe = secondSectionVimeoIframeRefs.current[id];
      if (!iframe || !secondSectionVimeoLoadedMap[id]) return false;
      const item = secondSectionItems.find(i => i.id === id && i.type === 'vimeo');
      if (!item) return false;
      const newSrc = secondSectionPlayedMap[id]
        ? `https://player.vimeo.com/video/${item.src}?autoplay=1&loop=1&controls=0&title=0&byline=0&portrait=0&responsive=1`
        : `https://player.vimeo.com/video/${item.src}?loop=1&controls=0&title=0&byline=0&portrait=0&responsive=1`;
      return iframe.src !== newSrc;
    });

    changedIds.forEach((id) => {
      const iframe = secondSectionVimeoIframeRefs.current[id];
      const item = secondSectionItems.find(i => i.id === id && i.type === 'vimeo');
      if (iframe && item) {
        const newSrc = secondSectionPlayedMap[id]
          ? `https://player.vimeo.com/video/${item.src}?autoplay=1&loop=1&controls=0&title=0&byline=0&portrait=0&responsive=1`
          : `https://player.vimeo.com/video/${item.src}?loop=1&controls=0&title=0&byline=0&portrait=0&responsive=1`;
        iframe.src = newSrc;
      }
    });
  }, [secondSectionPlayedMap, secondSectionVimeoLoadedMap, secondSectionItems]);
  
  // Second section handlers
  const handleSecondSectionPlay = async (id, src) => {
    // If already playing, toggle to pause
    if (secondSectionPlayedMap[id]) {
      handleSecondSectionPause(id);
      return;
    }
    
    const item = secondSectionItems.find(i => i.id === id);
    const isVimeo = item?.type === 'vimeo';
    
    if (!isVimeo) {
      Object.keys(secondSectionVideoRefs.current).forEach((videoId) => {
        if (videoId !== id && secondSectionVideoRefs.current[videoId]) {
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
      const newMap = {};
      Object.keys(prev).forEach((videoId) => {
        if (videoId !== id) {
          newMap[videoId] = false;
        }
      });
      newMap[id] = true;
      return newMap;
    });
    
    // For Vimeo, mark as loading, fetch thumbnail, then load
    if (isVimeo) {
      setSecondSectionVimeoLoadingMap((prev) => ({ ...prev, [id]: true }));
      setSecondSectionVimeoLoadingProgress((prev) => ({ ...prev, [id]: 0 }));
      
      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setSecondSectionVimeoLoadingProgress((prev) => {
          const current = prev[id] || 0;
          if (current >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [id]: current + 10 };
        });
      }, 100);
      
      await fetchVimeoThumbnail(src, setSecondSectionVimeoThumbnails);
      setSecondSectionVimeoLoadedMap((prev) => ({ ...prev, [id]: true }));
      
      // Complete progress and remove loading
      setTimeout(() => {
        setSecondSectionVimeoLoadingProgress((prev) => ({ ...prev, [id]: 100 }));
        setTimeout(() => {
          setSecondSectionVimeoLoadingMap((prev) => ({ ...prev, [id]: false }));
          setSecondSectionVimeoLoadingProgress((prev) => ({ ...prev, [id]: 0 }));
        }, 200);
      }, 500);
      return;
    }
    
    const vid = secondSectionVideoRefs.current[id];
    if (!vid) return;
    
    if (!vid.src && src) {
      vid.src = src;
      vid.load();
    }
    
    const waitForBuffer = () => {
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

  const handleSecondSectionPause = (id) => {
    const item = secondSectionItems.find(i => i.id === id);
    const isVimeo = item?.type === 'vimeo';
    
    if (!isVimeo) {
      const vid = secondSectionVideoRefs.current[id];
      if (vid && vid.pause && !vid.paused) {
        vid.pause();
        if (vid.currentTime !== undefined) {
          vid.currentTime = 0;
        }
      }
    }
    
    setSecondSectionPlayedMap((prev) => ({ ...prev, [id]: false }));
  };

  const handleVimeoHover = (id, sectionVimeoLoadedMap, setSectionVimeoLoadedMap) => {
    if (!sectionVimeoLoadedMap[id]) {
      setSectionVimeoLoadedMap((prev) => ({ ...prev, [id]: true }));
    }
  };

  const renderPortfolioItem = (item, index, sectionPlayedMap, sectionVimeoLoadedMap, setSectionVimeoLoadedMap, sectionVimeoLoadingMap, sectionVimeoThumbnails, setSectionVimeoThumbnails, sectionItemsRef, sectionVideoRefs, sectionHandlePlay, sectionHandlePause, sectionInViewMap) => {
    const isInView = sectionInViewMap[item.id] || false;

    return (
      <div
        key={item.id}
        ref={(el) => {
          sectionItemsRef.current[index] = el;
        }}
        data-item-id={item.id}
        className={`bento-item ${getRatioClass(item.ratio)}`}
        onClick={(e) => {
          // Only handle click if clicking on the card itself, not on the play button
          if (e.target.closest('.bento-play-button')) return;
          if (item.type === 'video' || item.type === 'vimeo') {
            sectionHandlePlay(item.id, item.src);
          }
        }}
      >
        <div className="bento-item-inner">
          {item.type === 'vimeo' ? (
            <>
              {/* Hidden image to set container aspect ratio - maintains size consistency */}
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
              {/* Thumbnail background - show when video is not playing */}
              {(!sectionVimeoLoadedMap[item.id] || !sectionPlayedMap[item.id]) && (
                <>
                  {sectionVimeoThumbnails[item.src] ? (
                    <img
                      src={sectionVimeoThumbnails[item.src]}
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
                        // Fallback if thumbnail fails to load
                        console.warn(`Thumbnail failed to load for ${item.src}`);
                        e.target.style.display = 'none';
                        // Show placeholder
                        const placeholder = e.target.parentElement.querySelector('.vimeo-placeholder');
                        if (placeholder) {
                          placeholder.style.display = 'flex';
                        }
                      }}
                    />
                  ) : (
                    // Show placeholder while thumbnail loads
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
              {/* Loading progress bar */}
              {sectionVimeoLoadingMap[item.id] && (() => {
                const progressMap = sectionVimeoLoadingMap === vimeoLoadingMap ? vimeoLoadingProgress : secondSectionVimeoLoadingProgress;
                const progress = progressMap[item.id] || 0;
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
              {sectionVimeoLoadedMap[item.id] && sectionPlayedMap[item.id] ? (
                <>
                  <iframe
                    key={`vimeo-${item.id}`}
                    ref={(el) => {
                      const refsMap = sectionVimeoLoadedMap === vimeoLoadedMap ? vimeoIframeRefs : secondSectionVimeoIframeRefs;
                      if (el) {
                        refsMap.current[item.id] = el;
                      }
                    }}
                    src={`https://player.vimeo.com/video/${item.src}?autoplay=1&loop=1&controls=0&title=0&byline=0&portrait=0${item.ratio === '1:1' ? '' : '&responsive=1'}`}
                    className="bento-media"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    onLoad={() => {
                      // Remove loading spinner when iframe loads
                      if (sectionVimeoLoadingMap === vimeoLoadingMap) {
                        setVimeoLoadingMap((prev) => ({ ...prev, [item.id]: false }));
                      } else {
                        setSecondSectionVimeoLoadingMap((prev) => ({ ...prev, [item.id]: false }));
                      }
                    }}
                    onError={(e) => {
                      console.error('Vimeo iframe error:', e);
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
                  {/* Clickable overlay to capture clicks anywhere on the video */}
                  <div
                    className="bento-video-overlay"
                    onClick={(e) => {
                      e.stopPropagation();
                      sectionHandlePlay(item.id, item.src);
                    }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      cursor: 'pointer',
                      zIndex: sectionPlayedMap[item.id] ? 3 : 2,
                      pointerEvents: sectionPlayedMap[item.id] ? 'auto' : 'none'
                    }}
                  />
                </>
              ) : null}
            {!sectionPlayedMap[item.id] && (
              <button
                type="button"
                className="bento-play-button"
                onClick={() => {
                  if (!sectionVimeoLoadedMap[item.id]) {
                    setSectionVimeoLoadedMap((prev) => ({ ...prev, [item.id]: true }));
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
            {sectionPlayedMap[item.id] ? (
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
                    e.target.currentTime = 0;
                  }
                }}
                onError={(e) => {
                  console.warn(`Video failed to load: ${item.src}`, e);
                }}
                onWaiting={(e) => {
                  if (e.target && !e.target.paused) {
                    e.target.pause();
                    setTimeout(() => {
                      if (e.target && sectionPlayedMap[item.id]) {
                        e.target.play().catch(() => {});
                      }
                    }, 100);
                  }
                }}
                ref={(el) => {
                  if (el) {
                    sectionVideoRefs.current[item.id] = el;
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
            {!sectionPlayedMap[item.id] && (
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
            {/* Hidden image to set container aspect ratio - maintains size consistency */}
            <img
              src={item.src}
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
            {/* Visible image - fills container */}
            <img
              src={item.src}
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
                console.error(`Image failed to load: ${item.src}`, e);
                // Show placeholder instead of hiding
                e.target.style.display = 'none';
                const placeholder = e.target.parentElement.querySelector('.image-placeholder');
                if (placeholder) {
                  placeholder.style.display = 'block';
                }
              }}
            />
            {/* Placeholder for failed images */}
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

  return (
    <>
      {/* Our Work Section */}
      <section className="liquid-bento-section">
        <div className="bento-header">
          <h2 className="bento-heading">Our Work</h2>
          <p className="bento-subheading">Creative excellence across all platforms</p>
        </div>

        <div className="liquid-bento-grid">
          {secondSectionItems.map((item, index) => 
            renderPortfolioItem(item, index, secondSectionPlayedMap, secondSectionVimeoLoadedMap, setSecondSectionVimeoLoadedMap, secondSectionVimeoLoadingMap, secondSectionVimeoThumbnails, setSecondSectionVimeoThumbnails, secondSectionItemsRef, secondSectionVideoRefs, handleSecondSectionPlay, handleSecondSectionPause, secondSectionInViewMap)
          )}
        </div>

        {!showAll && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            {secondSectionVisibleCount < itemsToDisplay.length && (
              <button 
                className="load-more-button"
                onClick={handleSecondSectionLoadMore}
                aria-label="Load more items"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            )}
            <Link 
              to="/work"
              className="view-all-work-button"
              style={{
                display: 'inline-block',
                textAlign: 'center',
                marginTop: '30px',
                padding: '16px 32px',
                backgroundColor: 'transparent',
                border: '2px solid #CCFF00',
                color: '#CCFF00',
                textDecoration: 'none',
                fontFamily: 'Anybody, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#CCFF00';
                e.target.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#CCFF00';
              }}
            >
              View All Work →
            </Link>
          </div>
        )}
        {showAll && secondSectionVisibleCount < itemsToDisplay.length && (
          <button 
            className="load-more-button"
            onClick={handleSecondSectionLoadMore}
            aria-label="Load more items"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        )}
      </section>
    </>
  );
};

export default LiquidBentoPortfolio;