import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Work In Data Center for job seeker support, employer questions, partnerships, and technical help.',
  alternates: {
    canonical: absoluteUrl('/contact'),
  },
  openGraph: {
    title: 'Contact Work In Data Center',
    description: 'Contact Work In Data Center for job seeker support, employer questions, partnerships, and technical help.',
    url: absoluteUrl('/contact'),
  },
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
