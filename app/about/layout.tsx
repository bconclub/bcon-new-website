import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | BCON Club',
  description: 'Human X AI powered marketing. Creative minds that code, technical hands that design.',
  openGraph: {
    title: 'About Us | BCON Club',
    description: 'The team behind intelligent marketing systems',
  }
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


