'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import './thank-you.css';

// Dynamically import LiquidEther to avoid SSR issues with Three.js
const DynamicLiquidEther = dynamic(
  () => import('@/effects/LiquidEther/LiquidEther'),
  { ssr: false }
);

export default function ThankYouPage() {
  return (
    <div className="thank-you-container">
      {/* Background effect - same as homepage */}
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
      
      {/* Glass frosted container */}
      <div className="thank-you-content">
        <h1 className="thank-you-title">THANK YOU</h1>
        
        <p className="thank-you-message">
          Appreciate you taking the time to connect.
        </p>
        
        <p className="thank-you-submessage">
          We'll get back to in next couple of hours
        </p>

        <div className="thank-you-instagram">
          <p className="thank-you-instagram-text">
            Check out our work:{' '}
            <a 
              href="https://www.instagram.com/bconclub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="thank-you-instagram-link"
            >
              @bconclub
            </a>
          </p>
        </div>

        <div className="thank-you-actions">
          <Link href="/" className="thank-you-button">
            [HOME]
          </Link>
        </div>
      </div>
    </div>
  );
}
