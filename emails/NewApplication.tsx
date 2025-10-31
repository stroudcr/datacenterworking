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

interface NewApplicationProps {
  jobTitle: string;
  company: string;
  applicantName: string;
  applicantEmail: string;
  coverLetter?: string;
  resumeUrl?: string;
  applicantsPageUrl: string;
}

export const NewApplication = ({
  jobTitle,
  company,
  applicantName,
  applicantEmail,
  coverLetter,
  resumeUrl,
  applicantsPageUrl,
}: NewApplicationProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://workindatacenter.com';
  const coverLetterPreview = coverLetter ? coverLetter.substring(0, 200) : null;
  const hasMoreContent = coverLetter && coverLetter.length > 200;

  return (
    <Html>
      <Head />
      <Preview>New application for {jobTitle} from {applicantName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Application Received!</Heading>

          <Text style={text}>
            Great news! A candidate has applied to your job posting.
          </Text>

          <Section style={jobBox}>
            <Text style={jobTitleStyle}>
              <strong>Position:</strong> {jobTitle}
            </Text>
            <Text style={jobCompanyStyle}>
              {company}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading style={h2}>Applicant Details:</Heading>

            <Text style={applicantInfo}>
              <strong>Name:</strong> {applicantName}
            </Text>

            <Text style={applicantInfo}>
              <strong>Email:</strong>{' '}
              <Link href={`mailto:${applicantEmail}`} style={link}>
                {applicantEmail}
              </Link>
            </Text>

            {resumeUrl && (
              <Text style={applicantInfo}>
                <strong>Resume:</strong>{' '}
                <Link href={resumeUrl} style={link}>
                  Download Resume
                </Link>
              </Text>
            )}
          </Section>

          {coverLetterPreview && (
            <>
              <Hr style={hr} />

              <Section>
                <Heading style={h2}>Cover Letter Preview:</Heading>

                <Section style={coverLetterBox}>
                  <Text style={coverLetterText}>
                    {coverLetterPreview}
                    {hasMoreContent && '...'}
                  </Text>
                </Section>

                {hasMoreContent && (
                  <Text style={smallText}>
                    View the full cover letter in your dashboard
                  </Text>
                )}
              </Section>
            </>
          )}

          <Section style={buttonSection}>
            <Button style={button} href={applicantsPageUrl}>
              View All Applicants
            </Button>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading style={h2}>Next Steps:</Heading>

            <Text style={bulletPoint}>
              <strong>Review the application</strong> - Check the candidate's resume and cover letter in detail.
            </Text>

            <Text style={bulletPoint}>
              <strong>Respond promptly</strong> - Top candidates are often considering multiple opportunities.
            </Text>

            <Text style={bulletPoint}>
              <strong>Schedule an interview</strong> - If they're a good fit, reach out directly via email.
            </Text>

            <Text style={bulletPoint}>
              <strong>Update status</strong> - Mark applications as reviewed to keep track of your hiring pipeline.
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            You can manage all your job postings and applicants from your{' '}
            <Link href={`${baseUrl}/dashboard/employer`} style={link}>
              employer dashboard
            </Link>.
          </Text>

          <Text style={smallText}>
            Don't want to receive application notifications?{' '}
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

export default NewApplication;

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

const jobBox = {
  backgroundColor: '#f0f9ff',
  border: '2px solid #0ea5e9',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 40px',
  textAlign: 'center' as const,
};

const jobTitleStyle = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const jobCompanyStyle = {
  color: '#64748b',
  fontSize: '16px',
  margin: '0',
};

const applicantInfo = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '12px 0',
  padding: '0 40px',
};

const coverLetterBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
  margin: '16px 40px',
};

const coverLetterText = {
  color: '#475569',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
  fontStyle: 'italic' as const,
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
