import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Application Submitted',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ApplicationSuccessLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
