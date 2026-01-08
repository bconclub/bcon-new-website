# Form Submission Tracking & Webhook Integration

This module tracks form submissions and sends them to the webhook endpoint with full session details including UTM parameters.

## Features

- ✅ Automatic UTM parameter capture and persistence
- ✅ Form submission tracking with all form field values
- ✅ Session management (session ID tracking)
- ✅ Full session context included (page, referrer, user agent, UTM params)
- ✅ Retry logic for failed requests

## Quick Start

The tracking is automatically enabled when you include `TrackingProvider` in your layout (already done).

Form submissions are automatically tracked and sent to the webhook with:
- All form field values
- Current page and path
- Referrer URL
- User agent
- Session ID
- UTM parameters (if present)
- Page title and viewport size

## Manual Event Tracking (Optional)

```typescript
import { useTracking } from '@/lib/tracking';

function MyComponent() {
  const { trackEventImmediate } = useTracking();
  
  const handleAction = () => {
    // Send custom event immediately
    trackEventImmediate('custom_event', {
      actionType: 'button_click',
      buttonId: 'cta-primary'
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

Form submission events include:
- Event type: `form_submit`
- Timestamp
- Form data: All form field values (name, email, message, etc.)
- Form metadata: Form ID, action, method
- Page path and referrer
- UTM parameters (if present) - automatically captured and persisted
- Session ID - unique identifier for the user session
- User agent - browser and device information
- Page title and viewport size

### Example Payload

```json
{
  "event": "form_submit",
  "type": "tracking",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "page": "/contact",
  "path": "/contact?utm_source=google&utm_campaign=summer",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "sessionId": "session_1705312200000_abc123",
  "formId": "contact-form",
  "formAction": "/api/contact",
  "formMethod": "POST",
  "formData": {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, I'm interested in..."
  },
  "pageTitle": "BCON Club - Contact",
  "viewport": {
    "width": 1920,
    "height": 1080
  },
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "summer"
}
```

See `lib/tracking/utm.ts` for the full `TrackingData` interface.

