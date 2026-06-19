'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import './thank-you.css';

// Dynamically import LiquidEther to avoid SSR issues with Three.js
const DynamicLiquidEther = dynamic(
  () => import('@/effects/LiquidEther/LiquidEther'),
  { ssr: false }
);

// Wrap the content component to handle search params safely
function ThankYouContent() {
  const searchParams = useSearchParams();
  const [isCalling, setIsCalling] = useState(false);
  const [hasWhatsAppClicked, setHasWhatsAppClicked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Ensure component is mounted before accessing browser APIs
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fire conversion events once on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Meta Pixel — Lead conversion
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: service || 'contact_form',
      });
    }
    // GTM — lead_conversion
    if ((window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'lead_conversion',
        service: service || '',
        formType: 'contact',
        hasPhone: !!phone,
        hasEmail: !!email,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Safely get form data from query params with fallbacks
  const name = searchParams?.get('name') || '';
  const email = searchParams?.get('email') || '';
  const phone = searchParams?.get('phone') || '';
  const brandName = searchParams?.get('brandName') || '';
  const service = searchParams?.get('service') || '';
  const leadId = searchParams?.get('leadId') || '';
  
  // Only construct WhatsApp URL on client side
  const [whatsappUrl, setWhatsappUrl] = useState('https://wa.me/6360079756');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const phoneNumber = '916360079756';
        const message = `Hi BCON! I'm ${name}${brandName ? ` from ${brandName}` : ''}. I'm interested in ${service}. You can reach me at ${phone}${email ? ` / ${email}` : ''}.`;
        setWhatsappUrl(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
      } catch (e) {
        console.error('Error constructing WhatsApp URL:', e);
        setWhatsappUrl('https://wa.me/916360079756');
      }
    }
  }, [name, email, phone, brandName, service]);
  
  const handleCallClick = async () => {
    if (!phone) {
      alert('Phone number not provided. Please use WhatsApp instead.');
      return;
    }
    
    setIsCalling(true);
    
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: 'call_click', source: 'thank_you', service });
    }

    try {
      // Call PROXe to trigger voice call
      const response = await fetch('https://proxe.bconclub.com/api/voice/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone,
          name: name || 'Customer',
          brand: brandName || 'bcon',
          service_interest: service || '',
          lead_id: leadId
        })
      });
      
      if (response.ok) {
        alert('Our AI assistant will call you shortly!');
      } else {
        alert('Unable to place call. Please try WhatsApp or wait for our team to call.');
      }
    } catch (error) {
      console.error('Call failed:', error);
      alert('Call service unavailable. Please use WhatsApp.');
    } finally {
      setIsCalling(false);
    }
  };
  
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    if (hasWhatsAppClicked) {
      e.preventDefault();
      return;
    }
    setHasWhatsAppClicked(true);
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: 'whatsapp_click', source: 'thank_you', service });
    }
  };
  
  // Show loading state while mounting
  if (!isMounted) {
    return (
      <div className="thank-you-content">
        <h1 className="thank-you-title">You're in</h1>
        <p className="thank-you-message">We've received your details, we'll get in touch shortly</p>
      </div>
    );
  }
  
  return (
    <div className="thank-you-content">
      <h1 className="thank-you-title">You're in</h1>
      
      <p className="thank-you-message">
        We've received your details, we'll get in touch shortly
      </p>

      <div className="thank-you-actions">
        <a
          href={whatsappUrl}
          onClick={handleWhatsAppClick}
          target="_blank" 
          rel="noopener noreferrer"
          className="thank-you-button thank-you-button-whatsapp"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          WhatsApp
        </a>
      </div>
      
      <div className="thank-you-home-action">
        <Link href="/" className="thank-you-button thank-you-button-home">
          <span>Home</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </Link>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
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
      
      <Suspense fallback={
        <div className="thank-you-content">
          <h1 className="thank-you-title">You're in</h1>
          <p className="thank-you-message">We've received your details, we'll get in touch shortly</p>
        </div>
      }>
        <ThankYouContent />
      </Suspense>
    </div>
  );
}
