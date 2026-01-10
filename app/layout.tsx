import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import TrackingProvider from '@/components/Tracking/TrackingProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://bconclub.com'),
  title: 'BCON Club | Human X AI Powered Business Solutions',
  description: 'Intelligent marketing systems. Powered by AI and human creativity.',
  keywords: 'AI marketing, marketing automation, PROXe, Human X AI, business growth',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'BCON Club | Human X AI Powered Business Solutions',
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
    title: 'BCON Club | Human X AI Powered Business Solutions',
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
      <body>
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
        <TrackingProvider>
          {children}
        </TrackingProvider>
      </body>
    </html>
  );
}




