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

interface JobExpirationReminderProps {
  jobTitle: string;
  company: string;
  viewCount: number;
  applicationCount: number;
  jobUrl: string;
  managementUrl?: string;
}

export const JobExpirationReminder = ({
  jobTitle,
  company,
  viewCount,
  applicationCount,
  jobUrl,
  managementUrl,
}: JobExpirationReminderProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://workindatacenter.com';

  return (
    <Html>
      <Head />
      <Preview>Your job posting expires tomorrow - {jobTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your Job Expires Tomorrow!</Heading>

          <Section style={urgentBox}>
            <Text style={urgentText}>
              ⏰ Your job posting for <strong>{jobTitle}</strong> at {company} will expire in 24 hours.
            </Text>
          </Section>

          <Text style={text}>
            After tomorrow, your job posting will no longer be visible to candidates on Work In Data Center.
          </Text>

          <Hr style={hr} />

          <Section>
            <Heading style={h2}>Job Performance Summary:</Heading>

            <Section style={statsBox}>
              <Section style={statItem}>
                <Text style={statNumber}>{viewCount}</Text>
                <Text style={statLabel}>Total Views</Text>
              </Section>

              <Section style={statItem}>
                <Text style={statNumber}>{applicationCount}</Text>
                <Text style={statLabel}>Applications Received</Text>
              </Section>
            </Section>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading style={h2}>What Happens Next?</Heading>

            <Text style={bulletPoint}>
              <strong>Tomorrow:</strong> Your job posting will be marked as expired and removed from search results.
            </Text>

            <Text style={bulletPoint}>
              <strong>Your Applications:</strong> You can still view and manage all applications you've received.
            </Text>

            <Text style={bulletPoint}>
              <strong>Post Again:</strong> If you're still hiring, consider posting the job again to continue receiving qualified candidates.
            </Text>
          </Section>

          <Section style={buttonSection}>
            <Button style={button} href={jobUrl}>
              View Your Job Posting
            </Button>
          </Section>

          {managementUrl && (
            <Text style={smallText}>
              Manage your job posting: <Link href={managementUrl} style={link}>{managementUrl}</Link>
            </Text>
          )}

          <Hr style={hr} />

          <Section style={tipBox}>
            <Text style={tipText}>
              <strong>Tip:</strong> Jobs remain active for 30 days. Featured listings receive priority placement for 7 days.
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Need help or have questions?{' '}
            <Link href={`${baseUrl}/contact`} style={link}>
              Contact our support team
            </Link>.
          </Text>

          <Text style={smallText}>
            Don't want to receive expiration reminders?{' '}
            <Link href={`${baseUrl}/dashboard/employer/settings`} style={link}>
              Update your notification preferences
            </Link>.
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

export default JobExpirationReminder;

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

const urgentBox = {
  backgroundColor: '#fef2f2',
  border: '2px solid #ef4444',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 40px',
};

const urgentText = {
  color: '#991b1b',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
  textAlign: 'center' as const,
};

const statsBox = {
  display: 'flex',
  justifyContent: 'center',
  gap: '40px',
  margin: '20px 40px',
  backgroundColor: '#f8fafc',
  padding: '24px',
  borderRadius: '8px',
};

const statItem = {
  textAlign: 'center' as const,
  flex: '1',
};

const statNumber = {
  color: '#0ea5e9',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const statLabel = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0',
};

const tipBox = {
  backgroundColor: '#f0f9ff',
  borderLeft: '4px solid #0ea5e9',
  padding: '16px 20px',
  margin: '24px 40px',
};

const tipText = {
  color: '#0c4a6e',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
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
  wordBreak: 'break-all' as const,
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
