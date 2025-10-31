import { Resend } from 'resend';
import { EmployerWelcome } from '@/emails/EmployerWelcome';
import { JobSeekerWelcome } from '@/emails/JobSeekerWelcome';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendWelcomeEmailParams {
  to: string;
  name: string;
  role: 'EMPLOYER' | 'JOB_SEEKER';
  company?: string;
}

export async function sendWelcomeEmail({
  to,
  name,
  role,
  company,
}: SendWelcomeEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Skipping welcome email.');
    return { success: false, error: 'Email service not configured' };
  }

  const from = process.env.EMAIL_FROM || 'noreply@workindatacenter.com';

  try {
    if (role === 'EMPLOYER') {
      const { data, error } = await resend.emails.send({
        from,
        to,
        subject: 'Welcome to Work In Data Center - Start Posting Jobs Today!',
        react: EmployerWelcome({ name, company }),
      });

      if (error) {
        console.error('Failed to send employer welcome email:', error);
        return { success: false, error };
      }

      console.log('Employer welcome email sent successfully:', data?.id);
      return { success: true, data };
    } else {
      const { data, error } = await resend.emails.send({
        from,
        to,
        subject: 'Welcome to Work In Data Center - Your Career Starts Here!',
        react: JobSeekerWelcome({ name }),
      });

      if (error) {
        console.error('Failed to send job seeker welcome email:', error);
        return { success: false, error };
      }

      console.log('Job seeker welcome email sent successfully:', data?.id);
      return { success: true, data };
    }
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

// Additional email functions can be added here:
// - sendJobExpirationReminder()
// - sendApplicationNotification()
// - sendPaymentConfirmation()
// etc.
