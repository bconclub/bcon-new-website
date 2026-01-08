'use client';

import { useEffect, useState } from 'react';
import WorkCard, { WorkCardProps } from '@/sections/WorkCard/WorkCard';
import '@/sections/WorkGrid/WorkGrid.css';

interface WorkItem {
  id: string;
  client_name: string;
  project_title: string;
  project_type?: string;
  thumbnail_url?: string;
  thumbnail_aspect_ratio?: 'square' | 'tall' | 'story' | 'wide' | 'auto';
  hero_media_url?: string;
  hero_media_type?: 'image' | 'video';
  featured?: boolean;
}

interface MobileWorkGridProps {
  category: 'creative' | 'tech';
  onCardClick: (workItem: WorkItem) => void;
}

export default function MobileWorkGrid({ category, onCardClick }: MobileWorkGridProps) {
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkItems();
  }, [category]);

  const fetchWorkItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/work?category=${category}&status=published`);
      const result = await response.json();
      
      if (result.data) {
        setWorkItems(result.data);
      }
    } catch (error) {
      console.error('Error fetching work items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="work-grid-loading">
        <div className="work-grid-spinner" />
      </div>
    );
  }

  if (workItems.length === 0) {
    return (
      <div className="work-grid-empty">
        <p>No {category} work found.</p>
      </div>
    );
  }

  return (
    <div className="work-grid-container">
      <div className="work-grid">
        {workItems.map((item) => (
          <WorkCard
            key={item.id}
            id={item.id}
            clientName={item.client_name}
            projectTitle={item.project_title}
            projectType={item.project_type}
            thumbnailUrl={item.thumbnail_url}
            thumbnailAspectRatio={item.thumbnail_aspect_ratio}
            heroMediaUrl={item.hero_media_url}
            heroMediaType={item.hero_media_type}
            featured={item.featured}
            onClick={() => onCardClick(item)}
          />
        ))}
      </div>
    </div>
  );
}

