'use client';

import { useEffect, Suspense } from 'react';
import { getTrackingData, getUTMParamsFromURL, storeUTMParams, getSessionId } from '@/lib/tracking/utm';
import { sendToWebhook } from '@/lib/tracking/webhook';

/**
 * Internal tracking component that uses hooks
 * Only tracks form submissions with full session details
 */
function TrackingComponent({ children }: { children: React.ReactNode }) {
  // Initialize session tracking on page load
  // This ensures UTM parameters and session ID are captured and stored
  useEffect(() => {
    // Capture and store UTM parameters from URL on page load
    const utmParams = getUTMParamsFromURL();
    if (Object.keys(utmParams).length > 0) {
      storeUTMParams(utmParams);
    }

    // Ensure session ID is created
    getSessionId();
  }, []);

  useEffect(() => {
    // Track form submissions only
    const handleSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      
      // Collect all form field values
      const formData: Record<string, any> = {};
      const formElements = form.elements;
      
      for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i] as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        
        // Skip submit buttons and hidden fields that aren't inputs
        if (element.tagName === 'BUTTON' || element.type === 'submit' || element.type === 'button') {
          continue;
        }
        
        // Get field value
        if ('name' in element && element.name) {
          if (element.type === 'checkbox') {
            formData[element.name] = (element as HTMLInputElement).checked;
          } else if (element.type === 'radio') {
            const radio = form.querySelector(`input[name="${element.name}"]:checked`) as HTMLInputElement;
            if (radio) {
              formData[element.name] = radio.value;
            }
          } else {
            formData[element.name] = element.value;
          }
        }
      }
      
      // Get tracking data with ALL session details (UTM params, session ID, referrer, etc.)
      const trackingData = getTrackingData('form_submit', {
        // Form details
        formId: form.id || undefined,
        formAction: form.action || undefined,
        formMethod: form.method || undefined,
        formData: Object.keys(formData).length > 0 ? formData : undefined,
        
        // Page context
        pageTitle: typeof document !== 'undefined' ? document.title : undefined,
        viewport: typeof window !== 'undefined' 
          ? { width: window.innerWidth, height: window.innerHeight }
          : undefined,
        
        // Additional session context
        language: typeof navigator !== 'undefined' ? navigator.language : undefined,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screenResolution: typeof window !== 'undefined'
          ? { width: window.screen.width, height: window.screen.height }
          : undefined,
      });

      // Send immediately to webhook with all session details
      // This includes: formData, UTM params, sessionId, page, path, referrer, userAgent, timestamp
      sendToWebhook(trackingData).catch(error => {
        console.error('Failed to send form submission to webhook:', error);
      });
    };

    // Add event listener for form submissions
    document.addEventListener('submit', handleSubmit);

    // Cleanup
    return () => {
      document.removeEventListener('submit', handleSubmit);
    };
  }, []);

  return <>{children}</>;
}

/**
 * Tracking Provider Component
 * Only tracks form submissions with full session details (UTM params, session ID, etc.)
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
 * Hook to manually track custom events (optional, for future use)
 */
export function useTracking() {
  const trackEventImmediate = async (eventName: string, additionalData?: Record<string, any>) => {
    const trackingData = getTrackingData(eventName, additionalData);
    return await sendToWebhook(trackingData);
  };

  return { trackEventImmediate };
}

