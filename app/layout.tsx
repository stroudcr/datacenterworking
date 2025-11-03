import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getSession } from '@/lib/auth';
import { Analytics } from '@vercel/analytics/next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://workindatacenter.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Work In Data Center - Premium Data Center Career Opportunities',
    template: '%s | Work In Data Center',
  },
  description: 'Find top data center jobs in operations, engineering, IT, security, and more. Post jobs and connect with qualified professionals in the data center industry.',
  keywords: ['data center jobs', 'data center careers', 'data center operations', 'data center engineering', 'IT infrastructure jobs', 'CDCP', 'data center technician'],
  authors: [{ name: 'Work In Data Center' }],
  creator: 'Work In Data Center',
  publisher: 'Work In Data Center',
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
    url: siteUrl,
    siteName: 'Work In Data Center',
    title: 'Work In Data Center - Premium Data Center Career Opportunities',
    description: 'Find top data center jobs in operations, engineering, IT, security, and more. Post jobs and connect with qualified professionals.',
    images: [
      {
        url: `${siteUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Work In Data Center - Find Your Next Data Center Job',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work In Data Center - Premium Data Center Career Opportunities',
    description: 'Find top data center jobs in operations, engineering, IT, security, and more.',
    images: [`${siteUrl}/images/og-image.png`],
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
  alternates: {
    canonical: siteUrl,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  // Organization schema for the entire site
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Work In Data Center',
    alternateName: 'WorkInDataCenter',
    url: siteUrl,
    logo: `${siteUrl}/images/NavLogo.png`,
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
        <Header
          user={
            session
              ? {
                  name: session.name,
                  email: session.email,
                  role: session.role,
                }
              : null
          }
        />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
