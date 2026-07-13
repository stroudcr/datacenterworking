import { Resend } from 'resend';
import { EmployerWelcome } from '@/emails/EmployerWelcome';
import { JobSeekerWelcome } from '@/emails/JobSeekerWelcome';
import { ManagementLink } from '@/emails/ManagementLink';
import { PaymentConfirmation } from '@/emails/PaymentConfirmation';
import { NewApplication } from '@/emails/NewApplication';
import { ContactForm } from '@/emails/ContactForm';
import { JobExpirationReminder } from '@/emails/JobExpirationReminder';

// Resend now validates constructor input eagerly. Individual send functions still
// short-circuit when the key is absent, while this placeholder keeps builds safe.
const resend = new Resend(process.env.RESEND_API_KEY || 're_not_configured');

// Enhanced logging helper
function logEmailError(emailType: string, error: any, recipient: string) {
  console.error(`[EMAIL ERROR] ${new Date().toISOString()}`);
  console.error(`Type: ${emailType}`);
  console.error(`Recipient: ${recipient}`);
  console.error(`Error:`, JSON.stringify(error, null, 2));
  console.error(`API Key configured: ${!!process.env.RESEND_API_KEY}`);
  console.error(`Email From: ${process.env.EMAIL_FROM || 'noreply@workindatacenter.com'}`);
}

function logEmailSuccess(emailType: string, emailId: string | undefined, recipient: string) {
  console.log(`[EMAIL SUCCESS] ${new Date().toISOString()}`);
  console.log(`Type: ${emailType}`);
  console.log(`Recipient: ${recipient}`);
  console.log(`Email ID: ${emailId || 'N/A'}`);
}

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
        logEmailError('Employer Welcome', error, to);
        return { success: false, error };
      }

      logEmailSuccess('Employer Welcome', data?.id, to);
      return { success: true, data };
    } else {
      const { data, error } = await resend.emails.send({
        from,
        to,
        subject: 'Welcome to Work In Data Center - Your Career Starts Here!',
        react: JobSeekerWelcome({ name }),
      });

      if (error) {
        logEmailError('Job Seeker Welcome', error, to);
        return { success: false, error };
      }

      logEmailSuccess('Job Seeker Welcome', data?.id, to);
      return { success: true, data };
    }
  } catch (error) {
    logEmailError('Welcome Email (Catch)', error, to);
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
      logEmailError('Management Link', error, to);
      return { success: false, error };
    }

    logEmailSuccess('Management Link', data?.id, to);
    return { success: true, data };
  } catch (error) {
    logEmailError('Management Link (Catch)', error, to);
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
      logEmailError('Payment Confirmation', error, to);
      return { success: false, error };
    }

    logEmailSuccess('Payment Confirmation', data?.id, to);
    return { success: true, data };
  } catch (error) {
    logEmailError('Payment Confirmation (Catch)', error, to);
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
      logEmailError('Application Notification', error, to);
      return { success: false, error };
    }

    logEmailSuccess('Application Notification', data?.id, to);
    return { success: true, data };
  } catch (error) {
    logEmailError('Application Notification (Catch)', error, to);
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
      logEmailError('Contact Form', error, adminEmail);
      return { success: false, error };
    }

    logEmailSuccess('Contact Form', data?.id, adminEmail);
    return { success: true, data };
  } catch (error) {
    logEmailError('Contact Form (Catch)', error, adminEmail);
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
      logEmailError('Job Expiration Reminder', error, to);
      return { success: false, error };
    }

    logEmailSuccess('Job Expiration Reminder', data?.id, to);
    return { success: true, data };
  } catch (error) {
    logEmailError('Job Expiration Reminder (Catch)', error, to);
    return { success: false, error };
  }
}

// Additional email functions can be added here:
// - sendWeeklyAnalytics()
// - sendJobAlerts()
// etc.
