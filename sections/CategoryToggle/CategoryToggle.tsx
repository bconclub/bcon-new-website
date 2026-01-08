'use client';

import { motion } from 'motion/react';
import './CategoryToggle.css';

interface CategoryToggleProps {
  activeCategory: 'creative' | 'tech';
  onToggle: (category: 'creative' | 'tech') => void;
}

export default function CategoryToggle({ activeCategory, onToggle }: CategoryToggleProps) {
  return (
    <div className="category-toggle-container">
      <div className="category-toggle-wrapper">
        <button
          className={`category-toggle-btn ${activeCategory === 'creative' ? 'active' : ''}`}
          onClick={() => onToggle('creative')}
        >
          <span>Creative</span>
        </button>
        <button
          className={`category-toggle-btn ${activeCategory === 'tech' ? 'active' : ''}`}
          onClick={() => onToggle('tech')}
        >
          <span>Tech</span>
        </button>
        <motion.div
          className="category-toggle-indicator"
          initial={false}
          animate={{
            x: activeCategory === 'creative' ? '0%' : '100%',
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        />
      </div>
    </div>
  );
}



