import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.workindatacenter.com';

export const metadata: Metadata = {
  title: 'Resources & Insights | Work In Data Center',
  description: 'In-depth guides, industry reports, salary data, and career resources to help you succeed in the data center industry. Expert insights on certifications, skills, and career advancement.',
  keywords: ['data center resources', 'career guides', 'salary guide', 'certifications', 'industry reports', 'data center careers', 'technician training'],
  openGraph: {
    type: 'website',
    title: 'Resources & Insights | Work In Data Center',
    description: 'In-depth guides, industry reports, salary data, and career resources to help you succeed in the data center industry.',
    url: `${siteUrl}/resources`,
    siteName: 'Work In Data Center',
    images: [
      {
        url: `${siteUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Work In Data Center Resources',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resources & Insights | Work In Data Center',
    description: 'In-depth guides, industry reports, salary data, and career resources to help you succeed in the data center industry.',
    images: [`${siteUrl}/images/og-image.jpg`],
  },
  alternates: {
    canonical: `${siteUrl}/resources`,
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
