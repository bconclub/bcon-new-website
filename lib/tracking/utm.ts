/**
 * UTM Parameter Tracking Utility
 * Captures and manages UTM parameters from URL query strings
 */

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  [key: string]: string | undefined;
}

export interface TrackingData {
  event: string;
  page?: string;
  path?: string;
  referrer?: string;
  userAgent?: string;
  timestamp: string;
  utm?: UTMParams;
  sessionId?: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

/**
 * Parse UTM parameters from URL
 */
export function parseUTMParams(searchParams: URLSearchParams): UTMParams {
  const utmParams: UTMParams = {};
  
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  
  utmKeys.forEach(key => {
    const value = searchParams.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });

  // Also capture any other query parameters
  searchParams.forEach((value, key) => {
    if (!utmParams[key] && key.startsWith('utm_')) {
      utmParams[key] = value;
    }
  });

  return utmParams;
}

/**
 * Get UTM parameters from current URL
 */
export function getUTMParamsFromURL(): UTMParams {
  if (typeof window === 'undefined') {
    return {};
  }

  const searchParams = new URLSearchParams(window.location.search);
  return parseUTMParams(searchParams);
}

/**
 * Store UTM parameters in sessionStorage (persists for session)
 */
export function storeUTMParams(params: UTMParams): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Store individual UTM params
    Object.keys(params).forEach(key => {
      if (params[key]) {
        sessionStorage.setItem(key, params[key]!);
      }
    });

    // Store complete UTM object
    sessionStorage.setItem('utm_params', JSON.stringify(params));
  } catch (error) {
    console.error('Error storing UTM params:', error);
  }
}

/**
 * Get stored UTM parameters from sessionStorage
 */
export function getStoredUTMParams(): UTMParams {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const stored = sessionStorage.getItem('utm_params');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error retrieving stored UTM params:', error);
  }

  return {};
}

/**
 * Get or create session ID
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  } catch (error) {
    console.error('Error getting session ID:', error);
    return '';
  }
}

/**
 * Get all tracking data for current page/view
 */
export function getTrackingData(event: string, additionalData?: Record<string, any>): TrackingData {
  const utmFromURL = getUTMParamsFromURL();
  const storedUTM = getStoredUTMParams();
  
  // Merge: URL params take precedence, but keep stored ones if URL doesn't have them
  const utm: UTMParams = {
    ...storedUTM,
    ...utmFromURL,
  };

  // Store new UTM params if they exist
  if (Object.keys(utmFromURL).length > 0) {
    storeUTMParams(utm);
  }

  return {
    event,
    page: typeof window !== 'undefined' ? window.location.pathname : undefined,
    path: typeof window !== 'undefined' ? window.location.pathname + window.location.search : undefined,
    referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    timestamp: new Date().toISOString(),
    utm: Object.keys(utm).length > 0 ? utm : undefined,
    sessionId: getSessionId(),
    additionalData,
  };
}


