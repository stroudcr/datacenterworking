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

interface JobSeekerWelcomeProps {
  name: string;
}

export const JobSeekerWelcome = ({ name }: JobSeekerWelcomeProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://workindatacenter.com';

  return (
    <Html>
      <Head />
      <Preview>Welcome to Work In Data Center - Your data center career starts here!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Work In Data Center!</Heading>

          <Text style={text}>Hi {name},</Text>

          <Text style={text}>
            Welcome to Work In Data Center - the premier job board connecting skilled professionals like you with top data center employers across the country.
          </Text>

          <Text style={text}>
            Your journey to landing your dream data center role starts now!
          </Text>

          <Section style={benefitsSection}>
            <Heading style={h2}>What You Can Do:</Heading>

            <Text style={bulletPoint}>
              <strong>Browse Hundreds of Jobs</strong> - Explore opportunities across 10 specialized data center categories from operations to cloud infrastructure.
            </Text>

            <Text style={bulletPoint}>
              <strong>Save Your Favorites</strong> - Bookmark jobs you're interested in and track them in your dashboard for easy access.
            </Text>

            <Text style={bulletPoint}>
              <strong>Quick Apply</strong> - Submit applications with your resume and cover letter directly through our platform.
            </Text>

            <Text style={bulletPoint}>
              <strong>Track Applications</strong> - Monitor the status of all your applications from your personal dashboard.
            </Text>

            <Text style={bulletPoint}>
              <strong>Set Up Alerts</strong> - Get notified when new jobs matching your preferences are posted (manage in your notification settings).
            </Text>
          </Section>

          <Section style={buttonSection}>
            <Button style={button} href={baseUrl}>
              Browse Jobs Now
            </Button>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading style={h2}>Quick Start Guide:</Heading>

            <Text style={text}>
              <strong>1. Explore Jobs</strong> - Use our advanced filters to find roles by category, job type, shift requirements, security clearance, and certifications.
            </Text>

            <Text style={text}>
              <strong>2. Save Interesting Jobs</strong> - Click the bookmark icon on any job to save it to your{' '}
              <Link href={`${baseUrl}/dashboard/seeker`} style={link}>
                dashboard
              </Link>{' '}
              for later.
            </Text>

            <Text style={text}>
              <strong>3. Apply with Confidence</strong> - When you find the perfect match, apply with your resume and a personalized cover letter.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading style={h2}>Popular Categories:</Heading>

            <Text style={smallText}>
              Data Center Operations & Production | Critical Facilities & Maintenance | Engineering & Design | Construction & Project Management | IT, Cloud & Network Infrastructure | Security & Compliance | Management & Executive Leadership | Sales & Business Development | Emerging Technologies | Support Functions
            </Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading style={h2}>Pro Tips for Success:</Heading>

            <Text style={bulletPoint}>
              <strong>Update Your Profile</strong> - Make sure your information is current and complete.
            </Text>

            <Text style={bulletPoint}>
              <strong>Customize Applications</strong> - Tailor your cover letter to each position for better results.
            </Text>

            <Text style={bulletPoint}>
              <strong>Set Up Notifications</strong> - Enable job alerts and application updates so you never miss an opportunity.
            </Text>

            <Text style={bulletPoint}>
              <strong>Check Featured Jobs</strong> - These employers are actively hiring and often respond faster to applications.
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Need help? Visit our{' '}
            <Link href={`${baseUrl}/contact`} style={link}>
              contact page
            </Link>{' '}
            or reply to this email with any questions.
          </Text>

          <Text style={text}>
            Good luck with your job search!
            <br />
            <br />
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

export default JobSeekerWelcome;

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
