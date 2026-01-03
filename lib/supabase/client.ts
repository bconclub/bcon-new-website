import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client (for use in client components)
export const createSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Direct client creation (alternative approach)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Type definitions for database
export type Database = {
  public: {
    Tables: {
      portfolio_items: {
        Row: {
          id: string;
          title: string;
          slug: string;
          category_id: string | null;
          client_name: string | null;
          industry: string | null;
          project_type: string | null;
          description: string | null;
          one_line_result: string | null;
          featured_image_url: string | null;
          gallery_images: any;
          video_url: string | null;
          video_thumbnail_url: string | null;
          metrics: any;
          tags: string[];
          status: 'draft' | 'published' | 'archived';
          featured: boolean;
          project_date: string | null;
          created_at: string;
          updated_at: string;
          meta_title: string | null;
          meta_description: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          category_id?: string | null;
          client_name?: string | null;
          industry?: string | null;
          project_type?: string | null;
          description?: string | null;
          one_line_result?: string | null;
          featured_image_url?: string | null;
          gallery_images?: any;
          video_url?: string | null;
          video_thumbnail_url?: string | null;
          metrics?: any;
          tags?: string[];
          status?: 'draft' | 'published' | 'archived';
          featured?: boolean;
          project_date?: string | null;
          created_at?: string;
          updated_at?: string;
          meta_title?: string | null;
          meta_description?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          category_id?: string | null;
          client_name?: string | null;
          industry?: string | null;
          project_type?: string | null;
          description?: string | null;
          one_line_result?: string | null;
          featured_image_url?: string | null;
          gallery_images?: any;
          video_url?: string | null;
          video_thumbnail_url?: string | null;
          metrics?: any;
          tags?: string[];
          status?: 'draft' | 'published' | 'archived';
          featured?: boolean;
          project_date?: string | null;
          created_at?: string;
          updated_at?: string;
          meta_title?: string | null;
          meta_description?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};



