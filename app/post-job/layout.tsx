import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site-config';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Post a Data Center Job',
  description: 'Post a data center job for technicians, engineers, facilities specialists, and operations professionals.',
  alternates: {
    canonical: absoluteUrl('/post-job'),
  },
  openGraph: {
    title: 'Post a Data Center Job',
    description: 'Advertise to data center technicians, engineers, facilities specialists, and operations professionals.',
    url: absoluteUrl('/post-job'),
  },
};

export default function PostJobLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Suspense fallback={<div className="min-h-screen" />}>{children}</Suspense>;
}
