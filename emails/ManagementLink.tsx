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

interface ManagementLinkProps {
  jobTitle: string;
  company: string;
  managementUrl: string;
}

export const ManagementLink = ({ jobTitle, company, managementUrl }: ManagementLinkProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://workindatacenter.com';

  return (
    <Html>
      <Head />
      <Preview>Your job posting is live - Manage your listing for {jobTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your Job Posting is Live!</Heading>

          <Text style={text}>
            Congratulations! Your job posting for <strong>{jobTitle}</strong> at {company} has been successfully published on Work In Data Center.
          </Text>

          <Section style={highlightBox}>
            <Text style={highlightText}>
              <strong>Important:</strong> Save this email! You'll need the management link below to edit or delete your job posting.
            </Text>
          </Section>

          <Section style={buttonSection}>
            <Button style={button} href={managementUrl}>
              Manage Your Job Posting
            </Button>
          </Section>

          <Text style={smallText}>
            Or copy this link: <Link href={managementUrl} style={link}>{managementUrl}</Link>
          </Text>

          <Hr style={hr} />

          <Section>
            <Heading style={h2}>What You Can Do:</Heading>

            <Text style={bulletPoint}>
              <strong>Edit Your Job</strong> - Update job details, requirements, or salary information at any time.
            </Text>

            <Text style={bulletPoint}>
              <strong>View Applications</strong> - Review candidates who have applied to your position.
            </Text>

            <Text style={bulletPoint}>
              <strong>Delete Listing</strong> - Remove your job posting when the position is filled.
            </Text>

            <Text style={bulletPoint}>
              <strong>Track Performance</strong> - See view counts and application metrics.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading style={h2}>Your Job Details:</Heading>

            <Text style={text}>
              <strong>Position:</strong> {jobTitle}
            </Text>

            <Text style={text}>
              <strong>Company:</strong> {company}
            </Text>

            <Text style={text}>
              <strong>Active For:</strong> 30 days
            </Text>

            <Text style={text}>
              <strong>Status:</strong> Live and accepting applications
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Want to create an employer account for easier job management?{' '}
            <Link href={`${baseUrl}/register?role=employer`} style={link}>
              Register here
            </Link>{' '}
            to access your employer dashboard and manage all your job postings in one place.
          </Text>

          <Text style={text}>
            Need help? Visit our{' '}
            <Link href={`${baseUrl}/contact`} style={link}>
              contact page
            </Link>{' '}
            or reply to this email with any questions.
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

export default ManagementLink;

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

const highlightBox = {
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #f59e0b',
  padding: '16px 20px',
  margin: '24px 40px',
  borderRadius: '4px',
};

const highlightText = {
  color: '#92400e',
  fontSize: '16px',
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
