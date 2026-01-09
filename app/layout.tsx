import type { Metadata } from 'next';
import './globals.css';
import TrackingProvider from '@/components/Tracking/TrackingProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://bconclub.com'),
  title: 'BCON Club | Human X AI Powered Marketing',
  description: 'Intelligent marketing systems. Powered by AI and human creativity.',
  keywords: 'AI marketing, marketing automation, PROXe, Human X AI, business growth',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'BCON Club | Human X AI Powered Marketing',
    description: 'Intelligent marketing systems. Powered by AI and human creativity.',
    url: 'https://bconclub.com',
    siteName: 'BCON Club',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'BCON Club - Human X AI Powered Marketing'
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BCON Club | Human X AI Powered Marketing',
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
        <TrackingProvider>
          {children}
        </TrackingProvider>
      </body>
    </html>
  );
}




