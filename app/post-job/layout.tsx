import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Post a Data Center Job',
  description: 'Post a data center job and reach qualified technicians, engineers, facilities specialists, and operations professionals.',
  alternates: {
    canonical: absoluteUrl('/post-job'),
  },
  openGraph: {
    title: 'Post a Data Center Job',
    description: 'Reach qualified data center technicians, engineers, facilities specialists, and operations professionals.',
    url: absoluteUrl('/post-job'),
  },
};

export default function PostJobLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
