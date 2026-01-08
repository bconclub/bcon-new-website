import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook handler for build.goproxe.com
 * Endpoint: /api/webhook
 * 
 * This endpoint receives webhook calls from:
 * https://build.goproxe.com/webhook/bconclub-website
 */
export async function POST(request: NextRequest) {
  try {
    // Get the webhook payload
    const body = await request.json();
    
    // Log the webhook event (you can customize this based on your needs)
    console.log('Webhook received:', {
      timestamp: new Date().toISOString(),
      payload: body,
    });

    // Verify webhook (add authentication/verification logic if needed)
    // Example: Check for a secret token in headers
    const authHeader = request.headers.get('authorization');
    const webhookSecret = process.env.WEBHOOK_SECRET;
    
    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Process the webhook based on event type
    const eventType = body.event || body.type || 'unknown';
    const trackingData = body.data || {};
    
    switch (eventType) {
      case 'build.complete':
      case 'deployment.success':
        // Handle successful build/deployment
        console.log('Build/deployment successful');
        // Add your custom logic here (e.g., invalidate cache, send notifications)
        break;
      
      case 'build.failed':
      case 'deployment.failed':
        // Handle failed build/deployment
        console.error('Build/deployment failed');
        // Add your custom logic here (e.g., send alerts)
        break;
      
      case 'tracking':
      case 'page_view':
      case 'click':
      case 'scroll':
      case 'form_submit':
      case 'page_exit':
        // Handle tracking events
        console.log(`Tracking event received: ${eventType}`, {
          page: trackingData.page,
          path: trackingData.path,
          utm: trackingData.utm,
          sessionId: trackingData.sessionId,
          timestamp: trackingData.timestamp,
        });
        // Add your custom logic here (e.g., store in database, send to analytics)
        break;
      
      default:
        console.log(`Received webhook event: ${eventType}`, trackingData);
    }

    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Webhook received and processed',
        event: eventType,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process webhook',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for webhook verification/testing
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      message: 'Webhook endpoint is active',
      endpoint: '/api/webhook',
      method: 'POST',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
}

