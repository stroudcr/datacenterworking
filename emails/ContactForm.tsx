import {
  Body,
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

interface ContactFormProps {
  name: string;
  email: string;
  inquiryType: string;
  subject: string;
  message: string;
}

export const ContactForm = ({
  name,
  email,
  inquiryType,
  subject,
  message,
}: ContactFormProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://workindatacenter.com';
  const date = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Html>
      <Head />
      <Preview>Contact form submission from {name} - {subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Form Submission</Heading>

          <Section style={infoBox}>
            <Text style={infoLine}>
              <span style={label}>Submitted:</span> {date}
            </Text>

            <Text style={infoLine}>
              <span style={label}>Name:</span> {name}
            </Text>

            <Text style={infoLine}>
              <span style={label}>Email:</span>{' '}
              <Link href={`mailto:${email}`} style={link}>
                {email}
              </Link>
            </Text>

            <Text style={infoLine}>
              <span style={label}>Inquiry Type:</span> {inquiryType}
            </Text>

            <Text style={infoLine}>
              <span style={label}>Subject:</span> {subject}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading style={h2}>Message:</Heading>

            <Section style={messageBox}>
              <Text style={messageText}>{message}</Text>
            </Section>
          </Section>

          <Hr style={hr} />

          <Text style={helpText}>
            <strong>Reply Instructions:</strong>
            <br />
            Simply reply to this email to respond directly to {name} at {email}.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Work In Data Center - Contact Form Submission
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

export default ContactForm;

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
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1e293b',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '20px 0 16px',
  padding: '0 40px',
};

const infoBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 40px',
};

const infoLine = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
};

const label = {
  color: '#64748b',
  fontWeight: 'bold' as const,
  display: 'inline-block',
  minWidth: '120px',
};

const messageBox = {
  backgroundColor: '#ffffff',
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
  margin: '16px 40px',
};

const messageText = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const helpText = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '22px',
  backgroundColor: '#f0f9ff',
  borderLeft: '4px solid #0ea5e9',
  padding: '16px 20px',
  margin: '16px 40px',
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
