import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Successful',
  robots: {
    index: false,
    follow: true,
  },
};

export default function PostJobSuccessLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
