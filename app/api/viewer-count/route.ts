import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET - Fetch current viewer count
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the viewer count from the site_stats table
    const { data, error } = await supabase
      .from('site_stats')
      .select('viewer_count')
      .eq('id', 'main')
      .single();

    if (error) {
      // If table doesn't exist or row doesn't exist, return 0
      if (error.code === 'PGRST116' || error.code === '42P01') {
        return NextResponse.json({ count: 0 }, { status: 200 });
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ count: data?.viewer_count || 0 }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Increment viewer count
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // First, try to get the current count
    const { data: currentData, error: fetchError } = await supabase
      .from('site_stats')
      .select('viewer_count')
      .eq('id', 'main')
      .single();

    const currentCount = currentData?.viewer_count || 0;
    const newCount = currentCount + 1;

    // Try to update existing record
    if (currentData) {
      const { data: updateData, error: updateError } = await supabase
        .from('site_stats')
        .update({ viewer_count: newCount })
        .eq('id', 'main')
        .select('viewer_count')
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ count: updateData?.viewer_count || newCount }, { status: 200 });
    } else {
      // If no record exists, create one
      const { data: insertData, error: insertError } = await supabase
        .from('site_stats')
        .insert({ id: 'main', viewer_count: 1 })
        .select('viewer_count')
        .single();

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ count: insertData?.viewer_count || 1 }, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
