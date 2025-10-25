import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'DataCenter Jobs - Premium Data Center Career Opportunities',
  description: 'Find top data center jobs in operations, engineering, IT, security, and more. Post jobs and connect with qualified professionals.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <body>
        <Header
          user={
            session
              ? {
                  name: session.email.split('@')[0],
                  role: session.role,
                }
              : null
          }
        />
        {children}
      </body>
    </html>
  );
}
