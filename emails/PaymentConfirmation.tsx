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

interface PaymentConfirmationProps {
  jobTitle: string;
  company: string;
  amount: number;
  paymentId: string;
  isFeatured: boolean;
  jobUrl: string;
  managementUrl?: string;
}

export const PaymentConfirmation = ({
  jobTitle,
  company,
  amount,
  paymentId,
  isFeatured,
  jobUrl,
  managementUrl,
}: PaymentConfirmationProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://workindatacenter.com';
  const formattedAmount = (amount / 100).toFixed(2);
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Html>
      <Head />
      <Preview>Payment confirmed - Your job posting for {jobTitle} is now live</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Payment Confirmed!</Heading>

          <Text style={text}>
            Thank you for your payment. Your job posting is now live and accepting applications.
          </Text>

          <Section style={receiptBox}>
            <Heading style={receiptHeading}>Receipt</Heading>

            <Text style={receiptLine}>
              <span style={receiptLabel}>Job Title:</span> {jobTitle}
            </Text>

            <Text style={receiptLine}>
              <span style={receiptLabel}>Company:</span> {company}
            </Text>

            <Text style={receiptLine}>
              <span style={receiptLabel}>Listing Type:</span> {isFeatured ? 'Featured Listing' : 'Standard Listing'}
            </Text>

            <Hr style={receiptDivider} />

            <Text style={receiptLine}>
              <span style={receiptLabel}>Amount Paid:</span> <strong>${formattedAmount} USD</strong>
            </Text>

            <Text style={receiptLine}>
              <span style={receiptLabel}>Payment ID:</span> {paymentId}
            </Text>

            <Text style={receiptLine}>
              <span style={receiptLabel}>Date:</span> {date}
            </Text>

            <Text style={receiptLine}>
              <span style={receiptLabel}>Active Until:</span> 30 days from posting
            </Text>

            {isFeatured && (
              <Text style={featuredBadge}>
                Featured for 7 days - Your job will appear at the top of all search results!
              </Text>
            )}
          </Section>

          <Section style={buttonSection}>
            <Button style={button} href={jobUrl}>
              View Your Job Posting
            </Button>
          </Section>

          {managementUrl && (
            <>
              <Text style={text}>
                <strong>Manage Your Job:</strong>
              </Text>
              <Text style={smallText}>
                Edit, update, or delete your job posting at any time: <Link href={managementUrl} style={link}>{managementUrl}</Link>
              </Text>
            </>
          )}

          <Hr style={hr} />

          <Section>
            <Heading style={h2}>What Happens Next?</Heading>

            <Text style={bulletPoint}>
              <strong>Your job is live</strong> - Qualified candidates can now view and apply to your position.
            </Text>

            <Text style={bulletPoint}>
              <strong>Receive applications</strong> - You'll be notified by email when candidates apply.
            </Text>

            <Text style={bulletPoint}>
              <strong>Review candidates</strong> - Access cover letters, resumes, and applicant information.
            </Text>

            <Text style={bulletPoint}>
              <strong>Track performance</strong> - Monitor views and application metrics in real-time.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading style={h2}>Maximize Your Results:</Heading>

            <Text style={text}>
              To attract the best candidates:
            </Text>

            <Text style={bulletPoint}>
              Include detailed job requirements and responsibilities
            </Text>

            <Text style={bulletPoint}>
              Specify required certifications and clearance levels
            </Text>

            <Text style={bulletPoint}>
              Provide competitive salary information
            </Text>

            <Text style={bulletPoint}>
              Respond quickly to qualified applicants
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Questions about your payment or listing?{' '}
            <Link href={`${baseUrl}/contact`} style={link}>
              Contact our support team
            </Link>{' '}
            and we'll be happy to help.
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
            <br />
            <br />
            This is a receipt for your payment. Please keep this email for your records.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PaymentConfirmation;

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

const receiptBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '24px',
  margin: '32px 40px',
};

const receiptHeading = {
  color: '#1e293b',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  padding: '0',
};

const receiptLine = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
};

const receiptLabel = {
  color: '#64748b',
  fontWeight: 'normal' as const,
};

const receiptDivider = {
  borderColor: '#e2e8f0',
  margin: '16px 0',
};

const featuredBadge = {
  backgroundColor: '#fef3c7',
  color: '#92400e',
  fontSize: '14px',
  fontWeight: 'bold',
  padding: '12px',
  borderRadius: '6px',
  margin: '16px 0 0 0',
  textAlign: 'center' as const,
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
