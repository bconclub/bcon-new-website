'use client';

import Link from 'next/link';
import './thank-you.css';

export default function ThankYouPage() {
  return (
    <div className="thank-you-container">
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
