import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Work | BCON Club',
  description: 'Portfolio of AI-powered marketing systems, case studies, and business applications we\'ve built.',
  openGraph: {
    title: 'Our Work | BCON Club',
    description: 'AI-powered marketing systems and business apps',
  }
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


