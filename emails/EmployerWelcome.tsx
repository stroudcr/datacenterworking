import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface EmployerWelcomeProps {
  name: string;
  company?: string;
}

export const EmployerWelcome = ({ name, company }: EmployerWelcomeProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://workindatacenter.com';

  return (
    <Html>
      <Head />
      <Preview>Welcome to Work In Data Center - Start posting jobs today!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Work In Data Center!</Heading>

          <Text style={text}>Hi {name},</Text>

          <Text style={text}>
            Thank you for joining Work In Data Center - the premier job board connecting top employers with skilled data center professionals.
            {company && ` We're excited to have ${company} as part of our community!`}
          </Text>

          <Section style={benefitsSection}>
            <Heading style={h2}>What You Can Do Now:</Heading>

            <Text style={bulletPoint}>
              <strong>Post Your First Job</strong> - Advertise to people searching specifically for data center work.
            </Text>

            <Text style={bulletPoint}>
              <strong>Featured Listings</strong> - Upgrade for seven days of priority placement and a Featured badge.
            </Text>

            <Text style={bulletPoint}>
              <strong>Manage Applicants</strong> - Review applications, track candidates, and manage your hiring pipeline from your employer dashboard.
            </Text>

            <Text style={bulletPoint}>
              <strong>Analytics & Insights</strong> - Monitor job performance with view counts, application rates, and engagement metrics.
            </Text>
          </Section>

          <Section style={buttonSection}>
            <Button style={button} href={`${baseUrl}/post-job`}>
              Post Your First Job
            </Button>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading style={h2}>Quick Start Guide:</Heading>

            <Text style={text}>
              <strong>1. Post a Job</strong> - Click the button above or visit your{' '}
              <Link href={`${baseUrl}/dashboard/employer`} style={link}>
                employer dashboard
              </Link>{' '}
              to get started.
            </Text>

            <Text style={text}>
              <strong>2. Review Applications</strong> - Get notified when candidates apply and review their profiles, resumes, and cover letters.
            </Text>

            <Text style={text}>
              <strong>3. Track Performance</strong> - Monitor how your job postings are performing with real-time analytics.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading style={h2}>Pricing:</Heading>

            <Text style={text}>
              <strong>Standard Listing:</strong> $249 for 30 days
            </Text>

            <Text style={text}>
              <strong>Featured Listing:</strong> +$149 (7 days at the top of all search results)
            </Text>

            <Text style={smallText}>
              Listings support on-site applications, an application email, or a direct link to your ATS.
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Need help? Visit our{' '}
            <Link href={`${baseUrl}/contact`} style={link}>
              contact page
            </Link>{' '}
          </Text>

          <Text style={text}>
            Best regards,
            <br />
            The Work In Data Center Team
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Work In Data Center - Connecting Top Data Center Talent
            <br />
            <Link href={baseUrl} style={link}>
              {baseUrl}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default EmployerWelcome;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#0ea5e9',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0 20px',
  padding: '0 40px',
};

const text = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
};

const bulletPoint = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '12px 0',
  padding: '0 40px',
};

const smallText = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '12px 0',
  padding: '0 40px',
};

const benefitsSection = {
  margin: '32px 0',
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#0ea5e9',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
};

const link = {
  color: '#0ea5e9',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 0',
};

const footer = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '32px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
};
