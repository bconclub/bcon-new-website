# Work Page Setup Guide

## ✅ Database Tables Created

The following tables have been created in Supabase:
- `work_items` - Main work items/case studies
- `work_media` - Media gallery for case studies
- `story_highlights` - Story highlight configuration

## Next Steps

### 1. Add Story Highlights

You can add story highlights directly in Supabase or via the admin panel. Here's sample SQL to get started:

```sql
INSERT INTO story_highlights (title, category, thumbnail_url, filter_tag, order_index, status) VALUES
  ('Featured', 'featured', 'https://your-image-url.com/featured.jpg', 'featured', 1, 'active'),
  ('Creative', 'creative', 'https://your-image-url.com/creative.jpg', 'creative', 2, 'active'),
  ('Technology', 'technology', 'https://your-image-url.com/tech.jpg', 'tech', 3, 'active'),
  ('Recent', 'recent', 'https://your-image-url.com/recent.jpg', 'recent', 4, 'active'),
  ('Client Stories', 'client-stories', 'https://your-image-url.com/clients.jpg', 'client-stories', 5, 'active');
```

### 2. Create Your First Work Item

#### Via Supabase Dashboard:
1. Go to `work_items` table
2. Click "Insert row"
3. Fill in required fields:
   - `client_name` (text)
   - `project_title` (text)
   - `category` ('creative' or 'tech')
   - `status` ('draft' or 'published')

#### Optional Fields:
- `project_type` - e.g., "Brand Identity", "Web Platform"
- `thumbnail_url` - URL to thumbnail image
- `thumbnail_aspect_ratio` - 'square', 'tall', 'story', 'wide', or 'auto'
- `hero_media_url` - Main hero image/video URL
- `hero_media_type` - 'image' or 'video'
- `description` - Brief project description
- `challenge` - What problem was solved
- `solution` - What was built
- `approach` - How it was done
- `tech_stack` - Array of technologies: `["React", "Next.js", "Supabase"]`
- `metrics` - JSON array: `[{"label": "5X conversion", "description": "Conversion rate increase"}]`
- `live_url` - Link to live project
- `industry` - Client industry
- `project_date` - Date of project
- `tags` - Array of tags: `["web", "branding"]`
- `featured` - Boolean (true/false)

### 3. Add Media to Work Items

After creating a work item, add media:

1. Go to `work_media` table
2. Click "Insert row"
3. Fill in:
   - `work_item_id` - UUID from the work item
   - `media_url` - URL to image/video
   - `media_type` - 'image' or 'video'
   - `section` - 'creative' or 'tech'
   - `caption` - Optional caption
   - `order_index` - Display order (0, 1, 2, etc.)

### 4. Upload Images/Videos to Supabase Storage

1. Go to Supabase Dashboard → Storage
2. Create a bucket named `work-images` (or use existing `portfolio-images`)
3. Upload your files
4. Get the public URL from the file
5. Use that URL in `thumbnail_url`, `hero_media_url`, or `media_url` fields

### 5. Test the Work Page

1. Visit `/work` in your app
2. You should see:
   - Story highlights (if added)
   - Category toggle
   - Work grid (if work items exist)
3. Click a work card to open the case study modal

### 6. Admin Panel

Visit `/admin/work` to:
- View all work items
- Filter by category
- Edit/Delete work items
- Manage story highlights

## Sample Work Item JSON

```json
{
  "client_name": "TechCorp Inc.",
  "project_title": "AI-Powered CRM Platform",
  "project_type": "Web Platform",
  "category": "tech",
  "status": "published",
  "featured": true,
  "thumbnail_url": "https://your-storage.com/thumbnail.jpg",
  "thumbnail_aspect_ratio": "wide",
  "hero_media_url": "https://your-storage.com/hero.jpg",
  "hero_media_type": "image",
  "description": "Built a comprehensive CRM platform with AI-powered lead scoring and customer insights.",
  "challenge": "Client needed a unified platform to manage customer relationships and automate sales processes.",
  "solution": "Developed a full-stack CRM with real-time analytics, AI recommendations, and seamless integrations.",
  "approach": "Used React for frontend, Next.js for SSR, Supabase for backend, and integrated OpenAI for AI features.",
  "tech_stack": ["React", "Next.js", "Supabase", "OpenAI", "TypeScript"],
  "metrics": [
    {"label": "5X conversion", "description": "Conversion rate increase"},
    {"label": "80% time saved", "description": "Automation reduced manual work"}
  ],
  "live_url": "https://example.com",
  "industry": "Technology",
  "project_date": "2024-01-15",
  "tags": ["web", "ai", "crm", "platform"]
}
```

## Tips

- Start with `status: 'draft'` to test before publishing
- Use `featured: true` for items you want to highlight
- Organize media by section ('creative' vs 'tech') for better showcase
- Use appropriate aspect ratios for thumbnails to create visual variety
- Add captions to media for better context

## Troubleshooting

- **No work items showing?** Check that `status = 'published'`
- **Story highlights not appearing?** Ensure `status = 'active'`
- **Images not loading?** Verify Supabase Storage bucket permissions are public
- **Modal not opening?** Check browser console for errors



