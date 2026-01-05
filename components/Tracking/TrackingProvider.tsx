'use client';

import { useEffect, useCallback, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getTrackingData, getSessionId } from '@/lib/tracking/utm';
import { sendToWebhook, getTrackingQueue } from '@/lib/tracking/webhook';

/**
 * Internal tracking component that uses hooks
 */
function TrackingComponent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page view
  const trackPageView = useCallback(() => {
    const trackingData = getTrackingData('page_view', {
      pageTitle: typeof document !== 'undefined' ? document.title : undefined,
      viewport: typeof window !== 'undefined' 
        ? { width: window.innerWidth, height: window.innerHeight }
        : undefined,
    });

    // Send to webhook (use queue for better performance)
    getTrackingQueue().add(trackingData);
  }, []);

  // Track page view on route change
  useEffect(() => {
    // Small delay to ensure page is fully loaded
    const timer = setTimeout(() => {
      trackPageView();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, searchParams, trackPageView]);

  // Track initial page load
  useEffect(() => {
    // Track initial page view
    trackPageView();

    // Track clicks on links and buttons
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const element = target.closest('a, button, [role="button"]');
      
      if (element) {
        const trackingData = getTrackingData('click', {
          elementType: element.tagName.toLowerCase(),
          elementText: element.textContent?.trim().substring(0, 100),
          elementHref: (element as HTMLAnchorElement).href || undefined,
          elementId: element.id || undefined,
          elementClass: element.className || undefined,
        });

        getTrackingQueue().add(trackingData);
      }
    };

    // Track form submissions
    const handleSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      const trackingData = getTrackingData('form_submit', {
        formId: form.id || undefined,
        formAction: form.action || undefined,
        formMethod: form.method || undefined,
      });

      getTrackingQueue().add(trackingData);
    };

    // Track scroll depth
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      );
      
      // Track at 25%, 50%, 75%, 100% milestones
      if (scrollPercent >= 25 && maxScroll < 25) {
        maxScroll = 25;
        const trackingData = getTrackingData('scroll', { depth: 25 });
        getTrackingQueue().add(trackingData);
      } else if (scrollPercent >= 50 && maxScroll < 50) {
        maxScroll = 50;
        const trackingData = getTrackingData('scroll', { depth: 50 });
        getTrackingQueue().add(trackingData);
      } else if (scrollPercent >= 75 && maxScroll < 75) {
        maxScroll = 75;
        const trackingData = getTrackingData('scroll', { depth: 75 });
        getTrackingQueue().add(trackingData);
      } else if (scrollPercent >= 100 && maxScroll < 100) {
        maxScroll = 100;
        const trackingData = getTrackingData('scroll', { depth: 100 });
        getTrackingQueue().add(trackingData);
      }
    };

    // Track time on page
    const startTime = Date.now();
    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000); // seconds
      const trackingData = getTrackingData('page_exit', {
        timeOnPage,
        sessionId: getSessionId(),
      });

      // Send immediately on exit (don't queue)
      sendToWebhook(trackingData);
    };

    // Add event listeners
    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleSubmit);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Flush queue on unmount
      getTrackingQueue().flush();
    };
  }, [trackPageView]);

  return <>{children}</>;
}

/**
 * Tracking Provider Component
 * Tracks page views, UTM parameters, and user interactions
 * Wrapped in Suspense for Next.js 15 compatibility
 */
export default function TrackingProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={children}>
      <TrackingComponent>{children}</TrackingComponent>
    </Suspense>
  );
}

/**
 * Hook to manually track custom events
 */
export function useTracking() {
  const trackEvent = useCallback((eventName: string, additionalData?: Record<string, any>) => {
    const trackingData = getTrackingData(eventName, additionalData);
    getTrackingQueue().add(trackingData);
  }, []);

  const trackEventImmediate = useCallback(async (eventName: string, additionalData?: Record<string, any>) => {
    const trackingData = getTrackingData(eventName, additionalData);
    return await sendToWebhook(trackingData);
  }, []);

  return { trackEvent, trackEventImmediate };
}

