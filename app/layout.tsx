import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import TrackingProvider from '@/components/Tracking/TrackingProvider';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import SmoothScroll from '@/lib/lenis';
import ProxeWidget from '@/components/ProxeWidget/ProxeWidget';

export const metadata: Metadata = {
  metadataBase: new URL('https://bconclub.com'),
  title: 'BCON | Human X AI Powered Business Solutions',
  description: 'Intelligent marketing systems. Powered by AI and human creativity.',
  keywords: 'AI marketing, marketing automation, PROXe, Human X AI, business growth',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/bcon-icon.png', type: 'image/png', sizes: '1080x1080' }
    ],
    shortcut: '/favicon.ico',
    apple: '/bcon-icon.png'
  },
  openGraph: {
    title: 'BCON | Human X AI Powered Business Solutions',
    description: 'Intelligent marketing systems. Powered by AI and human creativity.',
    url: 'https://bconclub.com',
    siteName: 'BCON Club',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'BCON Club - Human X AI Powered Business Solutions'
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BCON | Human X AI Powered Business Solutions',
    description: 'Intelligent marketing systems',
    images: ['/og-image.png'],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical LCP images */}
        <link rel="preload" as="image" href="/product thumbnail/PROXe Cover.webp" type="image/webp" />
        <link rel="preload" as="image" href="/portfolio/Showreel Thumbnail.webp" type="image/webp" />
        
        {/* Inline Critical CSS - Above the fold */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical: Dark background to prevent white flash */
            html, body {
              background-color: #000000;
              color: #ffffff;
            }
            /* Critical: Green glow for hero */
            .rotating-text-word {
              color: #CCFF00;
              will-change: filter, opacity;
            }
            /* Critical: Hero typography */
            .tagline {
              font-family: 'Anybody', sans-serif;
              font-weight: 600;
              letter-spacing: 0.2em;
            }
            /* Critical: Prevent layout shift */
            .liquid-ether-container {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: -1;
            }
          `
        }} />
        
        {/* Google Tag Manager */}
        <Script id="gtm-head" strategy="beforeInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KT7RKT5');
          `}
        </Script>
      </head>
      <body>
        <SmoothScroll />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KT7RKT5"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* Google tag (gtag.js) - Loads in head */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4VCRN5SNVT"
          strategy="beforeInteractive"
        />
        <Script id="google-analytics" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4VCRN5SNVT');
          `}
        </Script>
        {/* Microsoft Clarity - Loads in head */}
        <Script id="microsoft-clarity" strategy="beforeInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "i1r2rc40oc");
          `}
        </Script>
        {/* Meta Pixel Code - Loads in head */}
        <Script id="meta-pixel" strategy="beforeInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '915761229111306');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{display: 'none'}}
            src="https://www.facebook.com/tr?id=915761229111306&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <ErrorBoundary>
          <TrackingProvider>
            {children}
          </TrackingProvider>
        </ErrorBoundary>
        {/* PROXe Chat Widget - hidden on /proxe and /proxe-cfs */}
        <ProxeWidget />
      </body>
    </html>
  );
}




