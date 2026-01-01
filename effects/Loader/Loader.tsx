'use client';

import { useState, useEffect } from 'react';
import './Loader.css';

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="loader-container">
      <div className="loader-content">
        <h1 className="loader-text">
          HUMAN <span className="loader-accent">X</span> AI
        </h1>
        <div className="loader-bar"></div>
      </div>
    </div>
  );
}

