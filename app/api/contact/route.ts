import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';
import { sendContactFormEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = contactSchema.parse(body);

    // Log the submission
    console.log('Contact form submission:', {
      name: validatedData.name,
      email: validatedData.email,
      inquiryType: validatedData.inquiryType,
      subject: validatedData.subject,
      timestamp: new Date().toISOString(),
    });

    // Send email to admin team
    const emailResult = await sendContactFormEmail({
      name: validatedData.name,
      email: validatedData.email,
      inquiryType: validatedData.inquiryType,
      subject: validatedData.subject,
      message: validatedData.message,
    });

    if (!emailResult.success) {
      console.error('Failed to send contact form email, but continuing...');
      // We still return success to the user even if email fails
      // since we logged the submission
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We\'ll get back to you within 24-48 hours.'
    });
  } catch (error: any) {
    console.error('Contact form submission error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
