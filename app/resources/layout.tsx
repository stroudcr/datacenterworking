import { Metadata } from 'next';
import { SITE_NAME, absoluteUrl } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Resources & Insights',
  description: 'In-depth guides, industry reports, salary data, and career resources to help you succeed in the data center industry. Expert insights on certifications, skills, and career advancement.',
  keywords: ['data center resources', 'career guides', 'salary guide', 'certifications', 'industry reports', 'data center careers', 'technician training'],
  openGraph: {
    type: 'website',
    title: `Resources & Insights | ${SITE_NAME}`,
    description: 'In-depth guides, industry reports, salary data, and career resources to help you succeed in the data center industry.',
    url: absoluteUrl('/resources'),
    siteName: SITE_NAME,
    images: [
      {
        url: absoluteUrl('/images/og-image.jpg'),
        width: 1200,
        height: 630,
        alt: 'Work In Data Center Resources',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Resources & Insights | ${SITE_NAME}`,
    description: 'In-depth guides, industry reports, salary data, and career resources to help you succeed in the data center industry.',
    images: [absoluteUrl('/images/og-image.jpg')],
  },
  alternates: {
    canonical: absoluteUrl('/resources'),
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
