# UTM Tracking & Webhook Integration

This module provides comprehensive tracking functionality that automatically captures UTM parameters and sends all tracking data to the webhook endpoint.

## Features

- ✅ Automatic UTM parameter capture and persistence
- ✅ Page view tracking
- ✅ Click/interaction tracking
- ✅ Scroll depth tracking
- ✅ Form submission tracking
- ✅ Time on page tracking
- ✅ Session management
- ✅ Automatic batching and queuing
- ✅ Retry logic for failed requests

## Quick Start

The tracking is automatically enabled when you include `TrackingProvider` in your layout (already done).

## Manual Event Tracking

```typescript
import { useTracking } from '@/lib/tracking';

function MyComponent() {
  const { trackEvent, trackEventImmediate } = useTracking();
  
  const handleAction = () => {
    // Queue event (batched for performance)
    trackEvent('button_click', {
      buttonId: 'cta-primary',
      section: 'hero'
    });
    
    // Or send immediately (for critical events)
    trackEventImmediate('purchase_complete', {
      orderId: '12345',
      amount: 99.99
    });
  };
}
```

## UTM Parameters

UTM parameters are automatically captured from URLs:
- `?utm_source=google&utm_medium=cpc&utm_campaign=summer`

They persist throughout the session and are included in all tracking events.

## Webhook Configuration

**Webhook URL**: `https://build.goproxe.com/webhook/bconclub-website`

Set environment variables:
```bash
NEXT_PUBLIC_WEBHOOK_URL=https://build.goproxe.com/webhook/bconclub-website
NEXT_PUBLIC_WEBHOOK_SECRET=your-secret-token  # Optional
NEXT_PUBLIC_ENABLE_WEBHOOK_TRACKING=true  # Enable in dev
```

## Data Structure

All events include:
- Event type and timestamp
- Page path and referrer
- UTM parameters (if present)
- Session ID
- User agent
- Custom additional data

See `lib/tracking/utm.ts` for the full `TrackingData` interface.

