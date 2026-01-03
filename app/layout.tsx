import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BCON Club - Human × AI Business Solutions',
  description: 'We build intelligent business systems powered by AI and human creativity. AI in Business, Brand Marketing, and Business Apps.',
  keywords: ['AI', 'Business Intelligence', 'Brand Marketing', 'Business Apps', 'BCON Club'],
  authors: [{ name: 'BCON Club' }],
  openGraph: {
    title: 'BCON Club - Human × AI Business Solutions',
    description: 'We build intelligent business systems powered by AI and human creativity.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}




