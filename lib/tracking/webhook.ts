/**
 * Webhook Service
 * Sends tracking data to build.goproxe.com webhook
 */

import { TrackingData } from './utm';

const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || 'https://build.goproxe.com/webhook/bconclub-website';

export interface WebhookResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Send tracking data to webhook
 */
export async function sendToWebhook(data: TrackingData): Promise<WebhookResponse> {
  try {
    // Prepare payload with all session details
    const payload = {
      // Event info
      event: data.event,
      type: 'tracking',
      timestamp: data.timestamp,
      
      // Session tracking data
      page: data.page,
      path: data.path,
      referrer: data.referrer,
      userAgent: data.userAgent,
      sessionId: data.sessionId,
      userId: data.userId,
      
      // UTM parameters (flattened for easier access)
      ...(data.utm && {
        utm_source: data.utm.utm_source,
        utm_medium: data.utm.utm_medium,
        utm_campaign: data.utm.utm_campaign,
        utm_term: data.utm.utm_term,
        utm_content: data.utm.utm_content,
      }),
      
      // All additional data (form fields, form metadata, page context, etc.) - flattened
      ...data.additionalData,
    };

    // Don't send in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_ENABLE_WEBHOOK_TRACKING) {
      console.log('[Webhook Tracking] Development mode - Full payload (not sent):', JSON.stringify(payload, null, 2));
      return { success: true, message: 'Development mode - not sent' };
    }

    // Log payload in production for debugging (can be removed if not needed)
    if (process.env.NODE_ENV === 'production') {
      console.log('[Webhook Tracking] Sending form submission with session details');
    }

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.NEXT_PUBLIC_WEBHOOK_SECRET && {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_WEBHOOK_SECRET}`,
        }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Webhook request failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return { success: true, message: 'Data sent successfully', ...result };
  } catch (error) {
    console.error('Error sending data to webhook:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send tracking data with retry logic
 */
export async function sendToWebhookWithRetry(
  data: TrackingData,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<WebhookResponse> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await sendToWebhook(data);
    
    if (result.success) {
      return result;
    }

    lastError = new Error(result.error || 'Unknown error');

    // Don't retry on the last attempt
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Failed after retries',
  };
}

/**
 * Queue tracking data for batch sending (optional optimization)
 */
class TrackingQueue {
  private queue: TrackingData[] = [];
  private batchSize: number = 10;
  private flushInterval: number = 5000; // 5 seconds
  private timer: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Flush queue on page unload
      window.addEventListener('beforeunload', () => {
        this.flush();
      });
    }
  }

  add(data: TrackingData): void {
    this.queue.push(data);

    // Auto-flush if queue is full
    if (this.queue.length >= this.batchSize) {
      this.flush();
    } else if (!this.timer) {
      // Set timer to flush after interval
      this.timer = setTimeout(() => {
        this.flush();
      }, this.flushInterval);
    }
  }

  async flush(): Promise<void> {
    if (this.queue.length === 0) {
      return;
    }

    const batch = [...this.queue];
    this.queue = [];

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    // Send each item in the batch
    await Promise.allSettled(
      batch.map(data => sendToWebhook(data))
    );
  }
}

// Singleton instance
let trackingQueue: TrackingQueue | null = null;

export function getTrackingQueue(): TrackingQueue {
  if (!trackingQueue) {
    trackingQueue = new TrackingQueue();
  }
  return trackingQueue;
}

