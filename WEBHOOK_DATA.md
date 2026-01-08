# Webhook Data Documentation

## Webhook URL

**Primary Webhook Endpoint:**
```
https://build.goproxe.com/webhook/bconclub-website
```

**Configuration:**
- Set via environment variable: `NEXT_PUBLIC_WEBHOOK_URL`
- Default fallback: `https://build.goproxe.com/webhook/bconclub-website`
- Method: `POST`
- Content-Type: `application/json`

**Authentication (Optional):**
- Header: `Authorization: Bearer {NEXT_PUBLIC_WEBHOOK_SECRET}`
- Set via environment variable: `NEXT_PUBLIC_WEBHOOK_SECRET`
- If not set, requests are sent without authentication

---

## Data Structure

All tracking events are sent as JSON POST requests with the following structure:

### Base Payload Structure

```json
{
  "event": "event_type",
  "type": "tracking",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "page": "/work",
  "path": "/work?utm_source=google&utm_campaign=summer",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...",
  "sessionId": "session_1705312200000_abc123xyz",
  "userId": "user_123" // Optional, if user is authenticated
}
```

### UTM Parameters (Flattened)

If UTM parameters are present, they are included as top-level fields:

```json
{
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "summer",
  "utm_term": "business apps",
  "utm_content": "ad_variant_1"
}
```

### Additional Data

Event-specific data is flattened into the payload:

```json
{
  "pageTitle": "BCON Club - Work",
  "viewport": {
    "width": 1920,
    "height": 1080
  },
  // ... event-specific fields
}
```

---

## Event Types & Data Sent

### 1. Page View (`page_view`)

**Triggered:**
- On initial page load
- On route change (Next.js navigation)
- 100ms after page/route change

**Data Sent:**
```json
{
  "event": "page_view",
  "type": "tracking",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "page": "/work",
  "path": "/work?utm_source=google",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "sessionId": "session_1705312200000_abc123",
  "pageTitle": "BCON Club - Work",
  "viewport": {
    "width": 1920,
    "height": 1080
  },
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "summer"
}
```

**Fields:**
- `event`: Always `"page_view"`
- `page`: Current page pathname (e.g., `/work`, `/services`)
- `path`: Full path with query string
- `referrer`: Previous page URL
- `userAgent`: Browser user agent string
- `sessionId`: Unique session identifier
- `pageTitle`: Document title
- `viewport`: Browser viewport dimensions
- `utm_*`: UTM parameters (if present)

---

### 2. Click Events (`click`)

**Triggered:**
- When user clicks on:
  - Links (`<a>` tags)
  - Buttons (`<button>` tags)
  - Elements with `role="button"`

**Data Sent:**
```json
{
  "event": "click",
  "type": "tracking",
  "timestamp": "2024-01-15T10:30:15.000Z",
  "page": "/work",
  "path": "/work",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "sessionId": "session_1705312200000_abc123",
  "elementType": "a",
  "elementText": "View Project",
  "elementHref": "https://bconclub.com/work/project-1",
  "elementId": "cta-primary",
  "elementClass": "btn btn-primary",
  "utm_source": "google"
}
```

**Fields:**
- `event`: Always `"click"`
- `elementType`: HTML tag name (e.g., `"a"`, `"button"`)
- `elementText`: Text content (truncated to 100 chars)
- `elementHref`: Link URL (if applicable)
- `elementId`: Element ID attribute
- `elementClass`: Element class attribute
- All base tracking fields (page, path, referrer, etc.)

---

### 3. Scroll Depth (`scroll`)

**Triggered:**
- When user scrolls to:
  - 25% of page
  - 50% of page
  - 75% of page
  - 100% of page
- Only fires once per milestone per page

**Data Sent:**
```json
{
  "event": "scroll",
  "type": "tracking",
  "timestamp": "2024-01-15T10:30:30.000Z",
  "page": "/work",
  "path": "/work",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "sessionId": "session_1705312200000_abc123",
  "depth": 25,
  "utm_source": "google"
}
```

**Fields:**
- `event`: Always `"scroll"`
- `depth`: Scroll depth percentage (25, 50, 75, or 100)
- All base tracking fields

---

### 4. Form Submission (`form_submit`)

**Triggered:**
- When user submits any form on the page

**Data Sent:**
```json
{
  "event": "form_submit",
  "type": "tracking",
  "timestamp": "2024-01-15T10:31:00.000Z",
  "page": "/contact",
  "path": "/contact",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "sessionId": "session_1705312200000_abc123",
  "formId": "contact-form",
  "formAction": "/api/contact",
  "formMethod": "POST",
  "formData": {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, I'm interested in...",
    "newsletter": true
  },
  "utm_source": "google"
}
```

**Fields:**
- `event`: Always `"form_submit"`
- `formId`: Form ID attribute
- `formAction`: Form action URL
- `formMethod`: Form method (GET/POST)
- `formData`: Object containing all form field values
  - Text inputs: string values
  - Checkboxes: boolean values
  - Radio buttons: selected value
  - Selects: selected value
  - Textareas: string values
- All base tracking fields

**Note:** Form data includes all fields except submit buttons and hidden fields that aren't inputs.

---

### 5. Page Exit (`page_exit`)

**Triggered:**
- When user leaves the page (beforeunload event)
- Sent immediately (not queued) to ensure delivery

**Data Sent:**
```json
{
  "event": "page_exit",
  "type": "tracking",
  "timestamp": "2024-01-15T10:35:00.000Z",
  "page": "/work",
  "path": "/work",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "sessionId": "session_1705312200000_abc123",
  "timeOnPage": 300,
  "utm_source": "google"
}
```

**Fields:**
- `event`: Always `"page_exit"`
- `timeOnPage`: Time spent on page in seconds
- All base tracking fields

---

### 6. Custom Events

**Triggered:**
- When manually called using `useTracking()` hook

**Usage:**
```typescript
import { useTracking } from '@/lib/tracking';

function MyComponent() {
  const { trackEvent, trackEventImmediate } = useTracking();
  
  // Queued (batched)
  trackEvent('custom_action', {
    actionType: 'button_click',
    buttonId: 'cta-primary',
    section: 'hero'
  });
  
  // Immediate (sent right away)
  trackEventImmediate('purchase_complete', {
    orderId: '12345',
    amount: 99.99
  });
}
```

**Data Sent:**
```json
{
  "event": "custom_action",
  "type": "tracking",
  "timestamp": "2024-01-15T10:32:00.000Z",
  "page": "/work",
  "path": "/work",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "sessionId": "session_1705312200000_abc123",
  "actionType": "button_click",
  "buttonId": "cta-primary",
  "section": "hero",
  "utm_source": "google"
}
```

**Fields:**
- `event`: Custom event name (provided by developer)
- All custom fields from `additionalData` parameter
- All base tracking fields

---

## UTM Parameter Tracking

### How UTM Parameters Work

1. **Capture**: UTM parameters are automatically parsed from URL query strings
2. **Storage**: Stored in `sessionStorage` for the entire browser session
3. **Persistence**: UTM parameters persist across page navigations
4. **Inclusion**: Included in ALL tracking events for the session

### UTM Parameters Tracked

- `utm_source` - Traffic source (e.g., "google", "facebook")
- `utm_medium` - Marketing medium (e.g., "cpc", "email", "social")
- `utm_campaign` - Campaign name (e.g., "summer_sale")
- `utm_term` - Campaign term/keyword (e.g., "business apps")
- `utm_content` - Content variation (e.g., "ad_variant_1")

### Example URL
```
https://bconclub.com/work?utm_source=google&utm_medium=cpc&utm_campaign=summer
```

All subsequent events in that session will include:
```json
{
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "summer"
}
```

---

## Session Management

### Session ID

- **Format**: `session_{timestamp}_{random_string}`
- **Example**: `session_1705312200000_abc123xyz`
- **Storage**: `sessionStorage` (cleared when browser tab closes)
- **Persistence**: Same session ID for all events in the same browser session
- **Uniqueness**: New session ID created on new tab/window

### Session Lifecycle

1. User opens website → New session ID created
2. User navigates pages → Same session ID used
3. User closes tab → Session ends
4. User opens new tab → New session ID created

---

## Batching & Queue System

### How It Works

Events are queued and sent in batches for better performance:

1. **Queue**: Events are added to an in-memory queue
2. **Batch Size**: 10 events per batch
3. **Flush Interval**: 5 seconds (auto-flush)
4. **Immediate Flush**: When queue reaches 10 events
5. **Page Unload**: Queue is flushed on `beforeunload`

### Queue Behavior

- **Normal Events**: Queued and batched (page_view, click, scroll, form_submit)
- **Immediate Events**: Sent right away (page_exit, custom immediate events)
- **Retry Logic**: Failed requests are retried up to 3 times with exponential backoff

### Retry Logic

- **Max Retries**: 3 attempts
- **Retry Delay**: 1 second × attempt number (1s, 2s, 3s)
- **Failure Handling**: Errors are logged to console

---

## Development Mode

### Behavior

In development mode (`NODE_ENV=development`):

- **Default**: Events are logged to console but NOT sent to webhook
- **Enable**: Set `NEXT_PUBLIC_ENABLE_WEBHOOK_TRACKING=true` to send in dev
- **Console Log**: `[Webhook Tracking] Development mode - data logged but not sent: {...}`

### Configuration

```bash
# .env.local
NEXT_PUBLIC_ENABLE_WEBHOOK_TRACKING=true  # Enable tracking in dev
NEXT_PUBLIC_WEBHOOK_URL=https://build.goproxe.com/webhook/bconclub-website
NEXT_PUBLIC_WEBHOOK_SECRET=your-secret-token  # Optional
```

---

## Complete Example Payload

Here's a complete example of what gets sent to the webhook:

```json
{
  "event": "page_view",
  "type": "tracking",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "page": "/work",
  "path": "/work?utm_source=google&utm_medium=cpc&utm_campaign=summer&utm_term=business%20apps",
  "referrer": "https://www.google.com/search?q=bcon+club",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "sessionId": "session_1705312200000_abc123xyz",
  "pageTitle": "BCON Club - Work",
  "viewport": {
    "width": 1920,
    "height": 1080
  },
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "summer",
  "utm_term": "business apps"
}
```

---

## Webhook Endpoint (Internal)

The application also has an internal webhook endpoint at `/api/webhook` that can receive webhook calls from external services (like build.goproxe.com).

### Endpoint Details

- **URL**: `/api/webhook`
- **Methods**: `GET` (verification), `POST` (receive webhooks)
- **Authentication**: Optional `WEBHOOK_SECRET` environment variable

### Supported Event Types (Incoming)

- `build.complete` / `deployment.success`
- `build.failed` / `deployment.failed`
- `tracking` / `page_view` / `click` / `scroll` / `form_submit` / `page_exit`
- Custom events

---

## Summary

### What Gets Sent

✅ **Always Included:**
- Event type and timestamp
- Current page path
- Full URL with query string
- Referrer URL
- User agent
- Session ID
- UTM parameters (if present)

✅ **Event-Specific:**
- Page views: page title, viewport size
- Clicks: element details (type, text, href, id, class)
- Scroll: depth percentage
- Forms: form details and all field values
- Exit: time on page
- Custom: any additional data provided

### When Events Are Sent

- **Page View**: On page load and route changes
- **Clicks**: Immediately on click
- **Scroll**: At 25%, 50%, 75%, 100% milestones
- **Forms**: On form submission
- **Exit**: On page unload (sent immediately)
- **Custom**: When manually triggered

### Where Data Goes

- **Outgoing**: `https://build.goproxe.com/webhook/bconclub-website`
- **Incoming**: `/api/webhook` (for external webhooks)

---

**Last Updated**: Based on current codebase implementation
**Files**: 
- `lib/tracking/webhook.ts` - Webhook sending logic
- `lib/tracking/utm.ts` - UTM parameter handling
- `components/Tracking/TrackingProvider.tsx` - Event tracking
- `app/api/webhook/route.ts` - Webhook endpoint
