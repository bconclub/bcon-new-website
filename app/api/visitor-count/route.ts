import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

/**
 * Visitor Count API
 * GET: Increments visitor count and returns current number (unless ?fetchOnly=true)
 * Uses sessionStorage on client side to prevent double-counting on refresh
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fetchOnly = searchParams.get('fetchOnly') === 'true';
    
    const adminClient = createAdminSupabaseClient();
    
    // Get the current visitor count row (there should only be one)
    const { data: analytics, error: fetchError } = await adminClient
      .from('site_analytics')
      .select('id, visitor_count')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (fetchError) {
      // If no row exists, create one
      if (fetchError.code === 'PGRST116') {
        if (fetchOnly) {
          // Just return 0 if fetching only and no row exists
          return NextResponse.json({ count: 0 });
        }
        
        const { data: newAnalytics, error: insertError } = await adminClient
          .from('site_analytics')
          .insert({ visitor_count: 1 })
          .select('visitor_count')
          .single();

        if (insertError) {
          console.error('Error creating visitor count:', insertError);
          return NextResponse.json(
            { error: 'Failed to initialize visitor count' },
            { status: 500 }
          );
        }

        return NextResponse.json({ count: newAnalytics.visitor_count });
      }

      console.error('Error fetching visitor count:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch visitor count' },
        { status: 500 }
      );
    }

    // If fetchOnly is true, just return current count without incrementing
    if (fetchOnly) {
      return NextResponse.json({ count: analytics.visitor_count || 0 });
    }

    // Increment the visitor count
    const newCount = (analytics.visitor_count || 0) + 1;
    
    const { data: updatedAnalytics, error: updateError } = await adminClient
      .from('site_analytics')
      .update({ visitor_count: newCount })
      .eq('id', analytics.id)
      .select('visitor_count')
      .single();

    if (updateError) {
      console.error('Error updating visitor count:', updateError);
      return NextResponse.json(
        { error: 'Failed to update visitor count' },
        { status: 500 }
      );
    }

    return NextResponse.json({ count: updatedAnalytics.visitor_count });
  } catch (error) {
    console.error('Unexpected error in visitor count API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
