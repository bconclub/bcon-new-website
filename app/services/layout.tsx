import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services | BCON Club',
  description: 'AI marketing automation, business systems, and creative solutions for growing businesses.',
  openGraph: {
    title: 'Services | BCON Club',
    description: 'AI marketing & business automation',
  }
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


