'use client';

import dynamic from 'next/dynamic';
import RotatingText from '@/sections/RotatingText/RotatingText';
import ShowReel from '@/sections/ShowReel/ShowReel';

// Dynamically import LiquidEther to avoid SSR issues with Three.js
const DynamicLiquidEther = dynamic(
  () => import('@/effects/LiquidEther/LiquidEther'),
  { ssr: false }
);

export default function MobileHero() {
  const rotatingWords = ['Thinks', 'Learns', 'Scales'];

  return (
    <div className="container">
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <DynamicLiquidEther
          colors={['#CCFF00', '#CCFF00', '#CCFF00']}
          mouseForce={20}
          cursorSize={100}
          resolution={0.3}
          autoDemo={true}
          autoSpeed={0.2}
          autoIntensity={2.2}
          dt={0.04}
          iterationsPoisson={16}
          iterationsViscous={16}
        />
      </div>
      <div className="content">
        <p className="tagline">HUMAN <span style={{color: '#CCFF00'}}>X</span> AI</p>
        <h1>
          Marketing <RotatingText words={rotatingWords} interval={2000} />
        </h1>
        <p className="description">
          We build intelligent business systems powered by AI and human creativity.
        </p>
        <ShowReel />
      </div>
    </div>
  );
}

