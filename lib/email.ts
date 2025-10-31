import { Resend } from 'resend';
import { EmployerWelcome } from '@/emails/EmployerWelcome';
import { JobSeekerWelcome } from '@/emails/JobSeekerWelcome';
import { ManagementLink } from '@/emails/ManagementLink';
import { PaymentConfirmation } from '@/emails/PaymentConfirmation';
import { NewApplication } from '@/emails/NewApplication';
import { ContactForm } from '@/emails/ContactForm';
import { JobExpirationReminder } from '@/emails/JobExpirationReminder';

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

// Management Link Email for Guest Job Posters
interface SendManagementLinkEmailParams {
  to: string;
  jobTitle: string;
  company: string;
  managementUrl: string;
}

export async function sendManagementLinkEmail({
  to,
  jobTitle,
  company,
  managementUrl,
}: SendManagementLinkEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Skipping management link email.');
    return { success: false, error: 'Email service not configured' };
  }

  const from = process.env.EMAIL_FROM || 'noreply@workindatacenter.com';

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: `Your Job Posting is Live - ${jobTitle}`,
      react: ManagementLink({ jobTitle, company, managementUrl }),
    });

    if (error) {
      console.error('Failed to send management link email:', error);
      return { success: false, error };
    }

    console.log('Management link email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending management link email:', error);
    return { success: false, error };
  }
}

// Payment Confirmation Email
interface SendPaymentConfirmationParams {
  to: string;
  jobTitle: string;
  company: string;
  amount: number;
  paymentId: string;
  isFeatured: boolean;
  jobUrl: string;
  managementUrl?: string;
}

export async function sendPaymentConfirmation({
  to,
  jobTitle,
  company,
  amount,
  paymentId,
  isFeatured,
  jobUrl,
  managementUrl,
}: SendPaymentConfirmationParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Skipping payment confirmation email.');
    return { success: false, error: 'Email service not configured' };
  }

  const from = process.env.EMAIL_FROM || 'noreply@workindatacenter.com';

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: `Payment Confirmed - ${jobTitle} is Now Live`,
      react: PaymentConfirmation({
        jobTitle,
        company,
        amount,
        paymentId,
        isFeatured,
        jobUrl,
        managementUrl,
      }),
    });

    if (error) {
      console.error('Failed to send payment confirmation email:', error);
      return { success: false, error };
    }

    console.log('Payment confirmation email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return { success: false, error };
  }
}

// Application Notification Email to Employers
interface SendApplicationNotificationParams {
  to: string;
  jobTitle: string;
  company: string;
  applicantName: string;
  applicantEmail: string;
  coverLetter?: string;
  resumeUrl?: string;
  applicantsPageUrl: string;
}

export async function sendApplicationNotification({
  to,
  jobTitle,
  company,
  applicantName,
  applicantEmail,
  coverLetter,
  resumeUrl,
  applicantsPageUrl,
}: SendApplicationNotificationParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Skipping application notification email.');
    return { success: false, error: 'Email service not configured' };
  }

  const from = process.env.EMAIL_FROM || 'noreply@workindatacenter.com';

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: `New Application: ${jobTitle} - ${applicantName}`,
      react: NewApplication({
        jobTitle,
        company,
        applicantName,
        applicantEmail,
        coverLetter,
        resumeUrl,
        applicantsPageUrl,
      }),
    });

    if (error) {
      console.error('Failed to send application notification email:', error);
      return { success: false, error };
    }

    console.log('Application notification email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending application notification email:', error);
    return { success: false, error };
  }
}

// Contact Form Email to Admin
interface SendContactFormEmailParams {
  name: string;
  email: string;
  inquiryType: string;
  subject: string;
  message: string;
}

export async function sendContactFormEmail({
  name,
  email,
  inquiryType,
  subject,
  message,
}: SendContactFormEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Skipping contact form email.');
    return { success: false, error: 'Email service not configured' };
  }

  const from = process.env.EMAIL_FROM || 'noreply@workindatacenter.com';
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error('ADMIN_EMAIL not configured. Cannot send contact form email.');
    return { success: false, error: 'Admin email not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: adminEmail,
      replyTo: email, // Allow admin to reply directly to the sender
      subject: `Contact Form: ${subject}`,
      react: ContactForm({
        name,
        email,
        inquiryType,
        subject,
        message,
      }),
    });

    if (error) {
      console.error('Failed to send contact form email:', error);
      return { success: false, error };
    }

    console.log('Contact form email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending contact form email:', error);
    return { success: false, error };
  }
}

// Job Expiration Reminder Email
interface SendJobExpirationReminderParams {
  to: string;
  jobTitle: string;
  company: string;
  viewCount: number;
  applicationCount: number;
  jobUrl: string;
  managementUrl?: string;
}

export async function sendJobExpirationReminder({
  to,
  jobTitle,
  company,
  viewCount,
  applicationCount,
  jobUrl,
  managementUrl,
}: SendJobExpirationReminderParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Skipping expiration reminder email.');
    return { success: false, error: 'Email service not configured' };
  }

  const from = process.env.EMAIL_FROM || 'noreply@workindatacenter.com';

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: `Your Job Expires Tomorrow - ${jobTitle}`,
      react: JobExpirationReminder({
        jobTitle,
        company,
        viewCount,
        applicationCount,
        jobUrl,
        managementUrl,
      }),
    });

    if (error) {
      console.error('Failed to send expiration reminder email:', error);
      return { success: false, error };
    }

    console.log('Expiration reminder email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending expiration reminder email:', error);
    return { success: false, error };
  }
}

// Additional email functions can be added here:
// - sendWeeklyAnalytics()
// - sendJobAlerts()
// etc.
