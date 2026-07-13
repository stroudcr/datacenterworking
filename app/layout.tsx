import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { HeaderServer } from '@/components/HeaderServer';
import { HeaderSkeleton } from '@/components/HeaderSkeleton';
import { Footer } from '@/components/Footer';
import { Analytics } from '@vercel/analytics/next';
import { AttributionCapture } from '@/components/AttributionCapture';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site-config';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Premium Data Center Career Opportunities`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['data center jobs', 'data center careers', 'data center operations', 'data center engineering', 'IT infrastructure jobs', 'CDCP', 'data center technician'],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/images/favicon.ico',
    apple: '/images/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Premium Data Center Career Opportunities`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: absoluteUrl('/images/og-image.jpg'),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Find Your Next Data Center Job`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Premium Data Center Career Opportunities`,
    description: 'Find top data center jobs in operations, engineering, IT, security, and more.',
    images: [absoluteUrl('/images/og-image.jpg')],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization schema for the entire site
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: 'WorkInDataCenter',
    url: SITE_URL,
    logo: absoluteUrl('/images/NavLogo.png'),
    description: 'Premium job board connecting data center professionals with top employers across operations, engineering, IT infrastructure, and more.',
    email: 'info@workindatacenter.com',
    foundingDate: '2024',
    slogan: 'Find Your Next Data Center Job',
    knowsAbout: [
      'Data Center Operations',
      'Data Center Engineering',
      'IT Infrastructure',
      'Critical Facilities Management',
      'Data Center Careers',
      'CDCP Certification',
      'Data Center Jobs',
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-JETQMH1ND4"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-JETQMH1ND4');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <Suspense fallback={<HeaderSkeleton />}>
          <HeaderServer />
        </Suspense>
        {children}
        <Footer />
        <Suspense fallback={null}><AttributionCapture /></Suspense>
        <Analytics />
      </body>
    </html>
  );
}
